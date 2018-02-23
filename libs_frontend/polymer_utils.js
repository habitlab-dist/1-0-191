(function(){
  var gexport, $, import_dom_modules, PropertyIntrospectionBehavior, polymer_ext_registered_tags, polymer_ext_tag_to_info, list_polymer_ext_tags, list_polymer_ext_tags_with_info, process_extra_methods_sources, PolymerWithPropertyIntrospection, polymer_ext, out$ = typeof exports != 'undefined' && exports || this;
  gexport = require('libs_common/gexport').gexport;
  $ = require('jquery');
  import_dom_modules = require('libs_frontend/dom_utils').import_dom_modules;
  require('bower_components/polymer/polymer.deps');
  PropertyIntrospectionBehavior = {
    properties: {
      propertieslist: {
        type: Array,
        value: []
      }
    },
    getdata: function(){
      var output, i$, ref$, len$, x;
      output = {};
      for (i$ = 0, len$ = (ref$ = this.propertieslist).length; i$ < len$; ++i$) {
        x = ref$[i$];
        output[x] = this[x];
      }
      return output;
    }
  };
  polymer_ext_registered_tags = [];
  polymer_ext_tag_to_info = {};
  out$.list_polymer_ext_tags = list_polymer_ext_tags = function(){
    var x;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = polymer_ext_registered_tags).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(x);
      }
      return results$;
    }());
  };
  out$.list_polymer_ext_tags_with_info = list_polymer_ext_tags_with_info = function(){
    var x;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = polymer_ext_registered_tags).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(polymer_ext_tag_to_info[x]);
      }
      return results$;
    }());
  };
  process_extra_methods_sources = function(extra_methods_sources){
    var extra_methods, i$, len$, method_source, j$, ref$, len1$, method;
    extra_methods = {};
    if (extra_methods_sources == null) {
      return extra_methods;
    }
    if (extra_methods_sources.source != null && extra_methods_sources.methods != null) {
      /*
      {
        source: require('libs_frontend/polymer_methods'),
        methods: ['S', 'once_available'],
      }
      */
      extra_methods_sources = [extra_methods_sources];
    }
    if (Array.isArray(extra_methods_sources)) {
      /*
      [
        {
          source: require('libs_frontend/polymer_methods'),
          methods: ['S', 'once_available'],
        },
        { source: ..., methods: ... },
      ]
      */
      for (i$ = 0, len$ = extra_methods_sources.length; i$ < len$; ++i$) {
        method_source = extra_methods_sources[i$];
        for (j$ = 0, len1$ = (ref$ = method_source.methods).length; j$ < len1$; ++j$) {
          method = ref$[j$];
          extra_methods[method] = method_source.source[method];
        }
      }
    } else {
      /*
      methods = require('libs_frontend/polymer_methods')
      {
        S: methods.S
        once_available: methods.once_available
      }
      */
      extra_methods = extra_methods_sources;
    }
    return extra_methods;
  };
  PolymerWithPropertyIntrospection = function(dom_module_text, tag_info, extra_methods_sources){
    var extra_methods, tagname, property_names, behavior, k, v, res$, ref$;
    if (typeof dom_module_text === 'string') {
      if (dom_module_text.indexOf("</dom-module>") === -1) {
        dom_module_text = "<dom-module>\n" + dom_module_text + "\n</dom-module>";
      }
      import_dom_modules(dom_module_text, {
        tagname: tag_info.is
      });
    } else {
      extra_methods_sources = tag_info;
      tag_info = dom_module_text;
    }
    extra_methods = process_extra_methods_sources(extra_methods_sources);
    tag_info = $.extend(true, {}, tag_info);
    tagname = tag_info.is;
    if (tagname == null) {
      console.log('called polymer_ext but missing "is" property');
    }
    if (polymer_ext_tag_to_info[tagname] != null) {
      console.log("polymer_ext_tag_to_info called multiple times for " + tagname);
    }
    property_names = [];
    if (tag_info.behaviors == null) {
      tag_info.behaviors = [];
    }
    behavior = $.extend(true, {}, PropertyIntrospectionBehavior);
    for (k in extra_methods) {
      v = extra_methods[k];
      behavior[k] = v;
    }
    tag_info.behaviors.push(behavior);
    if (tag_info.properties == null) {
      tag_info.properties = {};
    }
    res$ = [];
    for (k in ref$ = tag_info.properties) {
      v = ref$[k];
      res$.push(k);
    }
    property_names = res$;
    if (tag_info.properties.propertieslist == null) {
      tag_info.properties.propertieslist = {
        type: Array,
        value: property_names
      };
    }
    polymer_ext_registered_tags.push(tagname);
    polymer_ext_tag_to_info[tagname] = $.extend(true, {}, tag_info);
    return Polymer(tag_info);
  };
  out$.polymer_ext = polymer_ext = PolymerWithPropertyIntrospection;
}).call(this);
