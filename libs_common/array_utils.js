(function(){
  var unique, unique_concat, out$ = typeof exports != 'undefined' && exports || this;
  out$.unique = unique = function(arr){
    var output, seen, i$, len$, x;
    output = [];
    seen = {};
    for (i$ = 0, len$ = arr.length; i$ < len$; ++i$) {
      x = arr[i$];
      if (seen[x] != null) {
        continue;
      }
      seen[x] = true;
      output.push(x);
    }
    return output;
  };
  out$.unique_concat = unique_concat = function(){
    var array_list, res$, i$, to$, output, seen, len$, arr, j$, len1$, x;
    res$ = [];
    for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    array_list = res$;
    output = [];
    seen = {};
    for (i$ = 0, len$ = array_list.length; i$ < len$; ++i$) {
      arr = array_list[i$];
      for (j$ = 0, len1$ = arr.length; j$ < len1$; ++j$) {
        x = arr[j$];
        if (seen[x] != null) {
          continue;
        }
        seen[x] = true;
        output.push(x);
      }
    }
    return output;
  };
}).call(this);
