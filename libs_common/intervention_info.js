(function(){
  var intervention_info_cached, set_intervention, get_goal_name, get_intervention, goal_info_cached, set_goal_info, get_goal_info, tab_id_cached, set_tab_id, get_tab_id, is_new_session_cached, set_is_new_session, get_is_new_session, session_id_cached, set_session_id, get_session_id, out$ = typeof exports != 'undefined' && exports || this;
  intervention_info_cached = null;
  out$.set_intervention = set_intervention = function(new_intervention_info){
    return intervention_info_cached = new_intervention_info;
  };
  out$.get_goal_name = get_goal_name = function(){
    return get_intervention().goals[0];
  };
  out$.get_intervention = get_intervention = function(){
    if (intervention_info_cached != null) {
      return intervention_info_cached;
    }
    if (typeof intervention != 'undefined' && intervention !== null) {
      return intervention;
    }
  };
  goal_info_cached = null;
  out$.set_goal_info = set_goal_info = function(new_goal_info){
    return goal_info_cached = new_goal_info;
  };
  out$.get_goal_info = get_goal_info = function(){
    if (goal_info_cached != null) {
      return goal_info_cached;
    }
    if (typeof goal_info != 'undefined' && goal_info !== null) {
      return goal_info;
    }
  };
  tab_id_cached = null;
  out$.set_tab_id = set_tab_id = function(new_tab_id){
    return tab_id_cached = new_tab_id;
  };
  out$.get_tab_id = get_tab_id = function(){
    if (tab_id_cached != null) {
      return tab_id_cached;
    }
    if (typeof tab_id != 'undefined' && tab_id !== null) {
      return tab_id;
    }
  };
  is_new_session_cached = null;
  out$.set_is_new_session = set_is_new_session = function(new_is_new_session){
    return is_new_session_cached = new_is_new_session;
  };
  out$.get_is_new_session = get_is_new_session = function(){
    if (is_new_session_cached != null) {
      return is_new_session_cached;
    }
    if (typeof is_new_session != 'undefined' && is_new_session !== null) {
      return is_new_session;
    }
    return false;
  };
  session_id_cached = null;
  out$.set_session_id = set_session_id = function(new_session_id){
    return session_id_cached = new_session_id;
  };
  out$.get_session_id = get_session_id = function(){
    if (session_id_cached != null) {
      return session_id_cached;
    }
    if (typeof session_id != 'undefined' && session_id !== null) {
      return session_id;
    }
  };
}).call(this);
