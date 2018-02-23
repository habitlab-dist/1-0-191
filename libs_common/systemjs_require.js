(function(){
  var lib_cache, common_libs_list, frontend_libs_list, backend_libs_list, make_require, make_require_frontend, make_require_backend, out$ = typeof exports != 'undefined' && exports || this;
  lib_cache = {};
  common_libs_list = ['jquery', 'libs_common/domain_utils', 'libs_common/time_utils', 'moment'];
  frontend_libs_list = [];
  backend_libs_list = [];
  out$.make_require = make_require = async function(lib_names){
    var i$, len$, lib_name;
    for (i$ = 0, len$ = lib_names.length; i$ < len$; ++i$) {
      lib_name = lib_names[i$];
      lib_name = lib_name.replace(/\.deps$/, '.jspm');
      if (lib_cache[lib_name] == null) {
        lib_cache[lib_name] = (await SystemJS['import'](lib_name));
      }
    }
    return function(lib_name){
      lib_name = lib_name.replace(/\.deps$/, '.jspm');
      return lib_cache[lib_name];
    };
  };
  out$.make_require_frontend = make_require_frontend = async function(){
    return (await make_require(common_libs_list.concat(frontend_libs_list)));
  };
  out$.make_require_backend = make_require_backend = async function(){
    return (await make_require(common_libs_list.concat(backend_libs_list)));
  };
}).call(this);
