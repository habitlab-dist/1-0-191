(function(){
  var ref$, list_functions_in_lib, get_function_signature, import_lib, send_message_to_background, import_func, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/function_signatures'), list_functions_in_lib = ref$.list_functions_in_lib, get_function_signature = ref$.get_function_signature;
  out$.import_lib = import_lib = function(lib_name){
    var output, i$, ref$, len$, func_name;
    output = {};
    for (i$ = 0, len$ = (ref$ = list_functions_in_lib(lib_name)).length; i$ < len$; ++i$) {
      func_name = ref$[i$];
      output[func_name] = import_func(func_name);
    }
    return output;
  };
  send_message_to_background = function(type, data){
    return new Promise(function(callback){
      chrome.runtime.sendMessage({
        type: type,
        data: data
      }, callback);
      return true;
    });
  };
  out$.import_func = import_func = function(func_name){
    var signature;
    signature = get_function_signature(func_name);
    if (signature == null) {
      throw new Error("need to add function signature for function " + func_name + " to libs_common/function_signatures.ls");
    }
    if (!(typeof signature === 'string' || Array.isArray(signature))) {
      throw new Error("invalid signature " + JSON.stringify(signature) + " for function " + func_name + " in libs_common/function_signatures.ls");
    }
    if (Array.isArray(signature)) {
      return async function(){
        var args, res$, i$, to$, arg_dict, ref$, len$, idx, arg_name;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        args = res$;
        arg_dict = {};
        for (i$ = 0, len$ = (ref$ = signature).length; i$ < len$; ++i$) {
          idx = i$;
          arg_name = ref$[i$];
          arg_dict[arg_name] = args[idx];
        }
        return (await send_message_to_background(func_name, arg_dict));
      };
    }
    if (typeof signature === 'string') {
      return async function(arg){
        return (await send_message_to_background(func_name, arg));
      };
    }
    throw new Error("import_func failed for function " + func_name + " with signature " + JSON.stringify(signature));
  };
}).call(this);
