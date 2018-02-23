(function(){
  var css_element_queries, once_available, on_resize, on_resize_elem, out$ = typeof exports != 'undefined' && exports || this;
  css_element_queries = require('css-element-queries');
  once_available = require('libs_frontend/polymer_methods').once_available;
  out$.on_resize = on_resize = function(selector, callback){
    var self;
    self = this;
    return once_available.call(self, selector).then(function(elem){
      return css_element_queries.ResizeSensor(elem, callback);
    });
  };
  out$.on_resize_elem = on_resize_elem = function(elem, callback){
    return css_element_queries.ResizeSensor(elem, callback);
  };
}).call(this);
