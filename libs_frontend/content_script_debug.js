(function(){
  var $, prettyprintjs, load_css_file, listen_for_eval, adjust_css_options, insert_console, out$ = typeof exports != 'undefined' && exports || this;
  $ = require('jquery');
  require('jquery.terminal')($);
  prettyprintjs = require('prettyprintjs');
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  out$.listen_for_eval = listen_for_eval = function(eval_func){
    console.log('listen_for_eval running');
    if (window.eval_content_script_listener_loaded) {
      return;
    }
    window.eval_content_script_listener_loaded = true;
    return chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
      var type, data, result, error_to_throw, err;
      type = message.type, data = message.data;
      if (type === 'eval_content_script') {
        result = window.eval(data);
        sendResponse(result);
        return true;
      }
      if (type !== 'eval_content_script_debug') {
        return;
      }
      result = '';
      error_to_throw = null;
      try {
        result = eval_func(data);
        console.log(result);
        result = prettyprintjs(result);
      } catch (e$) {
        err = e$;
        error_to_throw = err;
        result = err.message;
      }
      sendResponse(result);
      if (error_to_throw != null) {
        throw error_to_throw;
      }
      return true;
    });
  };
  adjust_css_options = function(options, new_options){
    var k, v;
    if (new_options == null) {
      return options;
    }
    if (new_options.left != null && options.right != null) {
      delete options.right;
    }
    if (new_options.right != null && options.left != null) {
      delete options.left;
    }
    if (new_options.top != null && options.bottom != null) {
      delete options.bottom;
    }
    if (new_options.bottom != null && options.top != null) {
      delete options.top;
    }
    for (k in new_options) {
      v = new_options[k];
      options[k] = v;
    }
    return options;
  };
  out$.insert_console = insert_console = function(eval_func, options){
    options = import$({}, options);
    return load_css_file('node_modules_custom/jquery.terminal/css/jquery.terminal.min.css', function(){
      var term_div, css_options, lang, terminal_handlers;
      $('body').append($('<div>').attr('id', 'content_script_terminal'));
      term_div = $('#content_script_terminal');
      css_options = {
        position: 'fixed',
        bottom: '0px',
        right: '0px',
        width: '400px',
        height: '200px',
        'z-index': Number.MAX_SAFE_INTEGER
      };
      lang = (function(){
        switch (options.lang) {
        case 'js':
          return 'javascript';
        default:
          return 'javascript';
        }
      }());
      if (options.lang != null) {
        delete options.lang;
      }
      css_options = adjust_css_options(css_options, options);
      term_div.css(css_options);
      terminal_handlers = {};
      terminal_handlers.javascript = function(command, term){
        var result;
        result = eval_func(command);
        console.log(result);
        return term.echo(result);
      };
      /*
      terminal_handlers.livescript = (command, term) ->
        console.log command
        console.log LiveScript
        js_command = ls2js command
        console.log js_command
        result = eval_func js_command
        console.log result
        term.echo result
      */
      return term_div.terminal(terminal_handlers[lang], {
        greetings: "content script debugger (" + lang + ")",
        width: css_options.width,
        height: css_options.height
      });
    });
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
