(function(){
  var ref$, gexport, gexport_module, url_to_domain, domain_to_url, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.url_to_domain = url_to_domain = function(url){
    var domain;
    if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
  };
  out$.domain_to_url = domain_to_url = function(domain){
    return "http://" + url_to_domain(domain) + '/';
  };
  gexport_module('domain_utils', function(it){
    return eval(it);
  });
}).call(this);
