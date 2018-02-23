(function(){
  var multi_armed_bandit_thompson, get_multi_armed_bandit_algorithm, out$ = typeof exports != 'undefined' && exports || this;
  multi_armed_bandit_thompson = require('libs_backend/multi_armed_bandit_thompson');
  out$.get_multi_armed_bandit_algorithm = get_multi_armed_bandit_algorithm = function(algorithm_name, algorithm_options){
    if (algorithm_name === 'thompson') {
      return multi_armed_bandit_thompson;
    }
    throw new Error("unknown algorithm name in get_multi_armed_bandit_algorithm " + algorithm_name);
  };
}).call(this);
