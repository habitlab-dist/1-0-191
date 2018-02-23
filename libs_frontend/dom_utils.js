(function(){
  var import_dom_modules, recreateIronIconset, recreateDomModule, recreateStyle, recreateCustomStyle, recreateFileLocalStyle, recreateGlobalStyle, parseHTML, __get__, __set__, out$ = typeof exports != 'undefined' && exports || this;
  if (window.file_local_styles == null) {
    window.file_local_styles = [];
  }
  if (window.all_imported_custom_styles == null) {
    window.all_imported_custom_styles = [];
  }
  if (window.all_imported_html_files == null) {
    window.all_imported_html_files = {};
  }
  out$.import_dom_modules = import_dom_modules = function(element_dom, options){
    var filename, element_dom_parsed_list, i$, len$, element_dom_parsed, nodename, ref$, ref1$;
    filename = null;
    if (typeof options === 'string') {
      filename = options;
      options = {
        filename: options
      };
    }
    if (filename != null && window.all_imported_html_files[filename]) {
      return;
    }
    if (options == null) {
      options = {};
    }
    if (filename != null) {
      window.all_imported_html_files[filename] = true;
    }
    window.file_local_styles = [];
    element_dom_parsed_list = parseHTML(element_dom);
    for (i$ = 0, len$ = element_dom_parsed_list.length; i$ < len$; ++i$) {
      element_dom_parsed = element_dom_parsed_list[i$];
      if (element_dom_parsed == null) {
        continue;
      }
      nodename = element_dom_parsed.nodeName.toLowerCase();
      if (nodename === 'dom-module') {
        recreateDomModule(element_dom_parsed, options);
      } else if (nodename === 'custom-style' && ((ref$ = element_dom_parsed.firstChild) != null ? (ref1$ = ref$.nodeName) != null ? typeof ref1$.toLowerCase == 'function' ? ref1$.toLowerCase() : void 8 : void 8 : void 8) === 'style') {
        'recreate on custom-style being called';
        recreateCustomStyle(element_dom_parsed.firstChild);
      } else if (nodename === 'style') {
        recreateStyle(element_dom_parsed);
      } else if (nodename === 'iron-iconset-svg') {
        recreateIronIconset(element_dom_parsed);
      }
    }
  };
  recreateIronIconset = function(element_dom_parsed){
    var elem, i$, ref$, len$, attribute, name, value;
    elem = document.createElement(element_dom_parsed.nodeName.toLowerCase());
    elem.innerHTML = element_dom_parsed.innerHTML;
    for (i$ = 0, len$ = (ref$ = element_dom_parsed.attributes).length; i$ < len$; ++i$) {
      attribute = ref$[i$];
      name = attribute.name;
      value = attribute.value;
      elem.setAttribute(name, value);
    }
    if (typeof elem.createdCallback == 'function') {
      elem.createdCallback();
    }
  };
  recreateDomModule = function(element_dom_parsed, options){
    var DOM_MODULE, template_child, i$, ref$, len$, child, custom_style_text_list, style_parsed, style_parsed_new;
    DOM_MODULE = document.createElement('dom-module');
    template_child = null;
    for (i$ = 0, len$ = (ref$ = element_dom_parsed.children).length; i$ < len$; ++i$) {
      child = ref$[i$];
      if (child.nodeName.toLowerCase() === 'template') {
        template_child = child;
      }
    }
    custom_style_text_list = [];
    for (i$ = 0, len$ = (ref$ = window.all_imported_custom_styles.concat(window.file_local_styles)).length; i$ < len$; ++i$) {
      style_parsed = ref$[i$];
      custom_style_text_list.push(style_parsed.innerHTML);
    }
    if (custom_style_text_list.length > 0) {
      style_parsed_new = document.createElement('style');
      style_parsed_new.innerHTML = custom_style_text_list.join('\n\n');
      if (template_child != null) {
        template_child.content.insertBefore(style_parsed_new, template_child.content.firstChild);
      } else {
        element_dom_parsed.appendChild(style_parsed_new);
      }
    }
    DOM_MODULE.innerHTML = element_dom_parsed.innerHTML;
    if (options.tagname != null) {
      DOM_MODULE.id = options.tagname;
    } else {
      DOM_MODULE.id = element_dom_parsed.id;
    }
    if (typeof DOM_MODULE.createdCallback == 'function') {
      DOM_MODULE.createdCallback();
    }
  };
  recreateStyle = function(style_parsed){
    if (style_parsed.getAttribute('is') === 'custom-style') {
      recreateCustomStyle(style_parsed);
    } else {
      recreateFileLocalStyle(style_parsed);
    }
  };
  recreateCustomStyle = function(style_parsed){
    window.all_imported_custom_styles.push(style_parsed);
    return;
    /*
    STYLES = document.createElement('style', 'custom-style')
    console.log 'recreateCustomStyle called'
    #STYLES.textContent = style_parsed.textContent
    if STYLES.styleSheet
      STYLES.styleSheet.cssText = style_parsed.textContent
    else
      STYLES.appendChild(document.createTextNode(style_parsed.textContent))
    if IS_CONTENT_SCRIPT
      console.log 'recreateCustomStyle in content script'
      load_css_code style_parsed.textContent, ->
        console.log 'load_css_code done'
    else
      console.log 'recreateCustomStyle outside content script'
      document.documentElement.appendChild(STYLES)
    #document.head.appendChild(STYLES)
    #document.getElementsByTagName("head")[0].appendChild(STYLES)
    */
  };
  recreateFileLocalStyle = function(style_parsed){
    window.file_local_styles.push(style_parsed);
    return;
  };
  recreateGlobalStyle = function(style_parsed){
    return;
    /*
    STYLES = document.createElement('style')
    console.log 'recreateGlobalStyle called'
    #STYLES.textContent = style_parsed.textContent
    if STYLES.styleSheet
      STYLES.styleSheet.cssText = style_parsed.textContent
    else
      STYLES.appendChild(document.createTextNode(style_parsed.textContent))
    document.documentElement.appendChild(STYLES)
    #document.head.appendChild(STYLES)
    #document.getElementsByTagName("head")[0].appendChild(STYLES)
    */
  };
  parseHTML = function(str){
    var tmp;
    tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp.body.children;
  };
  out$.__get__ = __get__ = function(name){
    return eval(name);
  };
  out$.__set__ = __set__ = function(name, val){
    return eval(name + ' = val');
  };
}).call(this);
