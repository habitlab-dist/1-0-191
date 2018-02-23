(function(){
  var ref$, gexport, gexport_module, getUrlParameters, sleep, once_available, once_available_fast, once_available_multiselect, once_body_available, on_url_change, on_url_change_not_from_history, to_camelcase_string, to_camelcase_dict, create_shadow_div, wrap_in_shadow, create_shadow_div_on_body, append_to_body_shadow, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  /**
   * Gets an object containing the URL parameters. Ie, for a URL http://www.example.com/path?foo=bar&baz=qux will output {'foo': 'bar', 'baz': 'qux'}
   * @return {Object} An object with parameter names as keys, and parameter values as values
   */
  out$.getUrlParameters = getUrlParameters = function(){
    var url, hash, map, parts;
    url = window.location.href;
    hash = url.lastIndexOf('#');
    if (hash !== -1) {
      url = url.slice(0, hash);
    }
    map = {};
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
      return map[key] = decodeURIComponent(value).split('+').join(' ');
    });
    return map;
  };
  out$.sleep = sleep = async function(time){
    return new Promise(function(it){
      return setTimeout(it, time);
    });
  };
  /**
  * Return an element once it's available (check every 0.1 seconds)
  * @param {String} selector of the element
  * @param {function} callback
  * @return {HTMLElement}
  */
  out$.once_available = once_available = async function(selector, callback){
    var current_result;
    current_result = document.querySelector(selector);
    while (current_result == null) {
      current_result = document.querySelector(selector);
      (await sleep(100));
    }
    if (callback != null) {
      callback(current_result);
    }
    return current_result;
  };
  /**
  * Return an element once it's available (check every 0.03 seconds)
  * @param {String} selector of the element
  * @param {function} callback
  * @return {HTMLElement}
  */
  out$.once_available_fast = once_available_fast = async function(selector, callback){
    var current_result;
    current_result = document.querySelector(selector);
    while (current_result == null) {
      current_result = document.querySelector(selector);
      (await sleep(30));
    }
    if (callback != null) {
      callback(current_result);
    }
    return current_result;
  };
  /**
  * Return multiple elements once they are available (check every 0.1 seconds)
  * @param {String} selector of the elements
  * @param {function} callback
  * @return {NodeList} the list of elements selected
  */
  out$.once_available_multiselect = once_available_multiselect = async function(selector, callback){
    var current_result;
    current_result = document.querySelectorAll(selector);
    while (!(current_result.length > 0)) {
      current_result = document.querySelectorAll(selector);
      (await sleep(100));
    }
    if (callback != null) {
      callback(current_result);
    }
    return current_result;
  };
  /**
  * Return once body is available (check every 0.03 seconds)
  * @param {function} callback
  */
  out$.once_body_available = once_body_available = async function(callback){
    while (document.body == null) {
      (await sleep(30));
    }
    if (callback != null) {
      callback();
    }
  };
  /**
  * Execute a particular function when curren url changes
  * @param {function} func - function to get executed
  */
  out$.on_url_change = on_url_change = function(func){
    var prev_url;
    prev_url = window.location.href;
    return chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
      var type, data;
      type = msg.type, data = msg.data;
      if (type === 'navigation_occurred') {
        if (data.url !== prev_url) {
          prev_url = data.url;
          return func();
        }
      }
    });
  };
  /**
  * Execute a particular function when curren url changes
  * @param {function} func - function to get executed
  */
  out$.on_url_change_not_from_history = on_url_change_not_from_history = function(func){
    var prev_url;
    prev_url = window.location.href;
    return chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
      var type, data;
      type = msg.type, data = msg.data;
      if (type === 'navigation_occurred') {
        if (data.is_from_history) {
          return;
        }
        if (data.url !== prev_url) {
          console.log('data.url is: ' + data.url);
          console.log('prev_url in loc 2 is: ' + prev_url);
          prev_url = data.url;
          return func();
        }
      }
    });
  };
  to_camelcase_string = function(myString){
    return myString.replace(/-([a-z])/g, function(g){
      return g[1].toUpperCase();
    });
  };
  to_camelcase_dict = function(options){
    var output, k, v;
    output = {};
    for (k in options) {
      v = options[k];
      output[to_camelcase_string(k)] = v;
    }
    return output;
  };
  /**
  * Creates a div in the shadow dom to protect the div styling from outside CSS
  * @param options - css styling which should be applied to shadow div
  * @return the created shadow div
  */
  out$.create_shadow_div = create_shadow_div = function(options){
    var shadow_div, default_options, k, v, ref$, shadow_host, shadow_root;
    if (options == null) {
      options = {};
    }
    if (options.shadow_div != null) {
      shadow_div = options.shadow_div;
      delete options.shadow_div;
    } else {
      shadow_div = document.createElement('div');
    }
    options = to_camelcase_dict(options);
    default_options = {
      fontFamily: 'Verdana, Geneva, Tahoma, "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
      position: 'static',
      zIndex: Number.MAX_SAFE_INTEGER,
      fontSize: '14px',
      lineHeight: 1,
      padding: '0px',
      margin: '0px',
      opacity: 1,
      boxSizing: 'content-box'
    };
    for (k in default_options) {
      v = default_options[k];
      options[k] = (ref$ = options[k]) != null ? ref$ : v;
    }
    shadow_host = document.createElement('div');
    shadow_root = shadow_host.createShadowRoot();
    for (k in options) {
      v = options[k];
      shadow_div.style[k] = v;
    }
    shadow_root.appendChild(shadow_div);
    shadow_div.shadow_root = shadow_root;
    shadow_div.shadow_host = shadow_host;
    shadow_host.shadow_root = shadow_root;
    shadow_host.shadow_div = shadow_div;
    return shadow_div;
  };
  /**
   * Wraps the provided element in a div under the Shadow DOM
   * @param {HTMLElement} elem - The element to add to the Shadow DOM
   * @param {Object} [options] - Options for the creation of the Shadow DOM wrapper element
   * @return {HTMLElement} The created div in the shadow dom
   */
  out$.wrap_in_shadow = wrap_in_shadow = function(elem, options){
    if (elem.length != null && elem.length > 0) {
      elem = elem[0];
    }
    options = import$({}, options);
    options.shadow_div = elem;
    create_shadow_div(options);
    return elem.shadow_host;
  };
  /**
  * Creates a div in the shadow dom to protect the div styling from outside CSS
  * @param {Object} [options] - Options(CSS styling) for the creation of the Shadow DOM wrapper element
  * @return the created shadow div
  */
  out$.create_shadow_div_on_body = create_shadow_div_on_body = function(options){
    var ref$, shadow_div;
    if (options == null) {
      options = {};
    }
    options.position = (ref$ = options.position) != null ? ref$ : 'fixed';
    shadow_div = create_shadow_div(options);
    document.body.appendChild(shadow_div.shadow_host);
    return shadow_div;
  };
  /**
   * Wraps the provided element in a div under the Shadow DOM and appends it to the body of the document
   * @param {HTMLElement} elem - The element to add to the Shadow DOM
   * @param {Object} [options] - Options for the creation of the Shadow DOM wrapper element
   * @return {HTMLElement} The created div in the shadow dom
   */
  out$.append_to_body_shadow = append_to_body_shadow = function(elem, options){
    var ref$, shadow_div;
    if (options == null) {
      options = {};
    }
    options.position = (ref$ = options.position) != null ? ref$ : 'fixed';
    shadow_div = create_shadow_div_on_body(options);
    if (elem.length != null && elem.length > 0) {
      elem = elem[0];
    }
    shadow_div.appendChild(elem);
    return shadow_div;
  };
  gexport_module('common_libs', function(it){
    return eval(it);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
