(function(){
  var ref$, get_function_signature, list_functions_in_lib, func_name_to_func, expose_lib, expose, expose_func, get_func_by_name, get_message_handler, get_all_message_handlers, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/function_signatures'), get_function_signature = ref$.get_function_signature, list_functions_in_lib = ref$.list_functions_in_lib;
  func_name_to_func = {};
  out$.expose_lib = expose_lib = function(lib_name, dict){
    var i$, ref$, len$, func_name;
    for (i$ = 0, len$ = (ref$ = list_functions_in_lib(lib_name)).length; i$ < len$; ++i$) {
      func_name = ref$[i$];
      expose_func(func_name, dict[func_name]);
    }
  };
  out$.expose = expose = function(dict){
    var func_name, func;
    for (func_name in dict) {
      func = dict[func_name];
      expose_func(func_name, func);
    }
  };
  out$.expose_func = expose_func = function(func_name, func){
    var signature;
    signature = get_function_signature(func_name);
    if (signature == null) {
      throw new Error("need to add function signature for function " + func_name + " to libs_common/function_signatures.ls");
    }
    if (!(typeof signature === 'string' || Array.isArray(signature))) {
      throw new Error("invalid signature " + JSON.stringify(signature) + " for function " + func_name + " in libs_common/function_signatures.ls");
    }
    if (func == null) {
      throw new Error("invalid function provided to expose_func for name " + func_name);
    }
    return func_name_to_func[func_name] = func;
  };
  out$.get_func_by_name = get_func_by_name = function(func_name){
    return func_name_to_func[func_name];
  };
  out$.get_message_handler = get_message_handler = function(func_name){
    var signature, func;
    signature = get_function_signature(func_name);
    func = func_name_to_func[func_name];
    if (Array.isArray(signature)) {
      return async function(data){
        var args, res$, i$, ref$, len$, arg_name;
        res$ = [];
        for (i$ = 0, len$ = (ref$ = signature).length; i$ < len$; ++i$) {
          arg_name = ref$[i$];
          res$.push(data[arg_name]);
        }
        args = res$;
        return (await func.apply(null, args));
      };
    }
    if (typeof signature === 'string') {
      return func;
    }
    throw new Error("get_message_handler failed for function named " + func_name + " with signature " + JSON.stringify(signature));
  };
  out$.get_all_message_handlers = get_all_message_handlers = function(){
    var output, i$, ref$, len$, func_name;
    output = {};
    for (i$ = 0, len$ = (ref$ = Object.keys(func_name_to_func)).length; i$ < len$; ++i$) {
      func_name = ref$[i$];
      output[func_name] = get_message_handler(func_name);
    }
    return output;
  };
}).call(this);
