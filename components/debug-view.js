(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  window.list_polymer_ext_tags_with_info = list_polymer_ext_tags_with_info;
  polymer_ext({
    is: 'debug-view',
    tag_link_url: function(tagname){
      return "index.html?tag=" + tagname;
    },
    tags_with_info: function(){
      return list_polymer_ext_tags_with_info();
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['json_stringify']
  });
}).call(this);
