(function(){
  var generate_random_id;
  generate_random_id = function(){
    var output, i$, i;
    output = '';
    for (i$ = 0; i$ < 24; ++i$) {
      i = i$;
      output += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    }
    return output;
  };
  module.exports = {
    generate_random_id: generate_random_id
  };
}).call(this);
