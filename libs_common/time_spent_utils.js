(function(){
  var moment, prelude, ref$, getkey_dictdict, getdict_for_key_dictdict, getdict_for_key2_dictdict, getCollection, setkey_dict, getkey_dict, url_to_domain, get_days_since_epoch, get_session_id, gexport, gexport_module, get_seconds_spent_on_all_domains_today, get_seconds_spent_on_all_domains_days_before_today, get_seconds_spent_on_domain_all_days, get_seconds_spent_on_domain_days_before_today, get_seconds_spent_on_domain_today, get_minutes_spent_on_domain_today, get_seconds_spent_on_current_domain_today, get_visits_to_domain_today, get_visits_to_domain_days_before_today, get_visits_to_current_domain_today, get_new_session_id_for_domain, get_seconds_spent_on_current_domain_in_session, get_seconds_spent_on_domain_in_session, get_seconds_spent_on_current_domain_in_current_session, out$ = typeof exports != 'undefined' && exports || this;
  moment = require('moment');
  prelude = require('prelude-ls');
  ref$ = require('libs_common/db_utils'), getkey_dictdict = ref$.getkey_dictdict, getdict_for_key_dictdict = ref$.getdict_for_key_dictdict, getdict_for_key2_dictdict = ref$.getdict_for_key2_dictdict, getCollection = ref$.getCollection, setkey_dict = ref$.setkey_dict, getkey_dict = ref$.getkey_dict;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  get_days_since_epoch = require('libs_common/time_utils').get_days_since_epoch;
  get_session_id = require('libs_common/intervention_info').get_session_id;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.get_seconds_spent_on_all_domains_today = get_seconds_spent_on_all_domains_today = async function(){
    return (await getdict_for_key2_dictdict('seconds_on_domain_per_day', get_days_since_epoch()));
  };
  out$.get_seconds_spent_on_all_domains_days_before_today = get_seconds_spent_on_all_domains_days_before_today = async function(days_ago){
    return (await getdict_for_key2_dictdict('seconds_on_domain_per_day', get_days_since_epoch() - days_ago));
  };
  out$.get_seconds_spent_on_domain_all_days = get_seconds_spent_on_domain_all_days = async function(domain){
    var results, today_day_num, output, k, v;
    results = (await getdict_for_key_dictdict('seconds_on_domain_per_day', domain));
    today_day_num = get_days_since_epoch();
    output = {};
    for (k in results) {
      v = results[k];
      output[today_day_num - k] = v;
    }
    return output;
  };
  out$.get_seconds_spent_on_domain_days_before_today = get_seconds_spent_on_domain_days_before_today = async function(domain, days_ago){
    var current_day, result;
    current_day = get_days_since_epoch();
    result = (await getkey_dictdict('seconds_on_domain_per_day', domain, current_day - days_ago));
    return result != null ? result : 0;
  };
  out$.get_seconds_spent_on_domain_today = get_seconds_spent_on_domain_today = async function(domain){
    var current_day, result;
    current_day = get_days_since_epoch();
    result = (await getkey_dictdict('seconds_on_domain_per_day', domain, current_day));
    return result != null ? result : 0;
  };
  out$.get_minutes_spent_on_domain_today = get_minutes_spent_on_domain_today = async function(domain){
    var current_day, result;
    current_day = get_days_since_epoch();
    result = (await getkey_dictdict('seconds_on_domain_per_day', domain, current_day));
    if (result != null) {
      return Math.floor(result / 60.0);
    }
    return 0;
  };
  /**
  * Return seconds spent on current domain today
  * @return {integer} seconds spent
  */
  out$.get_seconds_spent_on_current_domain_today = get_seconds_spent_on_current_domain_today = async function(){
    var current_domain, result;
    current_domain = window.location.hostname;
    result = (await get_seconds_spent_on_domain_today(current_domain));
    return result != null ? result : 0;
  };
  out$.get_visits_to_domain_today = get_visits_to_domain_today = async function(domain){
    var current_day, result;
    current_day = get_days_since_epoch();
    result = (await getkey_dictdict('visits_to_domain_per_day', domain, current_day));
    return result != null ? result : 0;
  };
  out$.get_visits_to_domain_days_before_today = get_visits_to_domain_days_before_today = async function(domain, days_ago){
    var current_day, result;
    current_day = get_days_since_epoch();
    result = (await getkey_dictdict('visits_to_domain_per_day', domain, current_day - days_ago));
    return result != null ? result : 0;
  };
  out$.get_visits_to_current_domain_today = get_visits_to_current_domain_today = async function(){
    var current_domain, result;
    current_domain = window.location.hostname;
    result = (await get_visits_to_domain_today(current_domain));
    return result != null ? result : 0;
  };
  /*
  export get_new_session_id_for_domain = (domain) ->>
    collection = await getCollection('seconds_on_domain_per_session')
    all_session_ids_for_domain = await collection.where('key').equals(domain).toArray()
    all_session_ids_for_domain = all_session_ids_for_domain.map (.key2)
    if all_session_ids_for_domain.length == 0
      return 0
    return prelude.maximum(all_session_ids_for_domain) + 1 # this is the day, in epoch time, that the most recent intervention set occurred
  */
  out$.get_new_session_id_for_domain = get_new_session_id_for_domain = async function(domain){
    var result;
    result = (await getkey_dict('domain_to_last_session_id', domain));
    if (result == null) {
      (await setkey_dict('domain_to_last_session_id', domain, 0));
      return 0;
    }
    (await setkey_dict('domain_to_last_session_id', domain, result + 1));
    return result + 1;
  };
  out$.get_seconds_spent_on_current_domain_in_session = get_seconds_spent_on_current_domain_in_session = async function(session_id){
    var current_domain, result;
    current_domain = window.location.hostname;
    result = (await get_seconds_spent_on_domain_in_session(current_domain, session_id));
    return result != null ? result : 0;
  };
  out$.get_seconds_spent_on_domain_in_session = get_seconds_spent_on_domain_in_session = async function(domain, session_id){
    var result;
    result = (await getkey_dictdict('seconds_on_domain_per_session', domain, session_id));
    return result != null ? result : 0;
  };
  out$.get_seconds_spent_on_current_domain_in_current_session = get_seconds_spent_on_current_domain_in_current_session = async function(){
    var session_id, current_domain, result;
    session_id = get_session_id();
    current_domain = window.location.hostname;
    result = (await get_seconds_spent_on_domain_in_session(current_domain, session_id));
    return result != null ? result : 0;
  };
  gexport_module('time_spent_utils', function(it){
    return eval(it);
  });
}).call(this);
