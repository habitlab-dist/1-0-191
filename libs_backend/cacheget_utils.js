(function(){
  var localforage, ref$, gexport, gexport_module, manifest, habitlab_version, is_production, localforage_store, get_store, localforage_store_remote, get_store_remote, localforage_store_systemjs, get_store_systemjs, clear_cache_localget, clear_cache_remoteget, clear_cache_systemjs, localget, localget_json, localget_base64, remoteget, remoteget_json, remoteget_base64, systemjsget, out$ = typeof exports != 'undefined' && exports || this;
  localforage = require('localforage');
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  manifest = chrome.runtime.getManifest();
  habitlab_version = manifest.version.split('.').join('-');
  is_production = manifest.update_url != null || localStorage.getItem('devmode_use_cache') === 'true';
  localforage_store = null;
  get_store = function(){
    if (localforage_store == null) {
      if (is_production) {
        localforage_store = localforage.createInstance({
          name: 'localget'
        });
      } else {
        localforage_store = {
          setItem: async function(){},
          getItem: async function(){}
        };
      }
    }
    return localforage_store;
  };
  localforage_store_remote = null;
  get_store_remote = function(){
    if (localforage_store_remote == null) {
      localforage_store_remote = localforage.createInstance({
        name: 'remoteget'
      });
    }
    return localforage_store_remote;
  };
  localforage_store_systemjs = null;
  get_store_systemjs = function(){
    if (localforage_store_systemjs == null) {
      localforage_store_systemjs = localforage.createInstance({
        name: 'systemjsget'
      });
    }
    return localforage_store_systemjs;
  };
  /**
   * Clears the cache used by {@link #localget|localget} and {@link #localget_json|localget_json}
   */
  out$.clear_cache_localget = clear_cache_localget = async function(){
    var store;
    store = get_store();
    return (await store.clear());
  };
  /**
   * Clears the cache used by {@link #remoteget|remoteget} and {@link #remoteget_json|remoteget_json}
   */
  out$.clear_cache_remoteget = clear_cache_remoteget = async function(){
    var store;
    store = get_store_remote();
    return (await store.clear());
  };
  out$.clear_cache_systemjs = clear_cache_systemjs = async function(){
    var store;
    store = get_store_systemjs();
    return (await store.clear());
  };
  /**
   * Fetches a local URL and returns the content as text. This is for data that is local to the extension, ie chrome-extension URLs - for remote HTTP/HTTPS URLs, use {@link #remoteget|remoteget} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_localget|clear_cache_localget}.
   * @param {string} url - The URL that we should fetch
   * @return {Promise.<string>} Content of the remote URL, as text
   */
  out$.localget = localget = async function(url){
    var store, res, request;
    store = get_store();
    res = (await store.getItem(url));
    if (res != null) {
      return res;
    }
    request = (await fetch(url));
    res = (await request.text());
    if (res != null) {
      (await store.setItem(url, res));
    }
    return res;
  };
  /**
   * Fetches a local URL and returns the content as JSON. This is for data that is local to the extension, ie chrome-extension URLs - for remote HTTP/HTTPS URLs, use {@link #remoteget_json|remoteget_json} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_localget|clear_cache_localget}.
   * @param {string} url - The URL that we should fetch
   * @return {Promise.<Object|Array>} Content of the remote URL, as parsed JSON (either an Object or Array)
   */
  out$.localget_json = localget_json = async function(url){
    var text;
    text = (await localget(url));
    if (text != null) {
      return JSON.parse(text);
    }
    return null;
  };
  out$.localget_base64 = localget_base64 = async function(url){
    var text;
    text = (await localget(url));
    if (text != null) {
      return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
    }
    return null;
  };
  /**
   * Fetches a remote URL and returns the content as text. This is for external HTTP/HTTPS URLs - for data that is local to the extension, use {@link #localget|localget} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_remoteget|clear_cache_remoteget}.
   * @param {string} url - The URL that we should fetch
   * @return {Promise.<string>} Content of the remote URL, as text
   */
  out$.remoteget = remoteget = async function(url){
    var store, res, request;
    store = get_store_remote();
    res = (await store.getItem(url));
    if (res != null) {
      return res;
    }
    request = (await fetch(url));
    res = (await request.text());
    if (res != null) {
      (await store.setItem(url, res));
    }
    return res;
  };
  /**
   * Fetches a remote URL and returns the content as parsed JSON. This is for external HTTP/HTTPS URLs - for data that is local to the extension, use {@link #localget_json|localget_json} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_remoteget|clear_cache_remoteget}.
   * @param {string} url - The URL that we should fetch
   * @return {Promise.<Object|Array>} Content of the remote URL, as parsed JSON (either an Object or Array)
   */
  out$.remoteget_json = remoteget_json = async function(url){
    var text;
    text = (await remoteget(url));
    if (text != null) {
      return JSON.parse(text);
    }
    return null;
  };
  out$.remoteget_base64 = remoteget_base64 = async function(url){
    var text;
    text = (await remoteget(url));
    if (text != null) {
      return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
    }
    return null;
  };
  out$.systemjsget = systemjsget = async function(url){
    var store, res, request, this$ = this;
    if (!is_production) {
      url = url.replace(chrome.extension.getURL('/'), '');
      return (await fetch(chrome.extension.getURL('/' + url)).then(function(it){
        return it.text();
      }));
    }
    store = get_store_systemjs();
    url = url.replace(chrome.extension.getURL('/'), '');
    res = (await store.getItem(url));
    if (res != null) {
      return res;
    }
    request = (await fetch('https://habitlab-dist.github.io/' + habitlab_version + '/' + url));
    res = (await request.text());
    if (res != null) {
      (await store.setItem(url, res));
    }
    return res;
  };
  gexport_module('cacheget_utils', function(it){
    return eval(it);
  });
}).call(this);
