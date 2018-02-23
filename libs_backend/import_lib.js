(function(){
  var ref$, list_functions_in_lib, get_function_signature, get_func_by_name, import_lib, import_func, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/function_signatures'), list_functions_in_lib = ref$.list_functions_in_lib, get_function_signature = ref$.get_function_signature;
  get_func_by_name = require('libs_backend/expose_lib').get_func_by_name;
  out$.import_lib = import_lib = function(lib_name){
    var output, i$, ref$, len$, func_name;
    output = {};
    for (i$ = 0, len$ = (ref$ = list_functions_in_lib(lib_name)).length; i$ < len$; ++i$) {
      func_name = ref$[i$];
      output[func_name] = import_func(func_name);
    }
    return output;
  };
  out$.import_func = import_func = get_func_by_name;
}).call(this);
