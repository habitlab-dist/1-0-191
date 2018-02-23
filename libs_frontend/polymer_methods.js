(function(){
  var $, sleep, S, SM, $$$, is_not, is_not_equal, is_not_equal_to_any, is_equal, is_greater_than, is_less_than, is_greater_than_or_equal_to, is_less_than_or_equal_to, text_if, text_if_not, text_if_else, text_if_equal, text_if_elem_in_array, text_if_elem_not_in_array, first_elem, get_key, get_key_for_first_elem, at_index, xrange, iterate_object_items, iterate_object_keys, json_stringify, once_available, once_available_multiselect, out$ = typeof exports != 'undefined' && exports || this;
  $ = require('jquery');
  sleep = async function(time){
    return new Promise(function(it){
      return setTimeout(it, time);
    });
  };
  out$.S = S = function(pattern){
    return $(this.$$(pattern));
  };
  out$.SM = SM = function(pattern){
    return $(Polymer.dom(this.root).querySelectorAll(pattern));
  };
  out$.$$$ = $$$ = function(pattern){
    return Polymer.dom(this.root).querySelectorAll(pattern);
  };
  out$.is_not = is_not = function(cond){
    return !cond;
  };
  out$.is_not_equal = is_not_equal = function(cond, val){
    return cond !== val;
  };
  out$.is_not_equal_to_any = is_not_equal_to_any = function(cond){
    var val_list, res$, i$, to$, len$, val;
    res$ = [];
    for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    val_list = res$;
    for (i$ = 0, len$ = val_list.length; i$ < len$; ++i$) {
      val = val_list[i$];
      if (cond === val) {
        return false;
      }
    }
    return true;
  };
  out$.is_equal = is_equal = function(cond, val){
    return cond === val;
  };
  out$.is_greater_than = is_greater_than = function(cond, val){
    return cond > val;
  };
  out$.is_less_than = is_less_than = function(cond, val){
    return cond < val;
  };
  out$.is_greater_than_or_equal_to = is_greater_than_or_equal_to = function(cond, val){
    return cond >= val;
  };
  out$.is_less_than_or_equal_to = is_less_than_or_equal_to = function(cond, val){
    return cond <= val;
  };
  out$.text_if = text_if = function(cond, text){
    if (cond) {
      return text;
    }
    return '';
  };
  out$.text_if_not = text_if_not = function(cond, text){
    if (!cond) {
      return text;
    }
    return '';
  };
  out$.text_if_else = text_if_else = function(cond, text_if_true, text_if_false){
    if (cond) {
      return text_if_true;
    } else {
      return text_if_false;
    }
  };
  out$.text_if_equal = text_if_equal = function(val1, val2, text){
    if (val1 === val2) {
      return text;
    }
    return '';
  };
  out$.text_if_elem_in_array = text_if_elem_in_array = function(elem, array, text){
    if (array.includes(elem)) {
      return text;
    }
    return '';
  };
  out$.text_if_elem_not_in_array = text_if_elem_not_in_array = function(elem, array, text){
    if (!array.includes(elem)) {
      return text;
    }
    return '';
  };
  out$.first_elem = first_elem = function(list){
    if (list != null && list.length > 0) {
      return list[0];
    }
  };
  out$.get_key = get_key = function(obj, key){
    if (obj != null) {
      return obj[key];
    }
  };
  out$.get_key_for_first_elem = get_key_for_first_elem = function(list, key){
    if (list != null && list[0] != null) {
      return list[0][key];
    }
  };
  out$.at_index = at_index = function(list, index){
    return list[index];
  };
  out$.xrange = xrange = function(start, end){
    if (end == null) {
      end = start;
      start = 0;
    }
    return (function(){
      var i$, to$, results$ = [];
      for (i$ = start, to$ = end; i$ < to$; ++i$) {
        results$.push(i$);
      }
      return results$;
    }());
  };
  out$.iterate_object_items = iterate_object_items = function(obj){
    var i$, ref$, len$, k, results$ = [];
    for (i$ = 0, len$ = (ref$ = Object.keys(obj)).length; i$ < len$; ++i$) {
      k = ref$[i$];
      results$.push({
        key: k,
        value: obj[k]
      });
    }
    return results$;
  };
  out$.iterate_object_keys = iterate_object_keys = function(obj){
    return Object.keys(obj);
  };
  out$.iterate_object_values = function(obj){
    var i$, ref$, len$, k, results$ = [];
    for (i$ = 0, len$ = (ref$ = Object.keys(obj)).length; i$ < len$; ++i$) {
      k = ref$[i$];
      results$.push(obj[k]);
    }
    return results$;
  };
  out$.json_stringify = json_stringify = function(obj){
    return JSON.stringify(obj, null, 2);
  };
  out$.once_available = once_available = async function(selector, callback){
    var self, current_result;
    self = this;
    current_result = self.$$(selector);
    while (current_result == null) {
      current_result = self.$$(selector);
      (await sleep(100));
    }
    if (callback != null) {
      callback(current_result);
    }
    return current_result;
  };
  out$.once_available_multiselect = once_available_multiselect = async function(selector, callback){
    var self, current_result;
    self = this;
    current_result = Polymer.dom(self.root).querySelectorAll(selector);
    while (current_result == null) {
      current_result = Polymer.dom(self.root).querySelectorAll(selector);
      (await sleep(100));
    }
    if (callback != null) {
      callback(current_result);
    }
    return current_result;
  };
}).call(this);
