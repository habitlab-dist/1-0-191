(function(){
  var package_name_to_css, package_name_to_css_list, package_aliases, get_css_for_package_list, get_requires_for_package_list, extra_file_list_cached_list, extra_file_list_cached_dict, get_extra_files_cached_list, get_extra_files_cached_dict, does_extra_file_exist, get_path_for_file, get_requires_for_component_list, get_components_to_require_statements, out$ = typeof exports != 'undefined' && exports || this;
  package_name_to_css = {
    sweetalert2: 'bower_components/sweetalert2/dist/sweetalert2.css',
    'jquery.terminal': 'node_modules_custom/jquery.terminal/css/jquery.terminal.min.css'
  };
  package_name_to_css_list = {};
  package_aliases = {
    sweetalert: 'sweetalert2',
    swal: 'sweetalert2'
  };
  out$.get_css_for_package_list = get_css_for_package_list = async function(packages){
    var output, i$, len$, package_name, j$, ref$, len1$, css_file;
    output = [];
    for (i$ = 0, len$ = packages.length; i$ < len$; ++i$) {
      package_name = packages[i$];
      if (package_aliases[package_name] != null) {
        package_name = package_aliases[package_name];
      }
      if (package_name_to_css[package_name] != null) {
        output.push(package_name_to_css[package_name]);
      }
      if (package_name_to_css_list[package_name] != null) {
        for (j$ = 0, len1$ = (ref$ = package_name_to_css_list[package_name]).length; j$ < len1$; ++j$) {
          css_file = ref$[j$];
          output.push(css_file);
        }
      }
    }
    return output;
  };
  out$.get_requires_for_package_list = get_requires_for_package_list = async function(packages){
    var output, i$, len$, package_name;
    output = [];
    for (i$ = 0, len$ = packages.length; i$ < len$; ++i$) {
      package_name = packages[i$];
      if (package_aliases[package_name] != null) {
        package_name = package_aliases[package_name];
      }
      output.push(package_name);
    }
    return output;
  };
  extra_file_list_cached_list = null;
  extra_file_list_cached_dict = null;
  get_extra_files_cached_list = async function(){
    var this$ = this;
    if (extra_file_list_cached_list != null) {
      return extra_file_list_cached_list;
    }
    extra_file_list_cached_list = (await fetch('/extra_file_list.json').then(function(it){
      return it.json();
    }));
    return extra_file_list_cached_list;
  };
  get_extra_files_cached_dict = async function(){
    var newdict, extra_file_list, i$, len$, x;
    if (extra_file_list_cached_dict != null) {
      return extra_file_list_cached_dict;
    }
    newdict = {};
    extra_file_list = (await get_extra_files_cached_list());
    for (i$ = 0, len$ = extra_file_list.length; i$ < len$; ++i$) {
      x = extra_file_list[i$];
      newdict[x] = true;
    }
    return extra_file_list_cached_dict = newdict;
  };
  out$.does_extra_file_exist = does_extra_file_exist = async function(filepath){
    var extra_files_dict;
    extra_files_dict = (await get_extra_files_cached_dict());
    return extra_files_dict[filepath] === true;
  };
  out$.get_path_for_file = get_path_for_file = async function(filename){
    var extra_files_list, i$, len$, filepath;
    extra_files_list = (await get_extra_files_cached_list());
    for (i$ = 0, len$ = extra_files_list.length; i$ < len$; ++i$) {
      filepath = extra_files_list[i$];
      if (filepath.endsWith('/' + filename)) {
        return filepath;
      }
    }
    return null;
  };
  out$.get_requires_for_component_list = get_requires_for_component_list = async function(components){
    var output, i$, len$, component, component_path;
    output = [];
    for (i$ = 0, len$ = components.length; i$ < len$; ++i$) {
      component = components[i$];
      component_path = "bower_components/" + component + "/" + component + ".deps.js";
      if ((await does_extra_file_exist(component_path))) {
        output.push(component_path);
        continue;
      }
      component_path = "components/" + component + ".deps.js";
      if ((await does_extra_file_exist(component_path))) {
        output.push(component_path);
        continue;
      }
      component_path = (await get_path_for_file(component + ".deps.js"));
      if (component_path != null) {
        output.push(component_path);
      }
    }
    return output;
  };
  out$.get_components_to_require_statements = get_components_to_require_statements = async function(components){
    var output, i$, len$, component, component_path;
    output = {};
    for (i$ = 0, len$ = components.length; i$ < len$; ++i$) {
      component = components[i$];
      component_path = "bower_components/" + component + "/" + component + ".deps.js";
      if ((await does_extra_file_exist(component_path))) {
        output[component] = component_path;
        continue;
      }
      component_path = "components/" + component + ".deps.js";
      if ((await does_extra_file_exist(component_path))) {
        output[component] = component_path;
        continue;
      }
      component_path = (await get_path_for_file(component + ".deps.js"));
      if (component_path != null) {
        output[component] = component_path;
      }
    }
    return output;
  };
}).call(this);
