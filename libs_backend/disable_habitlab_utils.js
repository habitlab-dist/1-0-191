(function(){
  var ref$, get_active_tab_id, disable_interventions_in_all_tabs, get_days_since_epoch, gexport, gexport_module, disable_habitlab, enable_habitlab, is_habitlab_enabled, is_habitlab_enabled_sync, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_backend/background_common'), get_active_tab_id = ref$.get_active_tab_id, disable_interventions_in_all_tabs = ref$.disable_interventions_in_all_tabs;
  get_days_since_epoch = require('libs_common/time_utils').get_days_since_epoch;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.disable_habitlab = disable_habitlab = async function(){
    var days_since_epoch, tabs, i$, len$, tab, results$ = [];
    days_since_epoch = get_days_since_epoch();
    localStorage.setItem('habitlab_disabled', days_since_epoch.toString());
    (await disable_interventions_in_all_tabs());
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({}, it);
    }));
    for (i$ = 0, len$ = tabs.length; i$ < len$; ++i$) {
      tab = tabs[i$];
      results$.push(chrome.browserAction.setIcon({
        tabId: tab.id,
        path: chrome.extension.getURL('icons/icon_disabled.svg')
      }));
    }
    return results$;
  };
  out$.enable_habitlab = enable_habitlab = async function(){
    var tabs, i$, len$, tab, results$ = [];
    localStorage.removeItem('habitlab_disabled');
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({}, it);
    }));
    for (i$ = 0, len$ = tabs.length; i$ < len$; ++i$) {
      tab = tabs[i$];
      results$.push(chrome.browserAction.setIcon({
        tabId: tab.id,
        path: chrome.extension.getURL('icons/icon.svg')
      }));
    }
    return results$;
  };
  out$.is_habitlab_enabled = is_habitlab_enabled = async function(){
    return is_habitlab_enabled_sync();
  };
  out$.is_habitlab_enabled_sync = is_habitlab_enabled_sync = function(){
    var days_since_epoch;
    days_since_epoch = get_days_since_epoch();
    return localStorage.getItem('habitlab_disabled') !== days_since_epoch.toString();
  };
  gexport_module('disable_habitlab_utils', function(it){
    return eval(it);
  });
}).call(this);
