(function(){
  var sleep, once_true, run_only_one_at_a_time, run_every_timeperiod, out$ = typeof exports != 'undefined' && exports || this;
  out$.sleep = sleep = async function(time){
    return new Promise(function(it){
      return setTimeout(it, time);
    });
  };
  out$.once_true = once_true = async function(condition, callback){
    var current_result;
    current_result = condition();
    while (!current_result) {
      current_result = condition();
      (await sleep(100));
    }
    if (callback != null) {
      callback();
    }
  };
  out$.run_only_one_at_a_time = run_only_one_at_a_time = function(func){
    var is_running;
    is_running = false;
    return function(){
      if (is_running) {
        return;
      }
      is_running = true;
      return func(function(){
        return is_running = false;
      });
    };
  };
  out$.run_every_timeperiod = run_every_timeperiod = function(func, timeperiod){
    var last_run_time;
    last_run_time = Date.now();
    func();
    return setInterval(function(){
      var cur_time;
      cur_time = Date.now();
      if (last_run_time + timeperiod < cur_time) {
        last_run_time = cur_time;
        return func();
      }
    }, 1000);
  };
}).call(this);
