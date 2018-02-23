(function(){
  var localstorage_getjson, ref$, add_key_val_to_localstorage_dict, add_dict_to_localstorage_dict, remove_key_from_localstorage_dict, memoizeSingleAsync, prelude, list_custom_components, get_cheerio, get_require_utils, get_list_requires, list_html_imports_raw_paths, list_html_imports, list_html_imports_as_jspm, add_custom_component, get_custom_component_info, out$ = typeof exports != 'undefined' && exports || this;
  localstorage_getjson = require('libs_common/localstorage_utils').localstorage_getjson;
  ref$ = require('libs_common/collection_utils'), add_key_val_to_localstorage_dict = ref$.add_key_val_to_localstorage_dict, add_dict_to_localstorage_dict = ref$.add_dict_to_localstorage_dict, remove_key_from_localstorage_dict = ref$.remove_key_from_localstorage_dict;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  prelude = require('prelude-ls');
  out$.list_custom_components = list_custom_components = async function(){
    var custom_components;
    custom_components = localstorage_getjson('custom_components');
    if (custom_components == null) {
      return [];
    }
    return prelude.sort(Object.keys(custom_components));
  };
  get_cheerio = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('cheerio'));
  });
  get_require_utils = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('libs_backend/require_utils'));
  });
  get_list_requires = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('list_requires_multi'));
  });
  list_html_imports_raw_paths = async function(html_text){
    var output, cheerio, $, i$, ref$, len$, tag;
    output = [];
    cheerio = (await get_cheerio());
    $ = cheerio.load(html_text);
    for (i$ = 0, len$ = (ref$ = $('link[rel="import"]')).length; i$ < len$; ++i$) {
      tag = ref$[i$];
      output.push($(tag).attr('href'));
    }
    return output;
  };
  list_html_imports = async function(html_text){
    var output, html_imports, i$, len$, html_import;
    output = [];
    html_imports = (await list_html_imports_raw_paths(html_text));
    for (i$ = 0, len$ = html_imports.length; i$ < len$; ++i$) {
      html_import = html_imports[i$];
      if (html_import.indexOf('/') === -1) {
        output.push('components/' + html_import);
      } else {
        output.push(html_import);
      }
    }
    return output;
  };
  list_html_imports_as_jspm = async function(html_text){
    var output, html_imports, i$, len$, html_import;
    output = [];
    html_imports = (await list_html_imports(html_text));
    for (i$ = 0, len$ = html_imports.length; i$ < len$; ++i$) {
      html_import = html_imports[i$];
      html_import = html_import.replace(/\.html$/, '.deps.js');
      output.push(html_import);
    }
    return output;
  };
  /*
  list_require_statements = (html_text) ->>
    html_imports = await list_html_imports_raw()
    for import_path in html_imports
      if import_path.indexOf('/') == -1
        if import_path.indexOf()
    return html_imports
  */
  out$.remove_custom_component = function(component_name){
    remove_key_from_localstorage_dict('custom_components', component_name);
  };
  out$.add_custom_component = add_custom_component = async function(component_info){
    var code, html, component_name, systemjs_config_map, requires_list_html_imports, require_utils, list_requires, dependencies, requires_list_components, requires_list_packages, requires_list, jspm_deps_js, i$, len$, required_item;
    code = component_info.js;
    html = component_info.html;
    component_name = component_info.name;
    systemjs_config_map = {};
    systemjs_config_map['components/' + component_name + '.html'] = 'data:text/html;base64,' + btoa(unescape(encodeURIComponent(html)));
    systemjs_config_map['components/' + component_name] = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(code)));
    systemjs_config_map['components/' + component_name + '.js'] = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent('module.exports = require("components/' + component_name + '")')));
    requires_list_html_imports = (await list_html_imports_as_jspm(html));
    require_utils = (await get_require_utils());
    list_requires = (await get_list_requires());
    dependencies = list_requires(code, ['require_package', 'require_component']);
    requires_list_components = (await require_utils.get_requires_for_component_list(dependencies.require_component));
    requires_list_packages = (await require_utils.get_requires_for_package_list(dependencies.require_package));
    requires_list = requires_list_html_imports.concat(requires_list_components.concat(requires_list_packages));
    jspm_deps_js = [];
    jspm_deps_js.push("const {import_dom_modules} = require('libs_frontend/dom_utils');");
    for (i$ = 0, len$ = requires_list.length; i$ < len$; ++i$) {
      required_item = requires_list[i$];
      jspm_deps_js.push("require('" + required_item + "')");
    }
    jspm_deps_js.push("import_dom_modules(require('components/" + component_name + ".html'));");
    jspm_deps_js.push("require('components/" + component_name + "');");
    systemjs_config_map['components/' + component_name + '.deps.js'] = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(jspm_deps_js.join('\n'))));
    systemjs_config_map['components/' + component_name + '.deps'] = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent('module.exports = require("components/' + component_name + '.deps.js")')));
    add_dict_to_localstorage_dict('systemjs_config_extra_map', systemjs_config_map);
    SystemJS.config({
      map: systemjs_config_map
    });
    return add_key_val_to_localstorage_dict('custom_components', component_name, component_info);
  };
  out$.get_custom_component_info = get_custom_component_info = async function(component_name){
    var custom_components, component_info;
    custom_components = localstorage_getjson('custom_components');
    if (custom_components == null) {
      return;
    }
    component_info = custom_components[component_name];
    if (component_info == null) {
      return;
    }
    return component_info;
  };
}).call(this);
