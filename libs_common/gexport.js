(function(){
  var gexport, gexport_module, out$ = typeof exports != 'undefined' && exports || this;
  out$.gexport = gexport = function(vardict){
    var k, v;
    if (window.global_exports == null) {
      console.log('calling gexport but global_exports is not defined');
      return;
    }
    for (k in vardict) {
      v = vardict[k];
      window.global_exports[k] = v;
    }
  };
  out$.gexport_module = gexport_module = function(module_name, eval_func){
    if (window.global_exports == null) {
      return;
    }
    window.global_exports['eval_' + module_name] = eval_func;
    if (window.global_exports.gexport_eval_funcs == null) {
      window.global_exports.gexport_eval_funcs = {};
    }
    return window.global_exports.gexport_eval_funcs[module_name] = eval_func;
  };
}).call(this);
