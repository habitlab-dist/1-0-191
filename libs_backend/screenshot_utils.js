(function(){
  var ref$, gexport, gexport_module, get_active_tab_info, list_currently_loaded_interventions, get_user_id, get_goals, get_enabled_goals, get_interventions, get_enabled_interventions, as_array, get_screenshot_as_base64, get_data_for_feedback, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  ref$ = require('libs_backend/background_common'), get_active_tab_info = ref$.get_active_tab_info, list_currently_loaded_interventions = ref$.list_currently_loaded_interventions, get_user_id = ref$.get_user_id;
  ref$ = require('libs_backend/goal_utils'), get_goals = ref$.get_goals, get_enabled_goals = ref$.get_enabled_goals;
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_enabled_interventions = ref$.get_enabled_interventions;
  as_array = require('libs_common/collection_utils').as_array;
  out$.get_screenshot_as_base64 = get_screenshot_as_base64 = async function(){
    var data_url;
    fetch('https://habitlab-reportbug.herokuapp.com/ping').then(function(it){
      return it.text();
    });
    data_url = (await new Promise(function(it){
      return chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, it);
    }));
    return data_url;
  };
  out$.get_data_for_feedback = get_data_for_feedback = async function(){
    var data, goal_name, ref$, goal_info;
    data = {};
    data.background_url = window.location.href;
    data.browser = navigator.userAgent;
    data.language = navigator.language;
    data.languages = navigator.languages;
    data.extra = {};
    data.extra.user_id = (await get_user_id());
    data.extra.tab_info = (await get_active_tab_info());
    data.url = data.extra.tab_info.url;
    data.loaded_interventions = (await list_currently_loaded_interventions());
    data.extra.interventions = JSON.parse(JSON.stringify((await get_interventions())));
    data.extra.goals = JSON.parse(JSON.stringify((await get_goals())));
    for (goal_name in ref$ = data.extra.goals) {
      goal_info = ref$[goal_name];
      if (goal_info.icon != null) {
        delete goal_info.icon;
      }
    }
    data.enabled_interventions = as_array((await get_enabled_interventions()));
    data.enabled_goals = as_array((await get_enabled_goals()));
    data.extra.manifest = chrome.runtime.getManifest();
    data.devmode = data.extra.manifest.update_url == null;
    data.version = data.extra.manifest.version;
    data.chrome_runtime_id = chrome.runtime.id;
    data.extra.client_timestamp = Date.now();
    data.extra.client_localtime = new Date().toString();
    return data;
  };
  gexport_module('screenshot_utils', function(it){
    return eval(it);
  });
}).call(this);
