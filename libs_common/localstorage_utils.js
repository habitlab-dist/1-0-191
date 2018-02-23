(function(){
  var localstorage_getbool, localstorage_setbool, localstorage_getint, localstorage_setint, localstorage_getfloat, localstorage_setfloat, localstorage_getjson, localstorage_setjson, localstorage_getstring, localstorage_setstring, out$ = typeof exports != 'undefined' && exports || this;
  out$.localstorage_getbool = localstorage_getbool = function(key){
    return localStorage.getItem(key) === 'true';
  };
  out$.localstorage_setbool = localstorage_setbool = function(key, val){
    if (val) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.setItem(key, 'false');
    }
  };
  out$.localstorage_getint = localstorage_getint = function(key){
    var val;
    val = localStorage.getItem(key);
    if (val != null) {
      return parseInt(val);
    }
    return null;
  };
  out$.localstorage_setint = localstorage_setint = function(key, val){
    localStorage.setItem(key, val);
  };
  out$.localstorage_getfloat = localstorage_getfloat = function(key){
    var val;
    val = localStorage.getItem(key);
    if (val != null) {
      return parseFloat(val);
    }
    return null;
  };
  out$.localstorage_setfloat = localstorage_setfloat = function(key, val){
    localStorage.setItem(key, val);
  };
  out$.localstorage_getjson = localstorage_getjson = function(key){
    var val;
    val = localStorage.getItem(key);
    if (val != null) {
      return JSON.parse(val);
    }
    return null;
  };
  out$.localstorage_setjson = localstorage_setjson = function(key, val){
    localStorage.setItem(key, JSON.stringify(val));
  };
  out$.localstorage_getstring = localstorage_getstring = function(key){
    return localStorage.getItem(key);
  };
  out$.localstorage_setstring = localstorage_setstring = function(key, val){
    return localStorage.setItem(key, val);
  };
}).call(this);
