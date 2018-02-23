(function(){
  var polymer_ext, ref$, add_new_intervention, set_override_enabled_interventions_once, list_custom_interventions, remove_custom_intervention, list_all_interventions, get_intervention_info, get_interventions, clear_cache_all_interventions, get_enabled_interventions, set_intervention_disabled, set_intervention_enabled, as_array, get_goals, get_enabled_goals, list_all_goals, add_requires_to_intervention_info, compile_intervention_code, run_all_checks, memoizeSingleAsync, load_css_file, once_true, sleep, get_active_tab_id, list_currently_loaded_interventions, open_debug_page_for_tab_id, get_goal_info, upload_intervention, systemjsget, swal, lodash, $;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  ref$ = require('libs_backend/intervention_utils'), add_new_intervention = ref$.add_new_intervention, set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once, list_custom_interventions = ref$.list_custom_interventions, remove_custom_intervention = ref$.remove_custom_intervention, list_all_interventions = ref$.list_all_interventions, get_intervention_info = ref$.get_intervention_info, get_interventions = ref$.get_interventions, clear_cache_all_interventions = ref$.clear_cache_all_interventions, get_enabled_interventions = ref$.get_enabled_interventions, set_intervention_disabled = ref$.set_intervention_disabled, set_intervention_enabled = ref$.set_intervention_enabled;
  as_array = require('libs_common/collection_utils').as_array;
  ref$ = require('libs_backend/goal_utils'), get_goals = ref$.get_goals, get_enabled_goals = ref$.get_enabled_goals, list_all_goals = ref$.list_all_goals;
  ref$ = require('libs_backend/intervention_editor_utils'), add_requires_to_intervention_info = ref$.add_requires_to_intervention_info, compile_intervention_code = ref$.compile_intervention_code;
  run_all_checks = require('libs_backend/intervention_bug_catching_rules').run_all_checks;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_common/common_libs'), once_true = ref$.once_true, sleep = ref$.sleep;
  ref$ = require('libs_backend/background_common'), get_active_tab_id = ref$.get_active_tab_id, list_currently_loaded_interventions = ref$.list_currently_loaded_interventions;
  open_debug_page_for_tab_id = require('libs_backend/debug_console_utils').open_debug_page_for_tab_id;
  get_goal_info = require('libs_common/goal_utils').get_goal_info;
  upload_intervention = require('libs_backend/intervention_sharing_utils').upload_intervention;
  systemjsget = require('libs_backend/cacheget_utils').systemjsget;
  swal = require('sweetalert2');
  lodash = require('lodash');
  $ = require('jquery');
  polymer_ext({
    is: 'intervention-editor',
    properties: {
      width: {
        type: String,
        value: '38px'
      },
      height: {
        type: String,
        value: '38px'
      },
      goal_info_list: {
        type: Array
      },
      intervention_list: {
        type: Array
      },
      intervention_info: {
        type: Object
      },
      js_editors: {
        type: Object,
        value: {}
      },
      opened_intervention_list: {
        type: Array,
        value: [],
        observer: 'opened_intervention_list_changed'
      },
      selected_tab_idx: {
        type: Number,
        value: 0,
        observer: 'selected_tab_idx_changed'
      },
      pill_button_idx: {
        type: Number
      },
      pill_button_idxes: {
        type: Object,
        value: {}
      },
      is_tutorial_shown: {
        type: Boolean,
        value: true
      },
      is_apidoc_shown: {
        type: Boolean,
        value: false,
        observer: 'is_apidoc_shown_changed'
      },
      is_on_tutorial_tab: {
        type: Boolean,
        computed: 'compute_is_on_tutorial_tab(is_tutorial_shown, selected_tab_idx)'
      },
      api_markdown_text: {
        type: String
      },
      last_edited_times: {
        type: Object,
        value: {}
      },
      previous_intervention_text: {
        type: Object,
        value: {}
      },
      current_intervention_name: {
        type: Object,
        computed: 'compute_current_intervention_name(opened_intervention_list, selected_tab_idx)'
      }
    },
    compute_current_intervention_name: function(opened_intervention_list, selected_tab_idx){
      return opened_intervention_list[selected_tab_idx - 1];
    },
    is_apidoc_shown_changed: function(is_apidoc_shown){
      if (is_apidoc_shown) {
        return this.SM('.resizable_editor_div').removeClass('editor_div_wide').addClass('editor_div_narrow');
      } else {
        return this.SM('.resizable_editor_div').removeClass('editor_div_narrow').addClass('editor_div_wide');
      }
    },
    hide_docs_clicked: function(){
      var js_editor;
      this.is_apidoc_shown = false;
      js_editor = this.js_editors[this.current_intervention_name];
      if (js_editor != null) {
        js_editor.session.setUseWrapMode(false);
        return js_editor.session.setUseWrapMode(true);
      }
    },
    show_docs_clicked: function(){
      var js_editor;
      this.is_apidoc_shown = true;
      js_editor = this.js_editors[this.current_intervention_name];
      if (js_editor != null) {
        js_editor.session.setUseWrapMode(false);
        return js_editor.session.setUseWrapMode(true);
      }
    },
    compute_is_on_tutorial_tab: function(is_tutorial_shown, selected_tab_idx){
      return is_tutorial_shown && selected_tab_idx === 0;
    },
    pill_button_selected: function(evt){
      if (evt.detail.buttonidx === 0) {
        set_intervention_disabled(this.get_intervention_name());
        return this.pill_button_idx = this.pill_button_idxes[this.get_intervention_name()] = 0;
      } else {
        set_intervention_enabled(this.get_intervention_name());
        return this.pill_button_idx = this.pill_button_idxes[this.get_intervention_name()] = 1;
      }
    },
    selected_tab_idx_changed: async function(){
      while (this.get_intervention_name() == null) {
        (await sleep(100));
      }
      return this.pill_button_idx = this.pill_button_idxes[this.get_intervention_name()];
    },
    get_intervention_name: function(){
      if (this.opened_intervention_list != null) {
        return this.opened_intervention_list[this.selected_tab_idx - 1];
      }
    },
    save_intervention: async function(){
      var self, intervention_name, js_editor, code, intervention_info, display_name, new_intervention_info, debug_code;
      self = this;
      intervention_name = self.get_intervention_name();
      js_editor = this.js_editors[intervention_name];
      code = js_editor.getSession().getValue().trim();
      intervention_info = (await get_intervention_info(intervention_name));
      display_name = intervention_name.replace(new RegExp('_', 'g'), ' ');
      new_intervention_info = {
        code: code,
        name: intervention_name,
        displayname: display_name,
        description: intervention_info.description,
        domain: intervention_info.domain,
        preview: intervention_info.preview,
        matches: [intervention_info.domain],
        sitename: intervention_info.sitename,
        sitename_printable: intervention_info.sitename_printable,
        goals: intervention_info.goals,
        custom: true
      };
      if (!(await compile_intervention_code(new_intervention_info))) {
        return false;
      }
      debug_code = "// This code will be injected to run in webpage context\nfunction codeToInject() {\n  window.addEventListener('error', function (e) {\n    console.log('running in webpage context!')\n    console.log('error is:')\n    console.log(e)\n    let error = {\n      message: e.message\n    }\n    document.dispatchEvent(new CustomEvent('ReportError', { detail: error }));\n  });\n}\n\ndocument.addEventListener('ReportError', function (e) {\n  console.log('CONTENT SCRIPT', e.detail);\n  let error_banner = document.createElement('div');\n  error_banner.setAttribute('id', 'habitlab_error_banner')\n  error_banner.style.position = 'fixed'\n  error_banner.style.zIndex = 9007199254740991\n  error_banner.style.backgroundColor = 'red'\n  error_banner.style.color = 'white'\n  error_banner.innerText = e.detail.message\n  error_banner.style.top = '0px'\n  error_banner.style.left = '0px'\n  error_banner.style.padding = '5px'\n  error_banner.style.borderRadius = '5px'\n  //error_banner.style.width = '500px'\n  //error_banner.style.height = '500px'\n  document.body.appendChild(error_banner)\n  console.log('finished adding error_banner to body')\n  error_banner.addEventListener('mousedown', async function (evt) {\n    console.log('importing sweetalert2')\n    let swal = await SystemJS.import('sweetalert2')\n    console.log('importing load_css_file')\n    let { load_css_file } = await SystemJS.import('libs_common/content_script_utils')\n    console.log('loading css file')\n    await load_css_file('sweetalert2')\n    console.log('loading css file complete')\n    swal({\n      title: 'Developer Help',\n      text: 'To open the developer console you can enter Ctrl-Shift-J'\n    })\n  })\n});\n\n//Inject code\nvar script = document.createElement('script');\nscript.textContent = '(' + codeToInject + '())';\n(document.head || document.documentElement).appendChild(script);\nscript.parentNode.removeChild(script);";
      localStorage.setItem('insert_debugging_code', true);
      new_intervention_info.content_scripts[0].debug_code = debug_code;
      console.log(new_intervention_info);
      self.intervention_info = new_intervention_info;
      (await add_new_intervention(new_intervention_info));
      localStorage['saved_intervention_' + intervention_name] = new_intervention_info.code;
      localStorage['saved_intervention_time_' + intervention_name] = Date.now();
      return true;
    },
    close_tab_clicked: function(evt){
      var intervention_idx, intervention_name, opened_intervention_list;
      intervention_idx = this.selected_tab_idx - 1;
      intervention_name = this.opened_intervention_list[intervention_idx];
      if (this.js_editors[intervention_name] != null) {
        delete this.js_editors[intervention_name];
      }
      opened_intervention_list = JSON.parse(JSON.stringify(this.opened_intervention_list));
      opened_intervention_list.splice(intervention_idx - 1, 1);
      if (opened_intervention_list.length === 0) {
        this.is_tutorial_shown = true;
      }
      this.opened_intervention_list = opened_intervention_list;
      return this.selected_tab_idx = this.opened_intervention_list.length;
    },
    close_tutorial_clicked: function(evt){
      var self;
      self = this;
      if (self.opened_intervention_list.length === 0) {
        return;
      }
      self.is_tutorial_shown = false;
      if (self.selected_tab_idx === 0) {
        return self.selected_tab_idx = 1;
      }
    },
    delete_current_intervention: async function(){
      var intervention_name;
      intervention_name = this.get_intervention_name();
      if (intervention_name != null) {
        this.opened_intervention_list.splice(this.selected_tab_idx - 1, 1);
        this.opened_intervention_list = JSON.parse(JSON.stringify(this.opened_intervention_list));
        remove_custom_intervention(intervention_name);
        delete this.js_editors[intervention_name];
        (await this.refresh_intervention_list());
      }
    },
    delete_intervention: async function(){
      var intervention_name, e;
      intervention_name = this.get_intervention_name();
      if (!intervention_name) {
        return;
      }
      try {
        (await swal({
          title: 'Are you sure you want to delete ' + intervention_name,
          text: 'You will not be able to revert this',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }));
      } catch (e$) {
        e = e$;
        return;
      }
      (await this.delete_current_intervention());
      if (this.opened_intervention_list.length === 0) {
        this.is_tutorial_shown = true;
      }
      return this.selected_tab_idx = this.opened_intervention_list.length;
    },
    add_new_intervention_clicked: function(){
      var self, create_intervention_dialog;
      self = this;
      create_intervention_dialog = document.createElement('create-intervention-dialog');
      document.body.appendChild(create_intervention_dialog);
      create_intervention_dialog.goal_info_list = this.goal_info_list;
      create_intervention_dialog.open_create_new_intervention_dialog();
      return create_intervention_dialog.addEventListener('display_new_intervention', function(evt){
        return self.display_new_intervention(evt.detail);
      });
    },
    open_custom_intervention_clicked: function(){
      var self, create_intervention_dialog;
      self = this;
      create_intervention_dialog = document.createElement('create-intervention-dialog');
      document.body.appendChild(create_intervention_dialog);
      create_intervention_dialog.intervention_list = this.intervention_list;
      create_intervention_dialog.open_existing_custom_intervention_dialog();
      return create_intervention_dialog.addEventListener('display_intervention', function(evt){
        return self.display_intervention(evt.detail);
      });
    },
    display_template_by_name: async function(template_name){
      var self, code, idx, short_template_name, new_intervention_name, intervention_info, goal_info, display_name;
      self = this;
      code = (await systemjsget(chrome.runtime.getURL('/intervention_templates/' + template_name + '/frontend.js')));
      idx = template_name.indexOf('/');
      if (idx !== -1) {
        short_template_name = template_name.slice(idx + 1);
        new_intervention_name = 'custom_' + short_template_name;
      }
      intervention_info = (await get_intervention_info(template_name));
      if (intervention_info.goals.length > 0) {
        goal_info = (await get_goal_info(intervention_info.goals[0]));
      } else {
        goal_info = (await get_goal_info('youtube/spend_less_time'));
      }
      display_name = new_intervention_name.replace(new RegExp('_', 'g'), ' ');
      intervention_info = {
        name: new_intervention_name,
        description: intervention_info.description,
        displayname: display_name,
        domain: goal_info.domain,
        preview: goal_info.preview,
        matches: [goal_info.domain],
        sitename: goal_info.sitename,
        sitename_printable: goal_info.sitename_printable,
        custom: true,
        code: code,
        content_scripts: code,
        goals: [goal_info.name]
      };
      (await add_new_intervention(intervention_info));
      (await this.refresh_intervention_list());
      this.opened_intervention_list.push(new_intervention_name);
      this.opened_intervention_list = JSON.parse(JSON.stringify(this.opened_intervention_list));
      return this.once_available('#editor_' + new_intervention_name, function(result){
        return self.make_javascript_editor(result);
      });
    },
    display_intervention_by_name: async function(intervention_name){
      var self, intervention_info, autosaved_code, e, new_opened_intervention_list;
      self = this;
      if (!this.opened_intervention_list.includes(intervention_name)) {
        intervention_info = (await get_intervention_info(intervention_name));
        if (intervention_info == null) {
          return;
        }
        this.intervention_info = intervention_info;
        localStorage['saved_interventions_' + intervention_name] = this.intervention_info.code;
        autosaved_code = localStorage['autosaved_intervention_' + intervention_name];
        if (autosaved_code != null && autosaved_code !== intervention_info.code) {
          try {
            (await swal({
              title: 'Restore autosaved version?',
              text: 'You closed ' + localStorage['last_opened_intervention'] + ' without saving it. Do you want to restore the autosaved version?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'No',
              confirmButtonText: 'Restore'
            }));
            intervention_info.code = autosaved_code;
            localStorage['saved_intervention_' + intervention_name] = autosaved_code;
            delete localStorage['autosaved_intervention_' + intervention_name];
            (await add_new_intervention(intervention_info));
          } catch (e$) {
            e = e$;
            delete localStorage['autosaved_intervention_' + intervention_name];
          }
        }
        this.opened_intervention_list.push(intervention_name);
        new_opened_intervention_list = JSON.parse(JSON.stringify(this.opened_intervention_list));
        this.set('opened_intervention_list', []);
        this.set('opened_intervention_list', new_opened_intervention_list);
        once_true(function(){
          return self.js_editors[intervention_name] != null;
        }, function(){
          return self.js_editors[intervention_name].setValue(intervention_info.code);
        });
        return this.selected_tab_idx = this.opened_intervention_list.length;
      }
    },
    display_intervention: function(intervention_data){
      var intervention_name;
      intervention_name = intervention_data.intervention_name;
      return this.display_intervention_by_name(intervention_name);
    },
    info_clicked: function(){
      var self, create_intervention_dialog;
      self = this;
      create_intervention_dialog = document.createElement('create-intervention-dialog');
      document.body.appendChild(create_intervention_dialog);
      create_intervention_dialog.goal_info_list = this.goal_info_list;
      create_intervention_dialog.current_intervention = this.get_intervention_name();
      create_intervention_dialog.addEventListener('modify_intervention_info', function(evt){
        return self.modify_intervention_info(evt.detail);
      });
      return create_intervention_dialog.open_edit_intervention_info_dialog();
    },
    modify_intervention_info: async function(data){
      var self, intervention_info, display_name;
      self = this;
      intervention_info = (await get_intervention_info(data.old_intervention_name));
      display_name = data.new_intervention_name.replace(new RegExp('_', 'g'), ' ');
      intervention_info = {
        name: data.new_intervention_name,
        displayname: display_name,
        description: data.new_intervention_description,
        domain: data.new_goal_info.domain,
        preview: data.new_preview,
        matches: [data.new_goal_info.domain],
        sitename: data.new_goal_info.sitename,
        sitename_printable: data.new_goal_info.sitename_printable,
        custom: true,
        code: intervention_info.code,
        content_scripts: intervention_info.code,
        goals: [data.new_goal_info.name]
      };
      (await add_new_intervention(intervention_info));
      if (data.old_intervention_name !== data.new_intervention_name) {
        this.delete_current_intervention();
        this.opened_intervention_list.push(data.new_intervention_name);
        this.opened_intervention_list = JSON.parse(JSON.stringify(this.opened_intervention_list));
        this.once_available('#editor_' + data.new_intervention_name, function(result){
          return self.make_javascript_editor(result);
        });
      }
      return (await this.refresh_intervention_list());
    },
    display_new_intervention: async function(new_intervention_data){
      var self, new_intervention_name, goal_info, comment_section, display_name, intervention_info;
      self = this;
      new_intervention_name = new_intervention_data.intervention_name;
      goal_info = new_intervention_data.goal_info;
      comment_section = "/*\nThis nudge is written in JavaScript.\nTo learn JavaScript, see https://www.javascript.com/try\nThis sample nudge will display a popup with SweetAlert.\nClick the 'Run this Nudge' button to see it run.\nTo learn how to write HabitLab interventions, see\nhttps://habitlab.github.io/devdocs\nrequire_package: returns an NPM module, and ensures that the CSS it uses is loaded\nhttps://habitlab.github.io/devdocs?q=require_package\n*/" + '\n';
      display_name = new_intervention_name.replace(new RegExp('_', 'g'), ' ');
      intervention_info = {
        name: new_intervention_name,
        displayname: display_name,
        description: new_intervention_data.intervention_description,
        domain: goal_info.domain,
        preview: new_intervention_data.preview_url,
        matches: [goal_info.domain],
        sitename: goal_info.sitename,
        sitename_printable: goal_info.sitename_printable,
        custom: true,
        code: comment_section + 'var swal = require_package(\'sweetalert2\');\nswal({\n  title: \'Hello World\',\n  text: \'This is a sample intervention\'\n});',
        content_scripts: {
          code: comment_section + 'var swal = require_package(\'sweetalert2\');\nswal({\n  title: \'Hello World\',\n  text: \'This is a sample intervention\'\n});'
        },
        goals: [goal_info.name]
      };
      (await add_new_intervention(intervention_info));
      (await this.refresh_intervention_list());
      this.opened_intervention_list.push(new_intervention_name);
      this.opened_intervention_list = JSON.parse(JSON.stringify(this.opened_intervention_list));
      this.once_available('#editor_' + new_intervention_name, function(result){
        return self.make_javascript_editor(result);
      });
      return this.selected_tab_idx = this.opened_intervention_list.length;
    },
    refresh_intervention_list: async function(){
      return this.intervention_list = (await list_custom_interventions());
    },
    preview_intervention: async function(){
      var self, intervention_name, intervention_info, preview_url, goal_info, ref$;
      self = this;
      if (!(await this.save_intervention())) {
        return;
      }
      intervention_name = self.get_intervention_name();
      intervention_info = (await get_intervention_info(intervention_name));
      set_override_enabled_interventions_once(intervention_name);
      preview_url = intervention_info.preview;
      if (preview_url == null) {
        goal_info = (await get_goal_info(intervention_info.goals[0]));
        preview_url = (ref$ = goal_info.preview) != null
          ? ref$
          : 'https://' + goal_info.domain + '/';
      }
      return chrome.tabs.create({
        url: preview_url
      });
    },
    debug_intervention: async function(){
      var intervention_name, intervention_info, preview_url, goal_info, ref$, tab, current_tab_id, loaded_interventions;
      if (!(await this.save_intervention())) {
        return;
      }
      intervention_name = this.get_intervention_name();
      set_override_enabled_interventions_once(intervention_name);
      intervention_info = (await get_intervention_info(intervention_name));
      preview_url = intervention_info.preview;
      if (preview_url == null) {
        goal_info = (await get_goal_info(intervention_info.goals[0]));
        preview_url = (ref$ = goal_info.preview) != null
          ? ref$
          : 'https://' + goal_info.domain + '/';
      }
      tab = (await new Promise(function(it){
        return chrome.tabs.create({
          url: preview_url
        }, it);
      }));
      for (;;) {
        current_tab_id = (await get_active_tab_id());
        if (current_tab_id === tab.id) {
          break;
        }
        (await sleep(100));
      }
      for (;;) {
        loaded_interventions = (await list_currently_loaded_interventions());
        if (loaded_interventions.includes(intervention_name)) {
          break;
        }
        (await sleep(100));
      }
      return (await open_debug_page_for_tab_id(tab.id));
    },
    help_clicked: function(){
      this.is_tutorial_shown = true;
      return this.selected_tab_idx = 0;
    },
    share_clicked: async function(){
      return chrome.tabs.create({
        url: 'https://github.com/habitlab/habitlab/wiki/Share-Interventions'
      });
    },
    make_javascript_editor: async function(editor_div){
      var intervention_name, self, brace, aceRange, js_editor, intervention_info, clicked_fn, style, markedLines;
      intervention_name = editor_div.intervention_tab_name;
      if (intervention_name != null) {
        self = this;
        if (self.js_editors[intervention_name] != null) {
          return;
        }
        brace = (await SystemJS['import']('brace'));
        aceRange = brace.acequire('ace/range').Range;
        (await SystemJS['import']('brace/mode/javascript'));
        (await SystemJS['import']('brace/ext/language_tools'));
        brace.acequire('ace/ext/language_tools');
        self.js_editors[intervention_name] = js_editor = brace.edit(editor_div);
        js_editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        });
        js_editor.getSession().setMode('ace/mode/javascript');
        js_editor.getSession().setUseWrapMode(true);
        js_editor.getSession().setOption("useWorker", false);
        js_editor.getSession().setTabSize(2);
        js_editor.getSession().setUseSoftTabs(true);
        js_editor.$blockScrolling = Infinity;
        self.intervention_info = intervention_info = (await get_intervention_info(intervention_name));
        js_editor.setValue(intervention_info.code);
        clicked_fn = async function(){
          return alert('hi');
        };
        style = $('<style>.error_highlight{position: absolute;z-index: 20;border-bottom: 1px dotted red;}.warning_highlight{position: absolute;z-index: 20;color: red;background-color: yellow;}</style>');
        $('body').append(style);
        $('.ace_gutter-cell').click(clicked_fn);
        markedLines = [];
        js_editor.getSession().on('change', async function(e){
          var current_time, prev_text, current_text, errors, i$, ref$, len$, marker, annotations, error, endLine, endColumn, class_name;
          current_time = Date.now();
          prev_text = self.previous_intervention_text[intervention_name];
          current_text = js_editor.getValue();
          if (prev_text === current_text) {
            return;
          }
          self.last_edited_times[intervention_name] = current_time;
          self.previous_intervention_text[intervention_name] = current_text;
          localStorage['saved_intervention_' + intervention_name] = current_text;
          localStorage['saved_intervention_time_' + intervention_name] = current_time;
          errors = (await run_all_checks(js_editor, current_text));
          for (i$ = 0, len$ = (ref$ = markedLines).length; i$ < len$; ++i$) {
            marker = ref$[i$];
            js_editor.getSession().removeMarker(marker);
          }
          annotations = [];
          for (i$ = 0, len$ = errors.length; i$ < len$; ++i$) {
            error = errors[i$];
            console.log(error);
            endLine = error.endLine;
            if (endLine === null) {
              endLine = error.line;
            }
            endColumn = error.endColumn;
            if (endColumn === null) {
              endColumn = error.column + 1;
            }
            class_name = 'error_highlight';
            if (error.message.indexOf('is assigned a value but never used.') > 0) {
              class_name = 'warning_highlight';
            }
            marker = js_editor.getSession().addMarker(new aceRange(error.line - 1, error.column - 1, endLine - 1, endColumn - 1), class_name, "line");
            markedLines.push(marker);
            annotations.push({
              row: error.line - 1,
              column: 0,
              text: error.message,
              type: "error"
            });
          }
          console.log(js_editor.getSession().getAnnotations());
          return js_editor.getSession().setAnnotations(annotations);
        });
        return setInterval(function(){
          var saved_time, last_edited_time, new_intervention_text, current_text;
          saved_time = localStorage['saved_intervention_time_' + intervention_name];
          last_edited_time = self.last_edited_times[intervention_name];
          new_intervention_text = localStorage['saved_intervention_' + intervention_name];
          if (saved_time != null && new_intervention_text != null) {
            if (last_edited_time == null || saved_time > last_edited_time) {
              current_text = js_editor.getValue();
              if (current_text === new_intervention_text) {
                return;
              }
              self.previous_intervention_text[intervention_name] = new_intervention_text;
              js_editor.setValue(new_intervention_text);
              self.previous_intervention_text[intervention_name] = new_intervention_text;
              return self.last_edited_times[intervention_name] = saved_time;
            }
          }
        }, 1000);
      }
    },
    opened_intervention_list_changed: async function(){
      var self, rendered_interventions, editor_div_list, i$, len$, editor_div, intervention_name, done_rendering;
      self = this;
      for (;;) {
        rendered_interventions = [];
        editor_div_list = self.SM('.javascript_editor_div');
        for (i$ = 0, len$ = editor_div_list.length; i$ < len$; ++i$) {
          editor_div = editor_div_list[i$];
          intervention_name = editor_div.intervention_tab_name;
          rendered_interventions.push(intervention_name);
        }
        done_rendering = lodash.isEqual(self.opened_intervention_list, rendered_interventions);
        if (done_rendering) {
          for (i$ = 0, len$ = editor_div_list.length; i$ < len$; ++i$) {
            editor_div = editor_div_list[i$];
            self.make_javascript_editor(editor_div);
          }
          return;
        } else {
          (await sleep(100));
        }
      }
    },
    ready: async function(){
      var self, all_goals, goals_list, res$, i$, len$, x, enabled_interventions, ref$, intervention_name, new_intervention_info, open_intervention_name, open_template_name;
      document.addEventListener("keydown", function(evt){
        if (evt.code === 'KeyS' && (evt.ctrlKey || evt.metaKey)) {
          return evt.preventDefault();
        }
      });
      self = this;
      all_goals = (await get_goals());
      goals_list = (await list_all_goals());
      res$ = [];
      for (i$ = 0, len$ = goals_list.length; i$ < len$; ++i$) {
        x = goals_list[i$];
        res$.push(all_goals[x]);
      }
      self.goal_info_list = res$;
      (await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css'));
      (await self.refresh_intervention_list());
      enabled_interventions = (await get_enabled_interventions());
      for (i$ = 0, len$ = (ref$ = self.intervention_list).length; i$ < len$; ++i$) {
        intervention_name = ref$[i$];
        if (enabled_interventions[intervention_name]) {
          self.pill_button_idxes[intervention_name] = 1;
        } else {
          self.pill_button_idxes[intervention_name] = 0;
        }
      }
      self.once_available_multiselect('.javascript_editor_div', function(editor_divs){
        var i$, len$, editor_div, results$ = [];
        for (i$ = 0, len$ = editor_divs.length; i$ < len$; ++i$) {
          editor_div = editor_divs[i$];
          results$.push(self.make_javascript_editor(editor_div));
        }
        return results$;
      });
      new_intervention_info = localStorage.getItem('intervention_editor_new_intervention_info');
      if (new_intervention_info != null) {
        new_intervention_info = JSON.parse(new_intervention_info);
        localStorage.removeItem('intervention_editor_new_intervention_info');
        self.display_new_intervention(new_intervention_info);
      }
      open_intervention_name = localStorage.getItem('intervention_editor_open_intervention_name');
      if (open_intervention_name != null) {
        open_intervention_name = JSON.parse(open_intervention_name);
        localStorage.removeItem('intervention_editor_open_intervention_name');
        self.display_intervention_by_name(open_intervention_name);
      }
      open_template_name = localStorage.getItem('intervention_editor_open_template_name');
      if (open_template_name != null) {
        open_template_name = JSON.parse(open_template_name);
        localStorage.removeItem('intervention_editor_open_template_name');
        self.display_template_by_name(open_template_name);
      }
      if (new_intervention_info == null && open_intervention_name == null && open_template_name == null && localStorage.last_opened_intervention != null && self.opened_intervention_list.length === 0) {
        self.display_intervention_by_name(localStorage.last_opened_intervention);
      }
      window.onbeforeunload = function(){
        var have_modifed_interventions, intervention_name, ref$, js_editor, intervention_text, last_opened_intervention;
        have_modifed_interventions = false;
        for (intervention_name in ref$ = self.js_editors) {
          js_editor = ref$[intervention_name];
          intervention_text = js_editor.getSession().getValue().trim();
          localStorage['autosaved_intervention_' + intervention_name] = intervention_text;
          if (intervention_text !== localStorage['saved_intervention_' + intervention_name]) {
            have_modifed_interventions = true;
          }
        }
        last_opened_intervention = self.get_intervention_name();
        if (last_opened_intervention != null) {
          localStorage.last_opened_intervention = last_opened_intervention;
        }
        if (have_modifed_interventions) {
          return true;
        }
      };
      return systemjsget(chrome.runtime.getURL('API.md')).then(function(markdown_text){
        markdown_text = markdown_text.replace('### Table of Contents', '### API');
        return self.api_markdown_text = markdown_text;
      });
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['S', 'SM', 'once_available', 'once_available_multiselect', 'text_if_else']
  });
}).call(this);
