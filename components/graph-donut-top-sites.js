(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_seconds_spent_on_all_domains_today, get_seconds_spent_on_all_domains_days_before_today, bySortedValue;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  ref$ = require('libs_common/time_spent_utils'), get_seconds_spent_on_all_domains_today = ref$.get_seconds_spent_on_all_domains_today, get_seconds_spent_on_all_domains_days_before_today = ref$.get_seconds_spent_on_all_domains_days_before_today;
  polymer_ext({
    is: 'graph-donut-top-sites',
    properties: {
      graph_has_data: {
        type: Boolean,
        value: true
      }
    },
    timeSpentButtonAction: function(){
      var this$ = this;
      return get_seconds_spent_on_all_domains_days_before_today(1, function(a){
        var sorted, i$, i, myButton;
        sorted = bySortedValue(a);
        if (sorted.length < 5) {
          for (i$ = sorted.length; i$ <= 4; ++i$) {
            i = i$;
            sorted.push(["", 0]);
          }
        }
        myButton = this$.$$('.timeSpentButton');
        if (deepEq$(myButton.value, "neverClicked", '===')) {
          myButton.innerText = "View Today's Data";
          myButton.value = "clicked";
          return this$.push('donutdata.datasets', {
            data: [Math.round(10 * (sorted[0][1] / 60)) / 10, Math.round(10 * (sorted[1][1] / 60)) / 10, Math.round(10 * (sorted[2][1] / 60)) / 10, Math.round(10 * (sorted[3][1] / 60)) / 10, Math.round(10 * (sorted[4][1] / 60)) / 10],
            backgroundColor: ["rgba(65,131,215,0.7)", "rgba(27,188,155,0.7)", "rgba(244,208,63,0.7)", "rgba(230,126,34,0.7)", "rgba(239,72,54,0.7)"],
            hoverBackgroundColor: ["rgba(65,131,215,1)", "rgba(27,188,155,1)", "rgba(244,208,63,1)", "rgba(230,126,34,1)", "rgba(239,72,54,1)"]
          });
        } else if (deepEq$(myButton.value, "clicked", '===')) {
          myButton.innerText = "Compare with Previous Day";
          myButton.value = "neverClicked";
          return this$.pop('donutdata.datasets');
        }
      });
    },
    ready: async function(){
      var self, a, sorted, i$, i, length;
      self = this;
      a = (await get_seconds_spent_on_all_domains_today());
      sorted = bySortedValue(a);
      if (sorted.length === 0) {
        this.graph_has_data = false;
      } else {
        this.graph_has_data = true;
      }
      if (sorted.length < 5) {
        for (i$ = sorted.length; i$ <= 4; ++i$) {
          i = i$;
          sorted.push(["", 0]);
        }
      }
      length = sorted.length;
      return self.donutdata = {
        labels: [sorted[0][0], sorted[1][0], sorted[2][0], sorted[3][0], sorted[4][0]],
        datasets: [{
          data: [Math.round(10 * (sorted[0][1] / 60)) / 10, Math.round(10 * (sorted[1][1] / 60)) / 10, Math.round(10 * (sorted[2][1] / 60)) / 10, Math.round(10 * (sorted[3][1] / 60)) / 10, Math.round(10 * (sorted[4][1] / 60)) / 10],
          backgroundColor: ["rgba(65,131,215,0.7)", "rgba(27,188,155,0.7)", "rgba(244,208,63,0.7)", "rgba(230,126,34,0.7)", "rgba(239,72,54,0.7)"],
          hoverBackgroundColor: ["rgba(65,131,215,1)", "rgba(27,188,155,1)", "rgba(244,208,63,1)", "rgba(230,126,34,1)", "rgba(239,72,54,1)"]
        }]
      };
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['S', 'once_available']
  });
  bySortedValue = function(obj){
    var tuples, key;
    tuples = [];
    for (key in obj) {
      tuples.push([key, obj[key]]);
    }
    tuples.sort(function(a, b){
      if (a[1] < b[1]) {
        return 1;
      } else if (a[1] > b[1]) {
        return -1;
      } else {
        return 0;
      }
    });
    return tuples;
  };
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    var first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) {
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);
