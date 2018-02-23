(function(){
  var ref$, localstorage_getbool, localstorage_setbool, polymer_ext, jsYaml, detect_if_opera;
  ref$ = require('libs_common/localstorage_utils'), localstorage_getbool = ref$.localstorage_getbool, localstorage_setbool = ref$.localstorage_setbool;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  jsYaml = require('js-yaml');
  detect_if_opera = function(){
    return navigator.userAgent.indexOf(' OPR/') !== -1;
  };
  polymer_ext({
    is: 'options-dev',
    properties: {
      categories_and_option_info: {
        type: Array,
        value: []
      },
      enable: {
        type: String
      },
      disable: {
        type: String
      },
      enable_list: {
        type: Array,
        computed: 'compute_enable_list(enable)'
      },
      disable_list: {
        type: Array,
        computed: 'compute_disable_list(disable)'
      },
      categories_and_option_info_default: {
        type: Array,
        value: [
          {
            category: 'General HabitLab Developer Options',
            options: [
              {
                name: 'display_dlog',
                description: 'Display info logged with dlog under console.log',
                recommended: 'all'
              }, {
                name: 'refresh_livereload',
                description: 'Automatically refresh pages as files are updated',
                recommended: 'all'
              }, {
                name: 'show_beta_goals_and_interventions',
                description: 'Show goals and interventions marked as beta'
              }, {
                name: 'show_hidden_goals_and_interventions',
                description: 'Show goals and interventions marked as hidden'
              }, {
                name: 'open_debug_console_on_load',
                description: 'Automatically open the debug console when intervention is loaded'
              }, {
                name: 'devmode_use_cache',
                description: 'Use the fetch cache in developer mode (is automatically used in production mode)'
              }, {
                name: 'devmode_clear_cache_on_reload',
                description: 'Clear the fetch cache upon reload'
              }, {
                name: 'local_logging_server',
                description: 'Use localhost:5000 as the logging server URL'
              }, {
                name: 'check_for_updates_devmode',
                description: 'Used for debugging the check for updates feature if the extension was sideloaded in dev mode'
              }
            ]
          }, {
            category: 'Browser Action Page (popup-view) Options',
            options: [{
              name: 'enable_debug_terminal',
              description: 'Show Debug button (terminal for debugging interventions) in popup-view',
              recommended: 'all'
            }]
          }, {
            category: 'Intervention Manager Page Options',
            options: [
              {
                name: 'index_show_url_bar',
                description: 'Show URL bar on the bottom of extension pages',
                recommended: 'opera'
              }, {
                name: 'intervention_view_show_internal_names',
                description: 'Show internal names of goals and interventions'
              }, {
                name: 'intervention_view_show_debug_all_interventions_goal',
                description: 'Show the debug/all_interventions goal'
              }, {
                name: 'intervention_view_show_parameters',
                description: 'Show the parameters for each intervention'
              }, {
                name: 'intervention_view_show_randomize_button',
                description: 'Show the randomize interventions button'
              }
            ]
          }
        ]
      }
    },
    compute_enable_list: function(enable){
      var x;
      if (enable == null) {
        return [];
      }
      enable = enable.trim();
      if (!enable.startsWith('[')) {
        enable = '[' + enable + ']';
      }
      return (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = jsYaml.safeLoad(enable)).length; i$ < len$; ++i$) {
          x = ref$[i$];
          results$.push(x.toString());
        }
        return results$;
      }());
    },
    compute_disable_list: function(disable){
      var x;
      if (disable == null) {
        return [];
      }
      disable = disable.trim();
      if (!disable.startsWith('[')) {
        disable = '[' + disable + ']';
      }
      return (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = jsYaml.safeLoad(disable)).length; i$ < len$; ++i$) {
          x = ref$[i$];
          results$.push(x.toString());
        }
        return results$;
      }());
    },
    option_changed: function(evt){
      var checked, option_name;
      checked = evt.target.checked;
      option_name = evt.target.option_name;
      return localstorage_setbool(option_name, checked);
    },
    get_option_list_aliases: function(option_name){
      var output, is_opera, i$, ref$, len$, options, j$, len1$, option;
      output = {
        recommended: [],
        unrecommended: []
      };
      is_opera = detect_if_opera();
      for (i$ = 0, len$ = (ref$ = this.categories_and_option_info_default).length; i$ < len$; ++i$) {
        options = ref$[i$].options;
        for (j$ = 0, len1$ = options.length; j$ < len1$; ++j$) {
          option = options[j$];
          if (option.recommended === 'all') {
            output.recommended.push(option.name);
          } else if (is_opera && option.recommended === 'opera') {
            output.recommended.push(option.name);
          } else {
            output.unrecommended.push(option.name);
          }
        }
      }
      return output;
    },
    expand_aliases_in_options_list: function(options_list){
      var output, aliases, i$, len$, option_name, j$, ref$, len1$, x;
      output = [];
      aliases = this.get_option_list_aliases();
      if (options_list != null && options_list.length > 0) {
        for (i$ = 0, len$ = options_list.length; i$ < len$; ++i$) {
          option_name = options_list[i$];
          if (aliases[option_name] != null) {
            for (j$ = 0, len1$ = (ref$ = aliases[option_name]).length; j$ < len1$; ++j$) {
              x = ref$[j$];
              output.push(x);
            }
          } else {
            output.push(option_name);
          }
        }
      }
      return output;
    },
    enable_options_list: function(options_list){
      var i$, len$, option_name, results$ = [];
      options_list = this.expand_aliases_in_options_list(options_list);
      for (i$ = 0, len$ = options_list.length; i$ < len$; ++i$) {
        option_name = options_list[i$];
        results$.push(localstorage_setbool(option_name, true));
      }
      return results$;
    },
    disable_options_list: function(options_list){
      var i$, len$, option_name, results$ = [];
      options_list = this.expand_aliases_in_options_list(options_list);
      for (i$ = 0, len$ = options_list.length; i$ < len$; ++i$) {
        option_name = options_list[i$];
        results$.push(localstorage_setbool(option_name, false));
      }
      return results$;
    },
    enable_recommended: function(){
      return this.enable_options_list(['recommended']);
    },
    enable_and_disable_from_parameters: function(){
      this.enable_options_list(this.enable_list);
      return this.disable_options_list(this.disable_list);
    },
    register_protocol_handler: function(){
      return navigator.registerProtocolHandler('web+habitlab', 'https://habitlab.github.io/to.html?q=%s', 'HabitLab');
    },
    attached: function(){
      var is_opera, categories_and_option_info, i$, len$, options, j$, len1$, option;
      if (!localstorage_getbool('options_dev_already_opened')) {
        this.enable_recommended();
        localstorage_setbool('options_dev_already_opened', true);
      }
      this.enable_and_disable_from_parameters();
      is_opera = detect_if_opera();
      categories_and_option_info = JSON.parse(JSON.stringify(this.categories_and_option_info_default));
      for (i$ = 0, len$ = categories_and_option_info.length; i$ < len$; ++i$) {
        options = categories_and_option_info[i$].options;
        for (j$ = 0, len1$ = options.length; j$ < len1$; ++j$) {
          option = options[j$];
          if (option.recommended === 'all') {
            option.description = 'Recommended: ' + option.description;
          } else if (is_opera && option.recommended === 'opera') {
            option.description = 'Recommended: ' + option.description;
          }
          option.value = localstorage_getbool(option.name);
        }
      }
      return this.categories_and_option_info = categories_and_option_info;
    }
  });
}).call(this);
