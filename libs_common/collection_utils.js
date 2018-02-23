(function(){
  var as_array, as_dictset, remove_key_from_localstorage_dict, remove_keys_from_localstorage_dict, remove_keys_matching_patternfunc_from_localstorage_dict, add_key_val_to_localstorage_dict, add_dict_to_localstorage_dict, remove_item_from_localstorage_list, remove_items_from_localstorage_list, remove_items_matching_patternfunc_from_localstorage_list, add_item_to_localstorage_list, out$ = typeof exports != 'undefined' && exports || this;
  out$.as_array = as_array = function(data){
    var k, v;
    if (Array.isArray(data)) {
      return data;
    }
    return (function(){
      var ref$, results$ = [];
      for (k in ref$ = data) {
        v = ref$[k];
        if (v === true) {
          results$.push(k);
        }
      }
      return results$;
    }());
  };
  out$.as_dictset = as_dictset = function(data){
    var k;
    if (Array.isArray(data)) {
      return (function(){
        var i$, ref$, len$, resultObj$ = {};
        for (i$ = 0, len$ = (ref$ = data).length; i$ < len$; ++i$) {
          k = ref$[i$];
          resultObj$[k] = true;
        }
        return resultObj$;
      }());
    }
    return data;
  };
  out$.remove_key_from_localstorage_dict = remove_key_from_localstorage_dict = function(dictname, key){
    var dict_text, dict;
    dict_text = localStorage.getItem(dictname);
    if (dict_text != null) {
      dict = JSON.parse(dict_text);
    } else {
      dict = {};
    }
    if (dict[key] != null) {
      delete dict[key];
    }
    localStorage.setItem(dictname, JSON.stringify(dict));
  };
  out$.remove_keys_from_localstorage_dict = remove_keys_from_localstorage_dict = function(dictname, key_list){
    var dict_text, dict, i$, len$, key;
    dict_text = localStorage.getItem(dictname);
    if (dict_text != null) {
      dict = JSON.parse(dict_text);
    } else {
      dict = {};
    }
    for (i$ = 0, len$ = key_list.length; i$ < len$; ++i$) {
      key = key_list[i$];
      if (dict[key] != null) {
        delete dict[key];
      }
    }
    localStorage.setItem(dictname, JSON.stringify(dict));
  };
  out$.remove_keys_matching_patternfunc_from_localstorage_dict = remove_keys_matching_patternfunc_from_localstorage_dict = function(dictname, patternfunc){
    var dict_text, dict, keys_to_remove, i$, len$, key;
    dict_text = localStorage.getItem(dictname);
    if (dict_text != null) {
      dict = JSON.parse(dict_text);
    } else {
      dict = {};
    }
    keys_to_remove = Object.keys(dict).filter(patternfunc);
    for (i$ = 0, len$ = keys_to_remove.length; i$ < len$; ++i$) {
      key = keys_to_remove[i$];
      if (dict[key] != null) {
        delete dict[key];
      }
    }
    localStorage.setItem(dictname, JSON.stringify(dict));
  };
  out$.add_key_val_to_localstorage_dict = add_key_val_to_localstorage_dict = function(dictname, key, val){
    var dict_text, dict;
    dict_text = localStorage.getItem(dictname);
    if (dict_text != null) {
      dict = JSON.parse(dict_text);
    } else {
      dict = {};
    }
    dict[key] = val;
    localStorage.setItem(dictname, JSON.stringify(dict));
  };
  out$.add_dict_to_localstorage_dict = add_dict_to_localstorage_dict = function(dictname, dict_to_add){
    var dict_text, dict, key, val;
    dict_text = localStorage.getItem(dictname);
    if (dict_text != null) {
      dict = JSON.parse(dict_text);
    } else {
      dict = {};
    }
    for (key in dict_to_add) {
      val = dict_to_add[key];
      dict[key] = val;
    }
    localStorage.setItem(dictname, JSON.stringify(dict));
  };
  out$.remove_item_from_localstorage_list = remove_item_from_localstorage_list = function(listname, item){
    var list_text, list;
    list_text = localStorage.getItem(listname);
    if (list_text != null) {
      list = JSON.parse(list_text);
    } else {
      list = [];
    }
    list = list.filter(function(it){
      return it !== item;
    });
    return localStorage.setItem(listname, JSON.stringify(list));
  };
  out$.remove_items_from_localstorage_list = remove_items_from_localstorage_list = function(listname, item_list){
    var list_text, list;
    list_text = localStorage.getItem(listname);
    if (list_text != null) {
      list = JSON.parse(list_text);
    } else {
      list = [];
    }
    list = list.filter(function(it){
      return item_list.indexOf(it) === -1;
    });
    return localStorage.setItem(listname, JSON.stringify(list));
  };
  out$.remove_items_matching_patternfunc_from_localstorage_list = remove_items_matching_patternfunc_from_localstorage_list = function(listname, patternfunc){
    var list_text, list;
    list_text = localStorage.getItem(listname);
    if (list_text != null) {
      list = JSON.parse(list_text);
    } else {
      list = [];
    }
    list = list.filter(function(it){
      return !patternfunc(it);
    });
    return localStorage.setItem(listname, JSON.stringify(list));
  };
  out$.add_item_to_localstorage_list = add_item_to_localstorage_list = function(listname, item){
    var list_text, list;
    list_text = localStorage.getItem(listname);
    if (list_text != null) {
      list = JSON.parse(list_text);
    } else {
      list = [];
    }
    if (list.indexOf(item) === -1) {
      list.push(item);
    }
    return localStorage.setItem(listname, JSON.stringify(list));
  };
}).call(this);
