(function(){
  var polymer_ext, load_css_file, ref$, eval_content_script_debug_for_tabid, eval_content_script_for_tabid, get_active_tab_id, is_tab_still_open, localstorage_setbool, localstorage_getbool, localstorage_getjson, localstorage_setjson, $;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_backend/background_common'), eval_content_script_debug_for_tabid = ref$.eval_content_script_debug_for_tabid, eval_content_script_for_tabid = ref$.eval_content_script_for_tabid, get_active_tab_id = ref$.get_active_tab_id, is_tab_still_open = ref$.is_tab_still_open;
  ref$ = require('libs_common/localstorage_utils'), localstorage_setbool = ref$.localstorage_setbool, localstorage_getbool = ref$.localstorage_getbool, localstorage_getjson = ref$.localstorage_getjson, localstorage_setjson = ref$.localstorage_setjson;
  $ = require('jquery');
  polymer_ext({
    is: 'terminal-view',
    properties: {
      terminal_loaded: {
        type: Boolean,
        value: false
      },
      tabid: {
        type: Number
      },
      ispopup: {
        type: Boolean
      },
      autoload: {
        type: Boolean,
        value: false,
        observer: 'autoload_changed'
      },
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      }
    },
    isdemo_changed: function(){
      if (this.isdemo) {
        return this.autoload = true;
      }
    },
    autoload_changed: function(){
      if (this.autoload) {
        return this.focus_terminal();
      }
    },
    focus_terminal: async function(){
      var self, ref$, jquery_terminal, _;
      self = this;
      if (!self.terminal_loaded) {
        ref$ = (await Promise.all([SystemJS['import']('jquery.terminal'), load_css_file('node_modules_custom/jquery.terminal/css/jquery.terminal.min.css')])), jquery_terminal = ref$[0], _ = ref$[1];
        jquery_terminal($);
        self.attach_terminal();
        self.terminal_loaded = true;
      }
      return setTimeout(function(){
        document.activeElement.blur();
        return $(self.$$('#content_script_terminal')).click();
      }, 0);
    },
    run_eval_debug: async function(code){
      var tabid;
      tabid = this.tabid;
      if (tabid == null) {
        tabid = (await get_active_tab_id());
      }
      return (await eval_content_script_debug_for_tabid(tabid, code));
    },
    run_eval: async function(code){
      var tabid;
      tabid = this.tabid;
      if (tabid == null) {
        tabid = (await get_active_tab_id());
      }
      return (await eval_content_script_for_tabid(tabid, code));
    },
    attach_terminal: function(){
      var self, thiswidth, thisheight, css_options, term_div, messages_livescript, messages_javascript, custom_commands, aliases, terminal_handler_real, terminal_handler, messages;
      self = this;
      thiswidth = $(this).width();
      thisheight = $(this).height();
      css_options = {
        width: thiswidth + 'px',
        height: thisheight + 'px'
      };
      term_div = $(this.$.content_script_terminal);
      term_div.css(css_options);
      messages_livescript = ['Content Script Debugger (Livescript)', 'Switch to Javascript by entering #js', 'Use hlog() instead of console.log()', 'Use uselib() to import jspm libraries, type #help for examples', 'Check the Javascript console for error messages.', 'You can open it with Command-Option-J or Ctrl-Shift-J', 'For more tips, type #help'];
      messages_javascript = ['Content Script Debugger (Javascript)', 'Switch to Livescript by entering #ls', 'Use hlog() instead of console.log()', 'Use uselib() to import jspm libraries, type #help for examples', 'Check the Javascript console for error messages', 'You can open it with Command-Option-J or Ctrl-Shift-J', 'For more tips, type #help'];
      custom_commands = {
        ls: function(){
          localstorage_setbool('debug_terminal_livescript', true);
          return term_div.echo(messages_livescript.join('\n'));
        },
        js: function(){
          localStorage.removeItem('debug_terminal_livescript');
          return term_div.echo(messages_javascript.join('\n'));
        },
        makedefault: function(){
          localstorage_setbool('debug_terminal_is_default', true);
          return term_div.echo('Debug Terminal is now the default tab in popup-view');
        },
        resetdefault: function(){
          localstorage_setbool('debug_terminal_is_default', false);
          return term_div.echo('Debug Terminal is no longer the default tab in popup-view');
        },
        help: function(){
          var messages_help;
          messages_help = ['The following commands are available:', '#ls switches to Livescript mode', '#js switches to Javascript mode', '#global alias for window.customeval = window.eval', '#local alias for window.customeval = window.localeval', '#debug alias for window.customeval = window.debugeval', '#makedefault makes this terminal the default tab in popup-view', '#resetdefault resets the default tab in popup-view', '', 'Use uselib() to import jspm libraries.', 'The first argument is the library name (under SystemJS, see jspm)', 'The second argument is the name it should be given (in the \'window\' object)', 'Example of using moment:', '    uselib(\'moment\', \'moment\')', '    window.moment().format()', 'Example of using jquery:', '    uselib(\'jquery\', \'$\')', '    window.$(\'body\').css(\'background-color\', \'black\')', 'Example of using sweetalert2:', '    uselib(\'libs_common/content_script_utils\', \'content_script_utils\')', '    content_script_utils.load_css_file(\'bower_components/sweetalert2/dist/sweetalert2.css\')', '    uselib(\'sweetalert2\', \'swal\')', '    swal(\'hello world\')', '', 'You can set a custom evaluation function by setting window.customeval', 'For example, this will allow you to access the variables \'intervention\' and \'tab_id\'', '    window.customeval = window.localeval', 'The alias #local does the same as above', 'Some interventions also define window.debugeval which you can use as follows:', '    window.customeval = window.debugeval', 'The alias #debug does the same as above', 'You can reset the effects of #local or #debug with #global', '', 'If using #local or #debug, assign variables to \'window\' to persist them', 'So instead of doing \'var x = 3;\' do \'window.x = 3;\''];
          return term_div.echo(messages_help.join('\n'));
        }
      };
      aliases = {
        local: 'if (window.localeval) {\n  window.customeval = window.localeval;\n  hlog([\n    \'#local has set window.customeval to window.localeval\',\n    \'In #local mode, assign variables to \\\'window\\\' to persist them\',\n    \'So instead of doing \\\'var x = 3;\\\' do \\\'window.x = 3;\\\'\',\n    \'Return to default global eval mode by typing #global\'\n  ].join(\'\\n\'));\n} else {\n  hlog(\'window.localeval is not defined\');\n}',
        debug: 'if (window.debugeval) {\n  window.customeval = window.debugeval;\n  hlog([\n    \'#debug has set window.customeval to window.debugeval\',\n    \'In #debug mode, assign variables to \\\'window\\\' to persist them\',\n    \'So instead of doing \\\'var x = 3;\\\' do \\\'window.x = 3;\\\'\',\n    \'Return to default global eval mode by typing #global\'\n  ].join(\'\\n\'));\n} else {\n  hlog(\'window.debugeval is not defined\');\n}',
        global: 'window.customeval = window.eval;\nhlog(\'#global has reset window.customeval to global eval\');'
      };
      custom_commands.javascript = custom_commands.js;
      custom_commands.livescript = custom_commands.ls;
      terminal_handler_real = async function(command, term){
        var is_livescript, after_hash, livescript, err, prettyprintjs, i$, ref$, len$, statement, command_lines, ref1$, ref2$, contains_await, result;
        is_livescript = localstorage_getbool('debug_terminal_livescript');
        if (command[0] === '#') {
          after_hash = command.substr(1);
          if (custom_commands[after_hash] != null) {
            custom_commands[after_hash]();
            return;
          }
          if (aliases[after_hash] != null) {
            command = aliases[after_hash];
            is_livescript = false;
          }
        }
        if (is_livescript) {
          livescript = (await SystemJS['import']('livescript15'));
          try {
            command = livescript.compile(command, {
              bare: true,
              header: false
            });
          } catch (e$) {
            err = e$;
            term.echo('Livescript compilation error');
            prettyprintjs = (await SystemJS['import']('prettyprintjs'));
            term.echo(prettyprintjs(err));
            return;
          }
        }
        command = command.trim();
        for (i$ = 0, len$ = (ref$ = ['var ', 'let ', 'const ']).length; i$ < len$; ++i$) {
          statement = ref$[i$];
          command_lines = command.split('\n');
          if (command_lines != null && ((ref1$ = command_lines[0]) != null && ref1$.startsWith(statement))) {
            if ((command_lines != null ? (ref2$ = command_lines[0]) != null ? ref2$.indexOf('=') : void 8 : void 8) === -1) {
              command_lines.shift();
            } else {
              command_lines[0] = command_lines[0].substr(statement.length).trim();
            }
          }
          command = command_lines.join('\n').trim();
        }
        contains_await = function(code){
          var result;
          result = code.startsWith('await ') || code.startsWith('await(') || code.includes(' await ') || code.includes('(await ') || code.includes(' await(') || code.includes('(await(');
          return result;
        };
        if (contains_await(command)) {
          command = "(async function() {\n  return " + command + "\n})().then(window.hlog)";
        }
        result = (await self.run_eval_debug(command));
        return term.echo(result);
      };
      terminal_handler = function(command, term, callback){
        terminal_handler_real(command, term).then(callback);
      };
      messages = [];
      if (!localstorage_getbool('debug_terminal_livescript')) {
        messages = messages_javascript;
      } else {
        messages = messages_livescript;
      }
      term_div.terminal(terminal_handler, {
        greetings: messages.join('\n'),
        width: css_options.width,
        height: css_options.height
      });
      setInterval(function(){
        var messages, messages_to_leave, messages_to_echo, i$, len$, message, message_text, results$ = [];
        messages = localstorage_getjson('debug_terminal_messages');
        if (messages != null && messages.length > 0) {
          messages_to_leave = [];
          messages_to_echo = [];
          for (i$ = 0, len$ = messages.length; i$ < len$; ++i$) {
            message = messages[i$];
            if (!(message.tab != null && self.tabid != null)) {
              if (message.tab == null) {
                messages_to_echo.push('missing message.tab');
              }
              if (self.tabid == null) {
                messages_to_echo.push('missing self.tabid');
              }
              messages_to_echo.push(message.text);
            } else if (self.tabid !== message.tab) {
              messages_to_leave.push(message);
            } else {
              messages_to_echo.push(message.text);
            }
          }
          localstorage_setjson('debug_terminal_messages', messages_to_leave);
          for (i$ = 0, len$ = messages_to_echo.length; i$ < len$; ++i$) {
            message_text = messages_to_echo[i$];
            results$.push(term_div.echo(message_text));
          }
          return results$;
        }
      }, 100);
      self.run_eval('if (window.debugeval && !window.customeval && window.customeval != window.debugeval) {\n  window.customeval = window.debugeval;\n  hlog([\n    \'#debug has set window.customeval to window.debugeval\',\n    \'In #debug mode, assign variables to \\\'window\\\' to persist them\',\n    \'So instead of doing \\\'var x = 3;\\\' do \\\'window.x = 3;\\\'\',\n    \'Return to default global eval mode by typing #global\'\n  ].join(\'\\n\'));\n}');
      return setInterval(function(){
        if (self.ispopup && self.tabid != null) {
          return is_tab_still_open(self.tabid).then(function(is_open){
            if (!is_open) {
              return chrome.tabs.getCurrent(function(tab){
                if ((tab != null ? tab.id : void 8) != null) {
                  return chrome.tabs.remove(tab.id);
                }
              });
            }
          });
        }
      }, 1000);
    }
  });
}).call(this);
