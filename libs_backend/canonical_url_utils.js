(function(){
  var ref$, url_to_domain, domain_to_url, get_canonical_url_cache, get_canonical_url, get_canonical_domain, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/domain_utils'), url_to_domain = ref$.url_to_domain, domain_to_url = ref$.domain_to_url;
  get_canonical_url_cache = {};
  out$.get_canonical_url = get_canonical_url = async function(url){
    var response, output, e;
    if (get_canonical_url_cache[url] != null) {
      return get_canonical_url_cache[url];
    }
    try {
      response = (await fetch(url));
      output = response.url;
      if (output != null) {
        get_canonical_url_cache[url] = output;
      }
      return output;
    } catch (e$) {
      e = e$;
      return null;
    }
  };
  out$.get_canonical_domain = get_canonical_domain = async function(domain){
    var url, canonical_url;
    url = domain_to_url(domain);
    canonical_url = (await get_canonical_url(url));
    if (canonical_url != null) {
      return url_to_domain(canonical_url);
    }
    return null;
  };
}).call(this);
