(function(){
  var wait_token_to_callback, make_wait_token, wait_for_token, finished_waiting, out$ = typeof exports != 'undefined' && exports || this;
  wait_token_to_callback = {};
  out$.make_wait_token = make_wait_token = function(){
    var wait_token;
    for (;;) {
      wait_token = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      if (!wait_token_to_callback[wait_token]) {
        return wait_token;
      }
    }
  };
  out$.wait_for_token = wait_for_token = function(wait_token, callback){
    return wait_token_to_callback[wait_token] = callback;
  };
  out$.finished_waiting = finished_waiting = function(wait_token, data){
    var callback;
    callback = wait_token_to_callback[wait_token];
    delete wait_token_to_callback[wait_token];
    return callback(data);
  };
}).call(this);
