(function(){
  var ref$, set_override_enabled_interventions_once, add_new_intervention, remove_custom_intervention, get_intervention_info, get_interventions, get_goal_info, compile_intervention_code;
  ref$ = require('libs_backend/intervention_utils'), set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once, add_new_intervention = ref$.add_new_intervention, remove_custom_intervention = ref$.remove_custom_intervention, get_intervention_info = ref$.get_intervention_info, get_interventions = ref$.get_interventions;
  get_goal_info = require('libs_common/goal_utils').get_goal_info;
  compile_intervention_code = require('libs_backend/intervention_editor_utils').compile_intervention_code;
  Polymer({
    is: 'intervention-editor-tutorial',
    properties: {
      default_code: {
        type: Object,
        value: {
          hello_world_editor: 'alert("Hello World");',
          flip_page_editor: 'window.onload = function() {\n  document.body.style.transform = \'rotate(180deg)\';\n}',
          flip_page_css_editor: 'window.onload=function(){\n  require_style(`\n    body {\n      transform: rotate(180deg);\n    }\n  `)\n}',
          flip_page_jquery_editor: 'var $=require(\'jquery\');\n$(document).ready(function(){\n  $(\'body\').css(\'transform\', \'rotate(180deg)\');\n});  ',
          change_opacity_editor: 'var $ = require(\'jquery\');      \nsetInterval(function() {\n  $(\'body\').css(\'opacity\', Math.random());\n}, 1000);',
          show_sw_dialog_editor: 'var sweetalert = require_package(\'sweetalert2\');      \nsweetalert({\n  title: \'Hello World\',\n  text: \'This is a sample intervention\'\n})        ',
          display_time_spent_editor: 'var sweetalert = require_package(\'sweetalert2\');\nvar {get_seconds_spent_on_current_domain_today} = require(\'libs_common/time_spent_utils\');         \nvar seconds_spent = await get_seconds_spent_on_current_domain_today();\nsweetalert(\'You have spent \' + seconds_spent + \' seconds here today\');',
          insert_msg_jquery_editor: 'var $ = require(\'jquery\');\nvar sweetalert = require_package(\'sweetalert2\');\n\nvar mydiv = $(\'<div>\').text(\'Hello world\').css({\n  \'background-color\': \'red\',\n  \'color\': \'white\',\n  \'z-index\': 9007199254740991,\n  \'position\': \'fixed\',\n  \'top\': \'0px\',\n  \'left\': \'0px\'\n});\n\nmydiv.click(function() {\n  sweetalert(\'the message was clicked\');\n})\n\n$(\'body\').append(mydiv);',
          show_paper_button_editor: 'require_component(\'paper-button\');\n\nvar $ = require(\'jquery\');\nvar sweetalert = require_package(\'sweetalert2\');\n\nvar button = $(\'<paper-button>\').text(\'Click me\').css({\n  \'background-color\': \'red\',\n  \'color\': \'white\',\n  \'z-index\': 9007199254740991,\n  \'position\': \'fixed\',\n  \'top\': \'0px\',\n  \'left\': \'0px\'\n});\n\nbutton.click(function() {\n  sweetalert(\'button was clicked\');\n})\n\n$(\'body\').append(button);',
          show_custom_polymer_button_editor: 'require_component(\'paper-button\');\n\nvar $ = require(\'jquery\');\nvar sweetalert = require_package(\'sweetalert2\');\n\ndefine_component(`\n  <style>\n    .redbutton {\n      background-color: red;\n      color: white;\n      z-index: 9007199254740991;\n      position: fixed;\n      top: 0px;\n      left: 0px;\n    }\n  </style>\n  <template>\n    <paper-button class="redbutton" on-click="button_clicked">Click me</paper-button>\n  </template>\n`, {\n  is: \'my-button\',\n  button_clicked: function() {\n    sweetalert(\'button was clicked\');\n  }\n})\n\nvar custom_component = $(\'<my-button>\');\n$(\'body\').append(custom_component);',
          display_time_spent_custom_polymer_editor: 'var $ = require(\'jquery\');\n\ndefine_component(`\n  <style>\n    .white_on_black {\n      color: white;\n      background-color: black;\n      position: fixed;\n      top: 0px;\n      left: 0px;\n      z-index: 9007199254740991;\n    }\n  </style>\n  <template>\n    <div class="white_on_black">\n      <div>Hello you\'ve been here for {{seconds_elapsed}} seconds</div>\n    </div>\n  </template>\n`, {\n  is: \'time-spent-counter-banner\',\n  properties: {\n    seconds_elapsed: {\n      type: Number,\n      value: 0\n    }\n  },\n  ready: function() {\n    var self = this\n    setInterval(function() {\n      self.seconds_elapsed += 1\n    }, 1000)\n  }\n})\n\nvar custom_component = $(\'<time-spent-counter-banner>\');\n$(\'body\').append(custom_component);',
          display_time_spent_logo_close_editor: 'require_component(\'habitlab-logo-v2\');\nrequire_component(\'close-tab-button\');\n\nvar $ = require(\'jquery\');\n\ndefine_component(`\n  <style>\n    .white_on_black {\n      color: white;\n      background-color: black;\n      position: fixed;\n      top: 0px;\n      left: 0px;\n      z-index: 9007199254740991;\n      text-align: center;\n      padding: 10px;\n    }\n  </style>\n  <template>\n    <div class="white_on_black">\n      <div>Hello you\'ve been here for {{seconds_elapsed}} seconds</div>\n      <habitlab-logo-v2></habitlab-logo-v2>\n      <br>\n      <close-tab-button></close-tab-button>\n    </div>\n  </template>\n`, {\n  is: \'time-spent-counter-banner\',\n  properties: {\n    seconds_elapsed: {\n      type: Number,\n      value: 0\n    }\n  },\n  ready: function() {\n    var self = this\n    setInterval(function() {\n      self.seconds_elapsed += 1\n    }, 1000)\n  }\n})\n\nvar custom_component = $(\'<time-spent-counter-banner>\');\n$(\'body\').append(custom_component);',
          use_external_library_editor: 'var d3 = require_remote(\'https://d3js.org/d3.v4.min.js\');\nalert(\'imported d3 version \' + d3.version);'
        }
      },
      js_editors: {
        type: Object,
        value: {}
      },
      templates_info_list: {
        type: Array
      }
    },
    demo_clicked: async function(evt){
      var editor_name, temp_code, temp_goal_info, temp_intervention_info, preview_page;
      editor_name = evt.target.getAttribute('srcname');
      temp_code = this.js_editors[editor_name].getSession().getValue().trim();
      temp_goal_info = (await get_goal_info("reddit/spend_less_time"));
      temp_intervention_info = {
        code: temp_code,
        name: "temp_intervention",
        domain: temp_goal_info.domain,
        preview: temp_goal_info.preview,
        sitename: temp_goal_info.sitename,
        sitename_printable: temp_goal_info.sitename_printable,
        goals: [temp_goal_info.name],
        custom: true,
        description: "temp",
        matches: [temp_goal_info.domain],
        content_scripts: temp_code
      };
      if (!(await compile_intervention_code(temp_intervention_info))) {
        return false;
      }
      (await add_new_intervention(temp_intervention_info));
      set_override_enabled_interventions_once(temp_intervention_info.name);
      preview_page = temp_intervention_info.preview;
      if (preview_page == null) {
        preview_page = 'https://' + temp_goal_info.domain + '/';
      }
      return chrome.tabs.create({
        url: preview_page
      });
    },
    advanced_demo_clicked: async function(evt){
      var intervention_name, intervention_info, preview_page, goal_info, ref$;
      intervention_name = evt.target.id.substring(5);
      set_override_enabled_interventions_once(intervention_name);
      intervention_info = (await get_intervention_info(intervention_name));
      if (intervention_info.preview != null) {
        preview_page = intervention_info.preview;
      } else if (intervention_info.sitename === 'generic') {
        preview_page = 'https://www.reddit.com/';
      } else {
        goal_info = (await get_goal_info(intervention_info.goals[0]));
        preview_page = (ref$ = goal_info.preview) != null
          ? ref$
          : 'https://' + goal_info.domain + '/';
      }
      return chrome.tabs.create({
        url: preview_page
      });
    },
    rerender: async function(){
      var self, brace, editor_list, i$, len$, editor_name, js_editor, all_interventions, templates_list, x;
      self = this;
      brace = (await SystemJS['import']('brace'));
      (await SystemJS['import']('brace/mode/javascript'));
      (await SystemJS['import']('brace/ext/language_tools'));
      brace.acequire('ace/ext/language_tools');
      editor_list = Object.keys(this.default_code);
      for (i$ = 0, len$ = editor_list.length; i$ < len$; ++i$) {
        editor_name = editor_list[i$];
        js_editor = brace.edit(self.$$('#' + editor_name));
        self.js_editors[editor_name] = js_editor;
        js_editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        });
        (await SystemJS['import']('brace/theme/monokai'));
        js_editor.setTheme('ace/theme/monokai');
        js_editor.getSession().setMode('ace/mode/javascript');
        js_editor.getSession().setTabSize(2);
        js_editor.getSession().setUseSoftTabs(true);
        js_editor.setValue(this.default_code[editor_name].trim());
      }
      all_interventions = (await get_interventions());
      templates_list = ['generic/make_user_wait', "generic/toast_notifications", "iqiyi/prompt_before_watch", "iqiyi/remove_sidebar_links", "netflix/infinite_alarm", "netflix/link_articles", "facebook/remove_news_feed", "facebook/rich_notifications"];
      return this.templates_info_list = (await (async function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = templates_list).length; i$ < len$; ++i$) {
          x = ref$[i$];
          results$.push(all_interventions[x]);
        }
        return results$;
      }()));
    },
    ready: function(){
      return this.rerender();
    }
  });
}).call(this);
