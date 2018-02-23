(function(){
  var ref$, gexport, gexport_module, url_to_domain, tab_id_to_prev2_url_visited, tab_id_to_prev1_url_visited, past_navigation_events_list, tab_id_to_current_session_id, get_session_id_from_tab_id, session_id_counter, add_tab_navigation_event, session_id_to_data, set_session_data_sync, set_session_data, get_session_data_sync, get_session_data, is_on_same_domain_and_same_tab_sync, is_on_same_domain_and_same_tab, is_on_same_domain_sync, is_on_same_domain, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  tab_id_to_prev2_url_visited = {};
  tab_id_to_prev1_url_visited = {};
  past_navigation_events_list = [];
  tab_id_to_current_session_id = {};
  out$.get_session_id_from_tab_id = get_session_id_from_tab_id = async function(tab_id){
    return tab_id_to_current_session_id[tab_id] != null;
  };
  session_id_counter = 0;
  out$.add_tab_navigation_event = add_tab_navigation_event = function(tab_id, url){
    if (tab_id_to_prev1_url_visited[tab_id] != null) {
      tab_id_to_prev2_url_visited[tab_id] = tab_id_to_prev1_url_visited[tab_id];
    }
    tab_id_to_prev1_url_visited[tab_id] = url;
    while (past_navigation_events_list.length > 1) {
      past_navigation_events_list.shift();
    }
    past_navigation_events_list.push([tab_id, url]);
    if (tab_id_to_current_session_id[tab_id] == null) {
      session_id_counter = session_id_counter + 1;
      tab_id_to_current_session_id[tab_id] = session_id_counter;
    } else {
      if (!is_on_same_domain_and_same_tab_sync(tab_id)) {
        session_id_counter = session_id_counter + 1;
        tab_id_to_current_session_id[tab_id] = session_id_counter;
      }
    }
  };
  session_id_to_data = {};
  set_session_data_sync = function(session_id, key, val){
    if (session_id_to_data[session_id] == null) {
      session_id_to_data[session_id] = {};
    }
    session_id_to_data[key] = val;
  };
  out$.set_session_data = set_session_data = async function(session_id, key, val){
    set_session_data_sync(session_id, key, val);
  };
  get_session_data_sync = function(session_id, key){
    var session_data;
    session_data = session_id_to_data[session_id];
    if (session_data != null) {
      return session_data[key];
    }
    return null;
  };
  out$.get_session_data = get_session_data = async function(session_id, key){
    return get_session_data_sync(session_id, key);
  };
  /*
  export is_on_same_domain_and_same_tab = (tab_id) ->>
    current_url = tab_id_to_prev1_url_visited[tab_id]
    prev_url = tab_id_to_prev2_url_visited[tab_id]
    if not prev_url? or not current_url?
      return false
    current_domain = url_to_domain current_url
    prev_domain = url_to_domain prev_url
    return prev_domain == current_domain
  */
  is_on_same_domain_and_same_tab_sync = function(tab_id){
    var current_tab_id_and_url, prev_tab_id_and_url, current_url, prev_url, current_tab_id, prev_tab_id, current_domain, prev_domain;
    current_tab_id_and_url = past_navigation_events_list[1];
    prev_tab_id_and_url = past_navigation_events_list[0];
    if (current_tab_id_and_url == null || prev_tab_id_and_url == null) {
      return false;
    }
    current_url = current_tab_id_and_url[1];
    prev_url = prev_tab_id_and_url[1];
    if (current_url == null || prev_url == null) {
      return false;
    }
    current_tab_id = current_tab_id_and_url[0];
    prev_tab_id = prev_tab_id_and_url[0];
    current_domain = url_to_domain(current_url);
    prev_domain = url_to_domain(prev_url);
    return current_domain === prev_domain && current_tab_id === prev_tab_id;
  };
  out$.is_on_same_domain_and_same_tab = is_on_same_domain_and_same_tab = async function(tab_id){
    return is_on_same_domain_and_same_tab_sync(tab_id);
  };
  is_on_same_domain_sync = function(tab_id){
    var current_tab_id_and_url, prev_tab_id_and_url, current_url, prev_url, current_domain, prev_domain;
    current_tab_id_and_url = past_navigation_events_list[1];
    prev_tab_id_and_url = past_navigation_events_list[0];
    if (current_tab_id_and_url == null || prev_tab_id_and_url == null) {
      return false;
    }
    current_url = current_tab_id_and_url[1];
    prev_url = prev_tab_id_and_url[1];
    if (current_url == null || prev_url == null) {
      return false;
    }
    current_domain = url_to_domain(current_url);
    prev_domain = url_to_domain(prev_url);
    return current_domain === prev_domain;
  };
  out$.is_on_same_domain = is_on_same_domain = async function(tab_id){
    return is_on_same_domain_sync(tab_id);
  };
  gexport_module('session_utils', function(it){
    return eval(it);
  });
}).call(this);
