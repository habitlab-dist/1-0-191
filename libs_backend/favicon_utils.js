(function(){
  var domain_to_url, ref$, get_canonical_domain, get_canonical_url, localforage, memoizeSingleAsync, unique, gexport, gexport_module, get_jimp, get_cheerio, get_icojs, favicon_patterns_href, localforage_store_iconcache, get_store_iconcache, domain_to_favicons_cache, fetchFavicons, fetch_favicon, toBuffer, make_async, does_file_exist_cached, does_file_exist, async_filter, arrayBufferToBase64, favicon_domain_icojs_blacklist, favicon_domain_jimp_blacklist, get_favicon_data_for_url, get_png_data_for_url, remove_cached_favicon_for_domain, get_favicon_data_for_domain_cached, get_favicon_data_for_domain, get_favicon_data_for_domains_bulk, out$ = typeof exports != 'undefined' && exports || this;
  domain_to_url = require('libs_common/domain_utils').domain_to_url;
  ref$ = require('libs_backend/canonical_url_utils'), get_canonical_domain = ref$.get_canonical_domain, get_canonical_url = ref$.get_canonical_url;
  localforage = require('localforage');
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  unique = require('libs_common/array_utils').unique;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  get_jimp = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('jimp'));
  });
  get_cheerio = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('cheerio'));
  });
  get_icojs = memoizeSingleAsync(async function(){
    return (await SystemJS['import']('icojs'));
  });
  favicon_patterns_href = ['link[rel=apple-touch-icon-precomposed]', 'link[rel=apple-touch-icon]', 'link[rel="shortcut icon"]', 'link[rel="Shortcut Icon"]', 'link[rel=icon]'];
  localforage_store_iconcache = null;
  get_store_iconcache = function(){
    if (localforage_store_iconcache == null) {
      localforage_store_iconcache = localforage.createInstance({
        name: 'iconcache'
      });
    }
    return localforage_store_iconcache;
  };
  domain_to_favicons_cache = {};
  out$.fetchFavicons = fetchFavicons = async function(domain){
    var response, text, cheerio, $, output, i$, ref$, len$, pattern, j$, ref1$, len1$, x, url;
    domain = domain_to_url(domain);
    if (domain_to_favicons_cache[domain] != null) {
      return domain_to_favicons_cache[domain];
    }
    response = (await fetch(domain));
    text = (await response.text());
    cheerio = (await get_cheerio());
    $ = cheerio.load(text);
    output = [];
    for (i$ = 0, len$ = (ref$ = favicon_patterns_href).length; i$ < len$; ++i$) {
      pattern = ref$[i$];
      for (j$ = 0, len1$ = (ref1$ = $(pattern)).length; j$ < len1$; ++j$) {
        x = ref1$[j$];
        url = $(x).attr('href');
        if (url != null && url.trim != null) {
          output.push(url.trim());
        }
      }
    }
    output.push('/favicon.ico');
    output = output.map(function(x){
      var domain_without_slash;
      if (x.startsWith('http://') || x.startsWith('https://')) {
        return x;
      }
      if (x.startsWith('//')) {
        return 'http:' + x;
      }
      domain_without_slash = domain;
      if (domain.endsWith('/') && x.startsWith('/')) {
        domain_without_slash = domain.substr(0, domain.length - 1);
      }
      return domain_without_slash + x;
    });
    output = unique(output);
    output = output.map(function(it){
      return {
        href: it,
        name: 'favicon.ico'
      };
    });
    domain_to_favicons_cache[domain] = output;
    return output;
  };
  fetch_favicon = {
    fetchFavicons: fetchFavicons
  };
  toBuffer = function(ab){
    var buf, view, i$, to$, i;
    buf = new Buffer(ab.byteLength);
    view = new Uint8Array(ab);
    for (i$ = 0, to$ = buf.length; i$ < to$; ++i$) {
      i = i$;
      buf[i] = view[i];
    }
    return buf;
  };
  make_async = function(sync_func){
    return function(x){
      return Promise.resolve(sync_func(x));
    };
  };
  does_file_exist_cached = {};
  does_file_exist = async function(url){
    var request, e;
    if (typeof url !== 'string' && typeof url.href === 'string') {
      url = url.href;
    }
    if (does_file_exist_cached[url] != null) {
      return does_file_exist_cached[url];
    }
    try {
      request = (await fetch(url));
      if (!request.ok) {
        return false;
      }
      (await request.text());
      does_file_exist_cached[url] = true;
      return true;
    } catch (e$) {
      e = e$;
      does_file_exist_cached[url] = false;
      return false;
    }
  };
  async_filter = async function(list, async_function){
    var output, i$, len$, x;
    output = [];
    for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
      x = list[i$];
      if ((await async_function(x))) {
        output.push(x);
      }
    }
    return output;
  };
  arrayBufferToBase64 = function(buffer){
    var binary, bytes, len, i$, i;
    binary = '';
    bytes = new Uint8Array(buffer);
    len = bytes.byteLength;
    for (i$ = 0; i$ < len; ++i$) {
      i = i$;
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  favicon_domain_icojs_blacklist = {
    'news.ycombinator.com': 'news.ycombinator.com'
  };
  favicon_domain_jimp_blacklist = {};
  out$.get_favicon_data_for_url = get_favicon_data_for_url = async function(domain){
    var icojs_convert, favicon_path, all_favicon_paths, filter_functions, i$, len$, filter_function, new_all_favicon_paths, favicon_response, favicon_buffer, icojs, favicon_ico_parsed, favicon_png_buffer, favicon_ico_base64, e, jimp, favicon_data;
    icojs_convert = false;
    if (domain.endsWith('.ico')) {
      favicon_path = domain;
    } else {
      if (!(domain.startsWith('http://') || domain.startsWith('https://') || domain.startsWith('//'))) {
        domain = 'http://' + domain;
      } else if (domain.startsWith('//')) {
        domain = 'http:' + domain;
      }
      all_favicon_paths = (await fetch_favicon.fetchFavicons(domain));
      filter_functions = [does_file_exist];
      filter_functions = filter_functions.concat([
        function(it){
          return it.name === 'favicon.ico';
        }, function(it){
          return it.href.endsWith('favicon.ico');
        }, function(it){
          return it.href.startsWith('favicon.ico');
        }, function(it){
          return it.href.includes('favicon.ico');
        }, function(it){
          return it.href.endsWith('.ico');
        }, function(it){
          return it.href.includes('favicon');
        }
      ].map(make_async));
      for (i$ = 0, len$ = filter_functions.length; i$ < len$; ++i$) {
        filter_function = filter_functions[i$];
        new_all_favicon_paths = (await async_filter(all_favicon_paths, filter_function));
        if (new_all_favicon_paths.length > 0) {
          all_favicon_paths = new_all_favicon_paths;
        }
      }
      favicon_path = (await get_canonical_url(all_favicon_paths[0].href));
    }
    if (favicon_path == null || favicon_path.length === 0) {
      throw new Error('no favicon path found');
    }
    try {
      favicon_response = (await fetch(favicon_path));
      favicon_buffer = (await favicon_response.arrayBuffer());
      if (icojs_convert) {
        icojs = (await get_icojs());
        favicon_ico_parsed = (await icojs.parse(favicon_buffer, 'image/png'));
        favicon_png_buffer = toBuffer(favicon_ico_parsed[0].buffer);
        return 'data:image/png;base64,' + favicon_png_buffer.toString('base64');
      } else {
        favicon_ico_base64 = arrayBufferToBase64(favicon_buffer);
        return 'data:image/png;base64,' + favicon_ico_base64;
      }
    } catch (e$) {
      e = e$;
    }
    try {
      jimp = (await get_jimp());
      favicon_data = (await jimp.read(favicon_path));
      favicon_data.resize(40, 40);
      return (await new Promise(function(it){
        return favicon_data.getBase64('image/png', it);
      }));
    } catch (e$) {
      e = e$;
    }
  };
  out$.get_png_data_for_url = get_png_data_for_url = async function(domain){
    var jimp_convert, favicon_path, all_favicon_paths, filter_functions, i$, len$, filter_function, new_all_favicon_paths, jimp, favicon_data, favicon_response, favicon_buffer, favicon_ico_base64, e;
    jimp_convert = false;
    if (domain.endsWith('.png') || domain.endsWith('.svg') || domain.endsWith('.ico')) {
      favicon_path = domain;
    } else {
      if (!(domain.startsWith('http://') || domain.startsWith('https://') || domain.startsWith('//'))) {
        domain = 'http://' + domain;
      } else if (domain.startsWith('//')) {
        domain = 'http:' + domain;
      }
      all_favicon_paths = (await fetch_favicon.fetchFavicons(domain));
      filter_functions = [does_file_exist];
      filter_functions = filter_functions.concat([
        function(it){
          return it.href.includes('icon');
        }, function(it){
          return it.href.endsWith('.png');
        }, function(it){
          return it.href.includes('.png');
        }
      ].map(make_async));
      for (i$ = 0, len$ = filter_functions.length; i$ < len$; ++i$) {
        filter_function = filter_functions[i$];
        new_all_favicon_paths = (await async_filter(all_favicon_paths, filter_function));
        if (new_all_favicon_paths.length > 0) {
          all_favicon_paths = new_all_favicon_paths;
        }
      }
      favicon_path = (await get_canonical_url(all_favicon_paths[0].href));
    }
    try {
      if (jimp_convert) {
        jimp = (await get_jimp());
        favicon_data = (await jimp.read(favicon_path));
        favicon_data.resize(40, 40);
        return (await new Promise(function(it){
          return favicon_data.getBase64('image/png', it);
        }));
      } else {
        favicon_response = (await fetch(favicon_path));
        favicon_buffer = (await favicon_response.arrayBuffer());
        favicon_ico_base64 = arrayBufferToBase64(favicon_buffer);
        return 'data:image/png;base64,' + favicon_ico_base64;
      }
    } catch (e$) {
      e = e$;
    }
  };
  out$.remove_cached_favicon_for_domain = remove_cached_favicon_for_domain = async function(domain){
    var store;
    store = get_store_iconcache();
    (await store.removeItem(domain));
  };
  out$.get_favicon_data_for_domain_cached = get_favicon_data_for_domain_cached = async function(domain){
    var store, res;
    if (domain == null) {
      return;
    }
    store = get_store_iconcache();
    res = (await store.getItem(domain));
    if (res != null) {
      return res;
    }
    res = (await get_favicon_data_for_domain(domain));
    if (res != null) {
      (await store.setItem(domain, res));
    }
    return res;
  };
  out$.get_favicon_data_for_domain = get_favicon_data_for_domain = async function(domain){
    var output, e, canonical_domain;
    try {
      output = (await get_png_data_for_url(domain));
    } catch (e$) {
      e = e$;
    }
    if (output != null) {
      return output;
    }
    canonical_domain = (await get_canonical_domain(domain));
    if (domain !== canonical_domain) {
      try {
        output = (await get_png_data_for_url(canonical_domain));
      } catch (e$) {
        e = e$;
      }
      if (output != null) {
        return output;
      }
    }
    try {
      output = (await get_favicon_data_for_url(domain));
    } catch (e$) {
      e = e$;
    }
    if (output != null) {
      return output;
    }
    if (domain !== canonical_domain) {
      try {
        output = (await get_favicon_data_for_url(canonical_domain));
      } catch (e$) {
        e = e$;
      }
      if (output != null) {
        return output;
      }
    }
  };
  out$.get_favicon_data_for_domains_bulk = get_favicon_data_for_domains_bulk = async function(domain_list){
    var output, favicon_promises_list, i$, len$, domain, favicon_list, idx, favicon;
    output = {};
    favicon_promises_list = [];
    for (i$ = 0, len$ = domain_list.length; i$ < len$; ++i$) {
      domain = domain_list[i$];
      favicon_promises_list.push(get_favicon_data_for_domain(domain));
    }
    favicon_list = (await Promise.all(favicon_promises_list));
    for (i$ = 0, len$ = domain_list.length; i$ < len$; ++i$) {
      idx = i$;
      domain = domain_list[i$];
      favicon = favicon_list[idx];
      output[domain] = favicon;
    }
    return output;
  };
  gexport_module('favicon_utils', function(it){
    return eval(it);
  });
}).call(this);
