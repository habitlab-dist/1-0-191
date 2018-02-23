(function(){
  var memoizeSingleAsync, ref$, get_css_for_package_list, get_requires_for_package_list, get_requires_for_component_list, swal, get_list_requires, get_sweetjs_utils, compile_intervention_code, add_requires_to_intervention_info, out$ = typeof exports != 'undefined' && exports || this;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  ref$ = require('libs_backend/require_utils'), get_css_for_package_list = ref$.get_css_for_package_list, get_requires_for_package_list = ref$.get_requires_for_package_list, get_requires_for_component_list = ref$.get_requires_for_component_list;
  swal = require('sweetalert2');
  get_list_requires = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('list_requires_multi'));
  });
  get_sweetjs_utils = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('libs_backend/sweetjs_utils'));
  });
  out$.compile_intervention_code = compile_intervention_code = async function(intervention_info){
    var sweetjs_utils, code, compiled_code, err;
    sweetjs_utils = (await get_sweetjs_utils());
    code = intervention_info.code;
    try {
      /*
      wrapped_code = """
      var intervention = require('libs_common/intervention_info').get_intervention();
      var tab_id = require('libs_common/intervention_info').get_tab_id();
      (async function() {
        #{code}
        window.debugeval = (x) => eval(x);
      })();
      """
      */
      compiled_code = (await sweetjs_utils.compile(code));
      /*
      compiled_code = """
      SystemJS.import('co').then(function(co) {
        co(function*() {
          #{compiled_code}
        })
      })
      """
      */
    } catch (e$) {
      err = e$;
      swal({
        title: 'syntax error in your code',
        text: err,
        type: 'error'
      });
      return false;
    }
    intervention_info.content_scripts = [{
      code: compiled_code,
      run_at: 'document_end',
      jspm_require: true
    }];
    return true;
  };
  out$.add_requires_to_intervention_info = add_requires_to_intervention_info = async function(intervention_info){
    var code, list_requires, dependencies, required_css_files_from_require_css, required_css_files_from_require_package, required_css_files, jspm_deps_from_require, jspm_deps_from_require_package, jspm_deps_from_require_component, required_jspm_deps, i$, len$, css_file, css_file_request, css_file_text, e, available_libs, required_jspm_dep, required_jspm_path, jspm_request, jspm_text, required_component, js_file_request, js_file_text, ref$, content_script;
    code = intervention_info.code;
    list_requires = (await get_list_requires());
    dependencies = list_requires(code, ['require', 'require_css', 'require_style', 'require_package', 'require_component']);
    required_css_files_from_require_css = dependencies.require_css;
    required_css_files_from_require_package = (await get_css_for_package_list(dependencies.require_package));
    required_css_files = required_css_files_from_require_css.concat(required_css_files_from_require_package);
    jspm_deps_from_require = (await get_requires_for_package_list(dependencies.require));
    jspm_deps_from_require_package = (await get_requires_for_package_list(dependencies.require_package));
    jspm_deps_from_require_component = (await get_requires_for_component_list(dependencies.require_component));
    required_jspm_deps = jspm_deps_from_require.concat(jspm_deps_from_require_package.concat(jspm_deps_from_require_component));
    if (jspm_deps_from_require_component.length > 0) {
      required_jspm_deps = ['enable-webcomponents-in-content-scripts'].concat(required_jspm_deps);
    }
    for (i$ = 0, len$ = required_css_files_from_require_css.length; i$ < len$; ++i$) {
      css_file = required_css_files_from_require_css[i$];
      try {
        css_file_request = (await fetch(css_file));
        css_file_text = (await css_file_request.text());
      } catch (e$) {
        e = e$;
        swal({
          title: 'missing css file',
          html: css_file + '<br>\ncheck your require_css statements'
        });
        return false;
      }
    }
    for (i$ = 0, len$ = required_css_files_from_require_package.length; i$ < len$; ++i$) {
      css_file = required_css_files_from_require_package[i$];
      try {
        css_file_request = (await fetch(css_file));
        css_file_text = (await css_file_request.text());
      } catch (e$) {
        e = e$;
        swal({
          title: 'missing css file',
          html: css_file + '<br>\ncheck your require_package statements'
        });
        return false;
      }
    }
    available_libs = SystemJS.getConfig().map;
    for (i$ = 0, len$ = jspm_deps_from_require.length; i$ < len$; ++i$) {
      required_jspm_dep = jspm_deps_from_require[i$];
      if (available_libs[required_jspm_dep] != null) {
        continue;
      }
      try {
        required_jspm_path = required_jspm_dep;
        if (!required_jspm_path.endsWith('.js')) {
          required_jspm_path = required_jspm_path + '.js';
        }
        console.log(required_jspm_dep);
        jspm_request = (await fetch(required_jspm_path));
        jspm_text = (await jspm_request.text());
      } catch (e$) {
        e = e$;
        console.log(e);
        swal({
          title: 'missing jspm package',
          html: required_jspm_dep + '<br>\ncheck your require statements'
        });
        return false;
      }
    }
    for (i$ = 0, len$ = jspm_deps_from_require_package.length; i$ < len$; ++i$) {
      required_jspm_dep = jspm_deps_from_require_package[i$];
      if (available_libs[required_jspm_dep] != null) {
        continue;
      }
      try {
        required_jspm_path = required_jspm_dep;
        if (!required_jspm_path.endsWith('.js')) {
          required_jspm_path = required_jspm_path + '.js';
        }
        console.log(required_jspm_dep);
        jspm_request = (await fetch(required_jspm_path));
        jspm_text = (await jspm_request.text());
      } catch (e$) {
        e = e$;
        console.log(e);
        swal({
          title: 'missing jspm package',
          html: required_jspm_dep + '<br>\ncheck your require_package statements'
        });
        return false;
      }
    }
    for (i$ = 0, len$ = jspm_deps_from_require_component.length; i$ < len$; ++i$) {
      required_component = jspm_deps_from_require_component[i$];
      try {
        js_file_request = (await fetch(required_component));
        js_file_text = (await js_file_request.text());
      } catch (e$) {
        e = e$;
        console.log(e);
        swal({
          title: 'missing component',
          html: required_component + '<br>\ncheck your require_component statements'
        });
        return false;
      }
    }
    intervention_info.css_files = required_css_files;
    intervention_info.styles = dependencies.require_style;
    for (i$ = 0, len$ = (ref$ = intervention_info.content_scripts).length; i$ < len$; ++i$) {
      content_script = ref$[i$];
      content_script.jspm_deps = required_jspm_deps;
    }
    return true;
  };
}).call(this);
