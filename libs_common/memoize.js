(function(){
  var debounce, memoizeSingleAsync, memoize, out$ = typeof exports != 'undefined' && exports || this;
  debounce = require('promise-debounce');
  out$.memoizeSingleAsync = memoizeSingleAsync = function(func){
    var debounced_func, cached_val;
    debounced_func = debounce(func);
    cached_val = null;
    return async function(){
      var result;
      if (cached_val != null) {
        return cached_val;
      }
      result = (await debounced_func());
      cached_val = result;
      return result;
    };
  };
  out$.memoize = memoize = function(func){
    var memo, slice;
    memo = {};
    slice = Array.prototype.slice;
    return function(){
      var args;
      args = slice.call(arguments);
      if (memo[args] != null) {
        return memo[args];
      } else {
        return memo[args] = func.apply(this, args);
      }
    };
  };
}).call(this);
