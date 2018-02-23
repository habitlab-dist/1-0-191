(function(){
  var ref$, gexport, gexport_module, getvar, addtovar, clearvar, getkey_dict, addtokey_dict, addtokey_dictdict, cleardict, get_timesaved_badge_that_should_be_awarded, localstorage_getjson, get_intervention_level, get_num_times_intervention_used, get_time_saved_total, get_time_saved_total_for_domain, get_time_saved_total_with_intervention, baseline_time_per_session_for_domain, record_seconds_saved_and_get_rewards, add_seconds_saved_with_intervention_on_domain, clear_times_intervention_used, clear_seconds_saved, clear_gamification_data, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  ref$ = require('libs_common/db_utils'), getvar = ref$.getvar, addtovar = ref$.addtovar, clearvar = ref$.clearvar, getkey_dict = ref$.getkey_dict, addtokey_dict = ref$.addtokey_dict, addtokey_dictdict = ref$.addtokey_dictdict, cleardict = ref$.cleardict;
  get_timesaved_badge_that_should_be_awarded = require('libs_common/badges_utils').get_timesaved_badge_that_should_be_awarded;
  localstorage_getjson = require('libs_common/localstorage_utils').localstorage_getjson;
  out$.get_intervention_level = get_intervention_level = async function(intervention_name){
    var times_used;
    times_used = get_num_times_intervention_used(intervention_name);
    if (times_used >= 10) {
      return 1;
    }
    return 0;
  };
  out$.get_num_times_intervention_used = get_num_times_intervention_used = async function(intervention_name){
    var result;
    result = (await getkey_dict('times_intervention_used', intervention_name));
    return result != null ? result : 0;
  };
  out$.get_time_saved_total = get_time_saved_total = async function(){
    var result;
    result = (await getvar('seconds_saved_total'));
    return result != null ? result : 0;
  };
  out$.get_time_saved_total_for_domain = get_time_saved_total_for_domain = async function(domain){
    var result;
    result = (await getkey_dict('seconds_saved_for_domain', domain));
    return result != null ? result : 0;
  };
  out$.get_time_saved_total_with_intervention = get_time_saved_total_with_intervention = async function(intervention_name){
    var result;
    result = (await getkey_dict('seconds_saved_for_intervention', intervention_name));
    return result != null ? result : 0;
  };
  out$.baseline_time_per_session_for_domain = baseline_time_per_session_for_domain = async function(domain){
    var result;
    result = (await getkey_dict('baseline_session_time_on_domains', domain));
    return result != null ? result : 300;
  };
  out$.record_seconds_saved_and_get_rewards = record_seconds_saved_and_get_rewards = async function(seconds, intervention_name, domain){
    var rewards, add_times_used_reward, add_seconds_saved_total_reward, times_used, seconds_saved_prev, seconds_saved;
    rewards = [];
    add_times_used_reward = function(times_used, times_used_prev){
      if (times_used === 10) {
        return rewards.push({
          type: 'intervention_mastered',
          intervention_name: intervention_name
        });
      }
    };
    add_seconds_saved_total_reward = function(seconds_saved, seconds_saved_prev){
      var timesaved_badge;
      timesaved_badge = get_timesaved_badge_that_should_be_awarded(seconds_saved, seconds_saved_prev);
      if (timesaved_badge != null) {
        return rewards.push(timesaved_badge);
      }
    };
    times_used = (await addtokey_dict('times_intervention_used', intervention_name, 1));
    seconds_saved_prev = (await get_time_saved_total());
    seconds_saved = (await addtovar('seconds_saved_total', seconds));
    add_seconds_saved_total_reward(seconds_saved, seconds_saved_prev);
    (await addtokey_dict('seconds_saved_for_intervention', intervention_name, seconds));
    (await addtokey_dict('seconds_saved_for_domain', domain, seconds));
    (await addtokey_dictdict('seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds));
    return rewards;
  };
  out$.add_seconds_saved_with_intervention_on_domain = add_seconds_saved_with_intervention_on_domain = async function(seconds, intervention_name, domain){
    (await addtokey_dict('times_intervention_used', intervention_name, 1));
    (await addtovar('seconds_saved_total', seconds));
    (await addtokey_dict('seconds_saved_for_intervention', intervention_name, seconds));
    (await addtokey_dict('seconds_saved_for_domain', domain, seconds));
    (await addtokey_dictdict('seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds));
  };
  out$.clear_times_intervention_used = clear_times_intervention_used = async function(){
    (await cleardict('times_intervention_used'));
  };
  out$.clear_seconds_saved = clear_seconds_saved = async function(){
    (await clearvar('seconds_saved_total'));
    (await cleardict('seconds_saved_for_intervention'));
    (await cleardict('seconds_saved_for_domain'));
    (await cleardict('seconds_saved_for_intervention_on_domain'));
  };
  out$.clear_gamification_data = clear_gamification_data = async function(){
    (await clear_times_intervention_used());
    (await clear_seconds_saved());
  };
  gexport_module('gamification_utils', function(it){
    return eval(it);
  });
}).call(this);
