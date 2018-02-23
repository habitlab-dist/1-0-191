(function(){
  var make_require_component_functions, extra_functions, compile;
  make_require_component_functions = function(requires_for_components){
    if (Object.keys(requires_for_components).length === 0) {
      return '';
    }
    return '\n\n' + ("let require_component_map = " + JSON.stringify(requires_for_components) + ";\n\nasync function require_component_async(component_name) {\n  await SystemJS.import(require_component_map[component_name]);\n}") + '\n\n';
  };
  extra_functions = '\n\n' + 'let require_css_cache = {};\n\nasync function require_css_async(css_file) {\n  let content_script_utils = await SystemJS.import(\'libs_common/content_script_utils\');\n  let output = await content_script_utils.load_css_file(css_file);\n  require_css_cache[css_file] = output;\n  return output;\n}\n\nfunction require_css(css_file) {\n  return require_css_cache[css_file];\n}\n\nasync function require_style_async(css_code) {\n  let content_script_utils = await SystemJS.import(\'libs_common/content_script_utils\');\n  let output = await content_script_utils.load_css_code(css_code);\n  return output;\n}\n\nfunction require_style(css_code) {\n}\n\nlet require_package_cache = {};\n\nasync function require_package_async(package_name) {\n  let content_script_utils = await SystemJS.import(\'libs_common/content_script_utils\');\n  await content_script_utils.load_css_file(package_name);\n  let output = await SystemJS.import(package_name);\n  require_package_cache[package_name] = output;\n  return output;\n}\n\nfunction require_package(package_name) {\n  return require_package_cache[package_name];\n}\n\nlet require_remote_cache = {};\n\nasync function require_remote_async(package_name) {\n  let require_remote_utils = await SystemJS.import(\'libs_common/require_remote_utils\');\n  let output = await require_remote_utils.require_remote_async(package_name);\n  require_remote_cache[package_name] = output;\n  return output;\n}\n\nfunction require_remote(package_name) {\n  return require_remote_cache[package_name];\n}\n\nfunction require_component(component_name) {\n}' + '\n\n';
  compile = async function(code){
    var get_components_to_require_statements, list_requires, code_with_async_wrapper, all_requires, extra_code, extra_code_segment2, is_component_require, component_list, requires_for_components, output;
    get_components_to_require_statements = (await SystemJS['import']('libs_backend/require_utils')).get_components_to_require_statements;
    list_requires = (await SystemJS['import']('list_requires_multi'));
    code_with_async_wrapper = "(async function() {\n  " + code + "\n})();";
    all_requires = list_requires(code_with_async_wrapper, ['require', 'require_component', 'require_css', 'require_style', 'require_package', 'require_remote', 'define_component']);
    extra_code = [];
    extra_code_segment2 = [];
    is_component_require = function(x){
      if (x.endsWith('.deps') || x.endsWith('.deps.js')) {
        return true;
      }
      if (x === 'libs_frontend/toast_utils') {
        return true;
      }
      return false;
    };
    if ((all_requires.require != null && all_requires.require.filter(is_component_require).length > 0) || (all_requires.define_component != null && all_requires.define_component.length > 0) || (all_requires.require_component != null && all_requires.require_component.length > 0)) {
      extra_code.push("require('enable-webcomponents-in-content-scripts');");
    }
    if (all_requires.require_component != null && all_requires.require_component.length > 0) {
      component_list = all_requires.require_component;
      requires_for_components = (await get_components_to_require_statements(component_list));
      extra_code.push(make_require_component_functions(requires_for_components));
      if (Object.keys(requires_for_components).length > 0) {
        extra_code_segment2.push('name_to_func_async.require_component = require_component_async;');
      }
    }
    if (all_requires.define_component != null && all_requires.define_component.length > 0) {
      extra_code.push("var define_component = require('libs_frontend/polymer_utils').polymer_ext;");
    }
    extra_code = extra_code.join('\n');
    extra_code_segment2 = extra_code_segment2.join('\n');
    output = "(async function() {\n  var intervention = require('libs_common/intervention_info').get_intervention();\n  var tab_id = require('libs_common/intervention_info').get_tab_id();\n\n  " + extra_functions + "\n  \n  " + extra_code + "\n  \n  await (async function() {\n    var name_to_func_async = {\n      require_css: require_css_async,\n      require_style: require_style_async,\n      require_package: require_package_async,\n      require_remote: require_remote_async\n    }\n    " + extra_code_segment2 + "\n    var all_requires = " + JSON.stringify(all_requires) + "\n    for (var k of Object.keys(all_requires)) {\n      var required_items = all_requires[k];\n      var func = name_to_func_async[k];\n      if (!func) {\n        continue;\n      }\n      for (var x of required_items) {\n        await func(x);\n      }\n    }\n  })();\n\n  " + code + "\n\n  window.debugeval = (x) => eval(x);\n})();";
    return output;
  };
  module.exports = {
    compile: compile
  };
}).call(this);
