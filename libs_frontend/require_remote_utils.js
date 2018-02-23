(function(){
  var remoteget, add_remote_library_async, hash_string, hash_string_to_libname, require_remote_async, out$ = typeof exports != 'undefined' && exports || this;
  remoteget = require('libs_frontend/cacheget_utils').remoteget;
  out$.add_remote_library_async = add_remote_library_async = async function(libname, url){
    var library_contents, libname_mapping;
    library_contents = (await remoteget(url));
    libname_mapping = {};
    libname_mapping[libname] = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(library_contents)));
    SystemJS.config({
      map: libname_mapping
    });
  };
  hash_string = function(s){
    var hash, i, char, l;
    hash = 0;
    i = 0;
    char = 0;
    l = s.length;
    if (l === 0) {
      return hash;
    }
    while (i < l) {
      char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash | 0;
      i += 1;
    }
    return hash;
  };
  hash_string_to_libname = function(s){
    var hash, x;
    hash = hash_string(s);
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = hash.toString()).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push('abcdefghij'[parseInt(x)]);
      }
      return results$;
    }()).join('');
  };
  out$.require_remote_async = require_remote_async = async function(url){
    var libname;
    if (!url.includes('://')) {
      url = 'https://unpkg.com/' + url;
    }
    libname = hash_string_to_libname(url);
    (await add_remote_library_async(libname, url));
    return (await SystemJS['import'](libname));
  };
}).call(this);
