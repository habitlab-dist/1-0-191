(function(){
  var moment, shuffled, prelude, median, memoizeSingleAsync, ref$, setkey_dictdict, getkey_dictdict, getdict_for_key_dictdict, get_baseline_session_time_on_domain, url_to_domain, gexport, gexport_module, as_dictset, as_array, remove_keys_matching_patternfunc_from_localstorage_dict, remove_items_matching_patternfunc_from_localstorage_list, remove_key_from_localstorage_dict, remove_item_from_localstorage_list, remove_keys_from_localstorage_dict, remove_items_from_localstorage_list, unique_concat, localget_json, set_override_enabled_interventions_once, get_enabled_interventions_with_override, get_enabled_interventions_with_override_for_visit, is_it_outside_work_hours, list_enabled_interventions, get_enabled_interventions, set_enabled_interventions, default_generic_interventions_list, default_generic_positive_interventions_list, list_enabled_generic_interventions, list_enabled_generic_positive_interventions, set_default_generic_interventions_enabled, set_interventions_enabled, set_intervention_enabled, set_intervention_disabled_permanently, set_intervention_disabled, is_intervention_enabled, is_video_domain, generate_interventions_for_domain, generate_interventions_for_positive_domain, add_new_intervention, list_custom_interventions, add_new_interventions, remove_all_custom_interventions, remove_generated_interventions_for_domain, remove_custom_intervention, list_generic_interventions, list_generic_positive_interventions, list_video_interventions, list_all_interventions, clear_extra_interventions_and_cache, clear_cache_all_interventions, clear_cache_list_all_interventions, get_intervention_info, fix_intervention_info, fix_intervention_name_to_intervention_info_dict, get_interventions_per_goal, get_intervention_choosing_strategy, select_subset_of_available_interventions, get_interventions, clear_cache_get_interventions, list_enabled_interventions_for_location, list_all_enabled_interventions_for_location, list_enabled_nonconflicting_interventions_for_location, list_available_interventions_for_location, get_manually_managed_interventions_localstorage, get_manually_managed_interventions, set_manually_managed_interventions, set_intervention_manually_managed, set_intervention_automatically_managed, list_available_interventions_for_enabled_goals, list_available_interventions_for_goal, list_enabled_interventions_for_goal, cast_to_bool, cast_to_type, set_intervention_parameter, get_intervention_parameter_type, get_intervention_parameter_default, get_intervention_parameters_default, get_intervention_parameter, get_intervention_parameters, get_seconds_spent_on_domain_for_each_intervention, get_seconds_saved_per_session_for_each_intervention_for_goal, get_seconds_spent_per_session_for_each_intervention_for_goal, get_goals_and_interventions, intervention_manager, goal_utils, log_utils, out$ = typeof exports != 'undefined' && exports || this;
  moment = require('moment');
  shuffled = require('shuffled');
  prelude = require('prelude-ls');
  median = require('libs_common/math_utils').median;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  ref$ = require('libs_backend/db_utils'), setkey_dictdict = ref$.setkey_dictdict, getkey_dictdict = ref$.getkey_dictdict, getdict_for_key_dictdict = ref$.getdict_for_key_dictdict;
  get_baseline_session_time_on_domain = require('libs_backend/history_utils').get_baseline_session_time_on_domain;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  ref$ = require('libs_common/collection_utils'), as_dictset = ref$.as_dictset, as_array = ref$.as_array, remove_keys_matching_patternfunc_from_localstorage_dict = ref$.remove_keys_matching_patternfunc_from_localstorage_dict, remove_items_matching_patternfunc_from_localstorage_list = ref$.remove_items_matching_patternfunc_from_localstorage_list, remove_key_from_localstorage_dict = ref$.remove_key_from_localstorage_dict, remove_item_from_localstorage_list = ref$.remove_item_from_localstorage_list, remove_keys_from_localstorage_dict = ref$.remove_keys_from_localstorage_dict, remove_items_from_localstorage_list = ref$.remove_items_from_localstorage_list;
  unique_concat = require('libs_common/array_utils').unique_concat;
  localget_json = require('libs_common/cacheget_utils').localget_json;
  /*
  cached_get_intervention_info = {}
  cached_get_intervention_info_unmodified = {}
  
  getInterventionInfo = (intervention_name) ->>
    cached_val = cached_get_intervention_info[intervention_name]
    if cached_val?
      return JSON.parse JSON.stringify cached_val
    cached_val = cached_get_intervention_info_unmodified[intervention_name]
    if cached_val?
      return JSON.parse JSON.stringify cached_val
    intervention_info = await localget_json("/interventions/#{intervention_name}/info.json")
    intervention_info.name = intervention_name
    intervention_info.sitename = intervention_name.split('/')[0]
    cached_get_intervention_info[intervention_name] = intervention_info
    cached_get_intervention_info_unmodified[intervention_name] = intervention_info
    return intervention_info
  */
  out$.set_override_enabled_interventions_once = set_override_enabled_interventions_once = function(intervention_name){
    localStorage.setItem('override_enabled_interventions_once', JSON.stringify([intervention_name]));
  };
  out$.get_enabled_interventions_with_override = get_enabled_interventions_with_override = async function(){
    var override_enabled_interventions, enabled_interventions;
    override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once');
    if (override_enabled_interventions != null) {
      return as_dictset(JSON.parse(override_enabled_interventions));
    }
    enabled_interventions = (await intervention_manager.get_enabled_interventions_for_today());
    return enabled_interventions;
  };
  out$.get_enabled_interventions_with_override_for_visit = get_enabled_interventions_with_override_for_visit = async function(){
    var override_enabled_interventions, enabled_interventions;
    override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once');
    if (override_enabled_interventions != null) {
      return as_dictset(JSON.parse(override_enabled_interventions));
    }
    enabled_interventions = (await intervention_manager.get_enabled_interventions_for_visit());
    return enabled_interventions;
  };
  /*
  export get_enabled_interventions = ->>
    enabled_interventions = await intervention_manager.get_enabled_interventions_for_today()
    return enabled_interventions
  
  export set_enabled_interventions = (enabled_interventions) ->>
    await intervention_manager.set_enabled_interventions_for_today_manual enabled_interventions
    return
  */
  out$.is_it_outside_work_hours = is_it_outside_work_hours = function(){
    var work_hours_only, ref$, start_mins_since_midnight, end_mins_since_midnight, activedaysarray, mins_since_midnight, today_idx;
    work_hours_only = (ref$ = localStorage.work_hours_only) != null ? ref$ : 'false', start_mins_since_midnight = (ref$ = localStorage.start_mins_since_midnight) != null ? ref$ : '0', end_mins_since_midnight = (ref$ = localStorage.end_mins_since_midnight) != null ? ref$ : '1440', activedaysarray = localStorage.activedaysarray;
    work_hours_only = work_hours_only === 'true';
    start_mins_since_midnight = parseInt(start_mins_since_midnight);
    end_mins_since_midnight = parseInt(end_mins_since_midnight);
    mins_since_midnight = moment().hours() * 60 + moment().minutes();
    if (work_hours_only) {
      if (!(start_mins_since_midnight <= mins_since_midnight && mins_since_midnight <= end_mins_since_midnight)) {
        return true;
      }
      if (activedaysarray != null) {
        activedaysarray = JSON.parse(activedaysarray);
        today_idx = moment().weekday();
        if (!activedaysarray.includes(today_idx)) {
          return true;
        }
      }
    }
    return false;
  };
  /**
   * Returns a list of names of enabled interventions
   * @return {Promise.<Array.<InterventionName>>} List of enabled intervention names
   */
  out$.list_enabled_interventions = list_enabled_interventions = async function(){
    var enabled_interventions;
    enabled_interventions = (await intervention_manager.get_currently_enabled_interventions());
    return as_array(enabled_interventions);
  };
  /**
   * Returns a object with with names of enabled interventions as keys, and whether they are enabled as values
   * @return {Promise.<Object.<InterventionName, boolean>>} Object with enabled interventions as keys
   */
  out$.get_enabled_interventions = get_enabled_interventions = async function(){
    var enabled_interventions;
    enabled_interventions = (await intervention_manager.get_currently_enabled_interventions());
    return enabled_interventions;
  };
  out$.set_enabled_interventions = set_enabled_interventions = async function(enabled_interventions){
    return (await intervention_manager.set_currently_enabled_interventions_manual(enabled_interventions));
  };
  /*
  export set_intervention_enabled = (intervention_name) ->>
    enabled_interventions = await get_enabled_interventions()
    if enabled_interventions[intervention_name]
      return
    enabled_interventions[intervention_name] = true
    await set_enabled_interventions enabled_interventions
  
  export set_intervention_disabled_permanently = (intervention_name) ->>
    await set_intervention_manually_managed intervention_name
    enabled_interventions = await get_enabled_interventions()
    if not enabled_interventions[intervention_name]
      return
    enabled_interventions[intervention_name] = false
    await set_enabled_interventions enabled_interventions
  
  export set_intervention_disabled = (intervention_name) ->>
    enabled_interventions = await get_enabled_interventions()
    if not enabled_interventions[intervention_name]
      return
    enabled_interventions[intervention_name] = false
    await set_enabled_interventions enabled_interventions
  */
  default_generic_interventions_list = ['generic/toast_notifications', 'generic/show_timer_banner'];
  default_generic_positive_interventions_list = ['generic_positive/feed_injection_positive_goal_widget'];
  out$.list_enabled_generic_interventions = list_enabled_generic_interventions = async function(){
    var enabled_interventions, output, k, v;
    enabled_interventions = (await get_enabled_interventions());
    output = [];
    for (k in enabled_interventions) {
      v = enabled_interventions[k];
      if (v && k.startsWith('generic/')) {
        output.push(k);
      }
    }
    if (output.length === 0) {
      return default_generic_interventions_list;
    }
    return output;
  };
  out$.list_enabled_generic_positive_interventions = list_enabled_generic_positive_interventions = async function(){
    var enabled_interventions, output, k, v;
    enabled_interventions = (await get_enabled_interventions());
    output = [];
    for (k in enabled_interventions) {
      v = enabled_interventions[k];
      if (v && k.startsWith('generic_positive/')) {
        output.push(k);
      }
    }
    if (output.length === 0) {
      return default_generic_positive_interventions_list;
    }
    return output;
  };
  out$.set_default_generic_interventions_enabled = set_default_generic_interventions_enabled = async function(){
    (await set_interventions_enabled(default_generic_interventions_list.concat(default_generic_positive_interventions_list)));
  };
  out$.set_interventions_enabled = set_interventions_enabled = async function(intervention_name_list){
    var i$, len$, x;
    for (i$ = 0, len$ = intervention_name_list.length; i$ < len$; ++i$) {
      x = intervention_name_list[i$];
      (await set_intervention_enabled(x));
    }
  };
  out$.set_intervention_enabled = set_intervention_enabled = async function(intervention_name){
    var is_disabled;
    is_disabled = (await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name));
    if (is_disabled === false) {
      return;
    }
    (await intervention_manager.set_intervention_enabled_from_intervention_manager(intervention_name));
  };
  out$.set_intervention_disabled_permanently = set_intervention_disabled_permanently = async function(intervention_name){
    var is_disabled;
    is_disabled = (await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name));
    if (is_disabled === true) {
      return;
    }
    (await intervention_manager.set_intervention_disabled_from_intervention_manager(intervention_name));
  };
  out$.set_intervention_disabled = set_intervention_disabled = async function(intervention_name){
    var is_disabled;
    is_disabled = (await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name));
    if (is_disabled === true) {
      return;
    }
    (await intervention_manager.set_intervention_disabled_from_intervention_manager(intervention_name));
  };
  out$.is_intervention_enabled = is_intervention_enabled = async function(intervention_name){
    var is_disabled;
    is_disabled = (await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name));
    if (is_disabled === true) {
      return false;
    }
    return true;
  };
  out$.is_video_domain = is_video_domain = function(domain){
    var video_domains;
    video_domains = {
      'www.iqiyi.com': true,
      'v.youku.com': true,
      'vimeo.com': true,
      'www.youtube.com': true,
      'www.netflix.com': true
    };
    if (video_domains[domain]) {
      return true;
    }
    return false;
  };
  out$.generate_interventions_for_domain = generate_interventions_for_domain = async function(domain){
    var goal_name, goal_info, default_interventions, ref$, generic_interventions, all_intervention_info, video_interventions, new_intervention_info_list, i$, len$, generic_intervention, intervention_info, fixed_intervention_name, make_absolute_path, default_enabled_interventions, interventions_per_goal, intervention_choosing_strategy;
    goal_name = "custom/spend_less_time_" + domain;
    goal_info = (await goal_utils.get_goal_info(goal_name));
    default_interventions = (ref$ = goal_info.default_interventions) != null
      ? ref$
      : [];
    generic_interventions = (await list_generic_interventions());
    all_intervention_info = (await get_interventions());
    if (is_video_domain(domain)) {
      video_interventions = (await list_video_interventions());
      generic_interventions = generic_interventions.concat(video_interventions);
    }
    new_intervention_info_list = [];
    for (i$ = 0, len$ = generic_interventions.length; i$ < len$; ++i$) {
      generic_intervention = generic_interventions[i$];
      intervention_info = all_intervention_info[generic_intervention];
      if (intervention_info == null) {
        continue;
      }
      intervention_info = JSON.parse(JSON.stringify(intervention_info));
      fixed_intervention_name = generic_intervention;
      fixed_intervention_name = fixed_intervention_name.split('generic/').join("generated_" + domain + "/");
      fixed_intervention_name = fixed_intervention_name.split('video/').join("generated_" + domain + "/");
      intervention_info.name = fixed_intervention_name;
      intervention_info.matches = [domain];
      make_absolute_path = fn$;
      if (intervention_info.content_scripts != null) {
        intervention_info.content_scripts = intervention_info.content_scripts.map(make_absolute_path);
      }
      if (intervention_info.background_scripts != null) {
        intervention_info.background_scripts = intervention_info.background_scripts.map(make_absolute_path);
      }
      intervention_info.sitename = domain;
      intervention_info.sitename_printable = domain;
      if (intervention_info.sitename_printable.startsWith('www.')) {
        intervention_info.sitename_printable = intervention_info.sitename_printable.substr(4);
      }
      intervention_info.generated = true;
      intervention_info.generic_intervention = generic_intervention;
      intervention_info.goals = [goal_name];
      intervention_info.is_default = default_interventions.includes(intervention_info.name);
      new_intervention_info_list.push(intervention_info);
    }
    ref$ = select_subset_of_available_interventions(new_intervention_info_list), default_enabled_interventions = ref$[0], interventions_per_goal = ref$[1], intervention_choosing_strategy = ref$[2];
    log_utils.add_log_interventions({
      type: 'default_interventions_for_custom_goal',
      interventions_per_goal: interventions_per_goal,
      custom_goal: goal_name,
      intervention_choosing_strategy: intervention_choosing_strategy,
      default_enabled_interventions: default_enabled_interventions
    });
    (await add_new_interventions(new_intervention_info_list));
    function fn$(content_script){
      if (content_script.path != null) {
        if (content_script.path[0] === '/') {
          return content_script;
        }
        content_script.path = '/interventions/' + generic_intervention + '/' + content_script.path;
        return content_script;
      }
      if (content_script[0] === '/') {
        return content_script;
      }
      return '/interventions/' + generic_intervention + '/' + content_script;
    }
  };
  out$.generate_interventions_for_positive_domain = generate_interventions_for_positive_domain = async function(domain){
    var goal_name, goal_info, default_interventions, ref$, generic_interventions, all_intervention_info, new_intervention_info_list, i$, len$, generic_intervention, intervention_info, fixed_intervention_name, make_absolute_path;
    goal_name = "custom/spend_more_time_" + domain;
    goal_info = (await goal_utils.get_goal_info(goal_name));
    default_interventions = (ref$ = goal_info.default_interventions) != null
      ? ref$
      : [];
    generic_interventions = (await list_generic_positive_interventions());
    all_intervention_info = (await get_interventions());
    new_intervention_info_list = [];
    for (i$ = 0, len$ = generic_interventions.length; i$ < len$; ++i$) {
      generic_intervention = generic_interventions[i$];
      intervention_info = all_intervention_info[generic_intervention];
      if (intervention_info == null) {
        continue;
      }
      intervention_info = JSON.parse(JSON.stringify(intervention_info));
      fixed_intervention_name = generic_intervention;
      fixed_intervention_name = fixed_intervention_name.split('generic_positive/').join("generated_" + domain + "/");
      intervention_info.name = fixed_intervention_name;
      make_absolute_path = fn$;
      if (intervention_info.content_scripts != null) {
        intervention_info.content_scripts = intervention_info.content_scripts.map(make_absolute_path);
      }
      if (intervention_info.background_scripts != null) {
        intervention_info.background_scripts = intervention_info.background_scripts.map(make_absolute_path);
      }
      intervention_info.sitename = domain;
      intervention_info.sitename_printable = domain;
      if (intervention_info.sitename_printable.startsWith('www.')) {
        intervention_info.sitename_printable = intervention_info.sitename_printable.substr(4);
      }
      intervention_info.generated = true;
      intervention_info.generic_intervention = generic_intervention;
      intervention_info.goals = [goal_name];
      intervention_info.is_default = default_interventions.includes(intervention_info.name);
      new_intervention_info_list.push(intervention_info);
    }
    (await add_new_interventions(new_intervention_info_list));
    function fn$(content_script){
      if (content_script.path != null) {
        if (content_script.path[0] === '/') {
          return content_script;
        }
        content_script.path = '/interventions/' + generic_intervention + '/' + content_script.path;
        return content_script;
      }
      if (content_script[0] === '/') {
        return content_script;
      }
      return '/interventions/' + generic_intervention + '/' + content_script;
    }
  };
  out$.add_new_intervention = add_new_intervention = async function(intervention_info){
    return (await add_new_interventions([intervention_info]));
  };
  /**
   * Returns a list of names of custom interventions
   * @return {Promise.<Array.<InterventionName>>} List of names of custom interventions
   */
  out$.list_custom_interventions = list_custom_interventions = async function(){
    var all_interventions, name, info;
    all_interventions = (await get_interventions());
    return prelude.sort((await (async function(){
      var ref$, results$ = [];
      for (name in ref$ = all_interventions) {
        info = ref$[name];
        if (info.custom) {
          results$.push(name);
        }
      }
      return results$;
    }())));
  };
  out$.add_new_interventions = add_new_interventions = async function(intervention_info_list){
    var extra_get_interventions, extra_list_all_interventions, new_intervention_names, i$, len$, intervention_info, this$ = this;
    extra_get_interventions = localStorage.getItem('extra_get_interventions');
    if (extra_get_interventions != null) {
      extra_get_interventions = JSON.parse(extra_get_interventions);
    } else {
      extra_get_interventions = {};
    }
    extra_list_all_interventions = localStorage.getItem('extra_list_all_interventions');
    if (extra_list_all_interventions != null) {
      extra_list_all_interventions = JSON.parse(extra_list_all_interventions);
    } else {
      extra_list_all_interventions = [];
    }
    new_intervention_names = intervention_info_list.map(function(it){
      return it.name;
    });
    extra_list_all_interventions = unique_concat(extra_list_all_interventions, new_intervention_names);
    localStorage.setItem('extra_list_all_interventions', JSON.stringify(extra_list_all_interventions));
    for (i$ = 0, len$ = intervention_info_list.length; i$ < len$; ++i$) {
      intervention_info = intervention_info_list[i$];
      extra_get_interventions[intervention_info.name] = intervention_info;
    }
    localStorage.setItem('extra_get_interventions', JSON.stringify(extra_get_interventions));
    goal_utils.clear_cache_get_goals();
    clear_cache_all_interventions();
    log_utils.clear_intervention_logdb_cache();
    (await list_all_interventions());
    (await get_interventions());
    (await goal_utils.get_goals());
    (await log_utils.getInterventionLogDb());
  };
  out$.remove_all_custom_interventions = remove_all_custom_interventions = function(){
    clear_cache_all_interventions();
    goal_utils.clear_cache_get_goals();
    localStorage.removeItem('extra_get_interventions');
    localStorage.removeItem('extra_list_all_interventions');
  };
  out$.remove_generated_interventions_for_domain = remove_generated_interventions_for_domain = function(domain){
    clear_cache_all_interventions();
    goal_utils.clear_cache_get_goals();
    remove_keys_matching_patternfunc_from_localstorage_dict('extra_get_interventions', function(it){
      return it.startsWith("generated_" + domain + "/");
    });
    remove_items_matching_patternfunc_from_localstorage_list('extra_list_all_interventions', function(it){
      return it.startsWith("generated_" + domain + "/");
    });
  };
  out$.remove_custom_intervention = remove_custom_intervention = function(intervention_name){
    clear_cache_all_interventions();
    goal_utils.clear_cache_get_goals();
    remove_key_from_localstorage_dict('extra_get_interventions', intervention_name);
    remove_item_from_localstorage_list('extra_list_all_interventions', intervention_name);
  };
  out$.list_generic_interventions = list_generic_interventions = memoizeSingleAsync(async function(){
    var cached_generic_interventions, interventions_list, generic_interventions_list, this$ = this;
    cached_generic_interventions = localStorage.getItem('cached_list_generic_interventions');
    if (cached_generic_interventions != null) {
      return JSON.parse(cached_generic_interventions);
    }
    interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map(function(it){
      return it.name;
    });
    generic_interventions_list = interventions_list.filter(function(it){
      return it.startsWith('generic/');
    });
    localStorage.setItem('cached_list_generic_interventions', JSON.stringify(generic_interventions_list));
    return generic_interventions_list;
  });
  out$.list_generic_positive_interventions = list_generic_positive_interventions = memoizeSingleAsync(async function(){
    var cached_generic_positive_interventions, interventions_list, generic_positive_interventions_list, this$ = this;
    cached_generic_positive_interventions = localStorage.getItem('cached_list_generic_positive_interventions');
    if (cached_generic_positive_interventions != null) {
      return JSON.parse(cached_generic_positive_interventions);
    }
    interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map(function(it){
      return it.name;
    });
    generic_positive_interventions_list = interventions_list.filter(function(it){
      return it.startsWith('generic_positive/');
    });
    localStorage.setItem('cached_list_generic_positive_interventions', JSON.stringify(generic_positive_interventions_list));
    return generic_positive_interventions_list;
  });
  out$.list_video_interventions = list_video_interventions = memoizeSingleAsync(async function(){
    var cached_video_interventions, interventions_list, video_interventions_list, this$ = this;
    cached_video_interventions = localStorage.getItem('cached_list_video_interventions');
    if (cached_video_interventions != null) {
      return JSON.parse(cached_video_interventions);
    }
    interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map(function(it){
      return it.name;
    });
    video_interventions_list = interventions_list.filter(function(it){
      return it.startsWith('video/');
    });
    localStorage.setItem('cached_list_video_interventions', JSON.stringify(video_interventions_list));
    return video_interventions_list;
  });
  /**
   * Lists all available interventions
   * @return {Promise.<Array.<InterventionName>>} The list of available interventions
   */
  out$.list_all_interventions = list_all_interventions = async function(){
    var cached_list_all_interventions, interventions_list, interventions_list_extra_text, interventions_list_extra, this$ = this;
    cached_list_all_interventions = localStorage.getItem('cached_list_all_interventions');
    if (cached_list_all_interventions != null) {
      return JSON.parse(cached_list_all_interventions);
    }
    interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map(function(it){
      return it.name;
    });
    interventions_list_extra_text = localStorage.getItem('extra_list_all_interventions');
    if (interventions_list_extra_text != null) {
      interventions_list_extra = JSON.parse(interventions_list_extra_text);
      interventions_list = unique_concat(interventions_list, interventions_list_extra);
    }
    localStorage.setItem('cached_list_all_interventions', JSON.stringify(interventions_list));
    return interventions_list;
  };
  out$.clear_extra_interventions_and_cache = clear_extra_interventions_and_cache = function(){
    localStorage.removeItem('extra_get_interventions');
    localStorage.removeItem('extra_list_all_interventions');
    return clear_cache_all_interventions();
  };
  out$.clear_cache_all_interventions = clear_cache_all_interventions = function(){
    clear_cache_list_all_interventions();
    clear_cache_get_interventions();
  };
  out$.clear_cache_list_all_interventions = clear_cache_list_all_interventions = function(){
    localStorage.removeItem('cached_list_all_interventions');
  };
  /**
   * Gets the intervention info for the specified intervention name
   * @param {InterventionName} intervention_name - The name of the intervention
   * @return {Promise.<InterventionInfo>} The intervention info
   */
  out$.get_intervention_info = get_intervention_info = async function(intervention_name){
    var all_interventions;
    all_interventions = (await get_interventions());
    return all_interventions[intervention_name];
  };
  fix_intervention_info = function(intervention_info, goals_satisfied_by_intervention){
    var intervention_name, fix_content_script_options, fix_background_script_options, fix_intervention_parameter, ref$, i$, len$, parameter, res$, x;
    intervention_name = intervention_info.name;
    fix_content_script_options = function(options, intervention_name){
      if (typeof options === 'string') {
        options = {
          path: options
        };
      }
      if (options.code != null) {
        if (options.path == null) {
          options.path = 'content_script_' + Math.floor(Math.random() * 1000000);
        }
      } else {
        if (options.path[0] !== '/') {
          options.path = "/interventions/" + intervention_name + "/" + options.path;
        }
      }
      if (options.run_at == null) {
        options.run_at = 'document_end';
      }
      if (options.all_frames == null) {
        options.all_frames = false;
      }
      return options;
    };
    fix_background_script_options = function(options, intervention_name){
      if (typeof options === 'string') {
        options = {
          path: options
        };
      }
      if (options.code != null) {
        if (options.path == null) {
          options.path = 'background_script_' + Math.floor(Math.random() * 1000000);
        }
      } else {
        if (options.path[0] === '/') {
          options.path = options.path.substr(1);
        } else {
          options.path = "/interventions/" + intervention_name + "/" + options.path;
        }
      }
      return options;
    };
    fix_intervention_parameter = function(parameter, intervention_info){
      var curtype;
      if (parameter.name == null) {
        console.log("warning: missing parameter.name for intervention " + intervention_info.name);
      }
      if (parameter['default'] == null) {
        console.log("warning: missing parameter.default for intervention " + intervention_info.name);
      }
      if (parameter.type == null) {
        parameter.type = 'string';
        return;
      }
      curtype = parameter.type.toLowerCase();
      if (curtype.startsWith('str')) {
        parameter.type = 'string';
        return;
      }
      if (curtype.startsWith('int')) {
        parameter.type = 'int';
        return;
      }
      if (curtype.startsWith('float') || curtype.startsWith('real') || curtype.startsWith('double') || curtype.startsWith('num')) {
        parameter.type = 'float';
        return;
      }
      if (curtype.startsWith('bool')) {
        parameter.type = 'bool';
        return;
      }
      return console.log("warning: invalid parameter.type " + curtype + " for intervention " + intervention_info.name);
    };
    if (intervention_info.displayname == null) {
      intervention_info.displayname = (ref$ = intervention_name.split('/'))[ref$.length - 1].split('_').join(' ');
    }
    if (intervention_info.nomatches == null) {
      intervention_info.nomatches = [];
    }
    if (intervention_info.matches == null) {
      intervention_info.matches = [];
    }
    if (intervention_info.content_scripts == null) {
      intervention_info.content_scripts = [];
    }
    if (intervention_info.background_scripts == null) {
      intervention_info.background_scripts = [];
    }
    if (intervention_info.parameters == null) {
      intervention_info.parameters = [];
    }
    if (intervention_info.categories == null) {
      intervention_info.categories = [];
    }
    if (intervention_info.conflicts == null) {
      intervention_info.conflicts = [];
    }
    if (intervention_info.parameters.filter(function(it){
      return it.name === 'debug';
    }).length === 0) {
      intervention_info.parameters.push({
        name: 'debug',
        description: 'Insert debug console',
        type: 'bool',
        'default': false
      });
    }
    for (i$ = 0, len$ = (ref$ = intervention_info.parameters).length; i$ < len$; ++i$) {
      parameter = ref$[i$];
      fix_intervention_parameter(parameter, intervention_info);
    }
    res$ = {};
    for (i$ = 0, len$ = (ref$ = intervention_info.parameters).length; i$ < len$; ++i$) {
      x = ref$[i$];
      res$[x.name] = x;
    }
    intervention_info.params = res$;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = intervention_info.content_scripts).length; i$ < len$; ++i$) {
      x = ref$[i$];
      res$.push(fix_content_script_options(x, intervention_name));
    }
    intervention_info.content_script_options = res$;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = intervention_info.background_scripts).length; i$ < len$; ++i$) {
      x = ref$[i$];
      res$.push(fix_background_script_options(x, intervention_name));
    }
    intervention_info.background_script_options = res$;
    intervention_info.match_functions = intervention_info.matches.map(function(x){
      var regex;
      if (x.includes('/') || x.includes('\\') || x.includes('*') || x.includes('?')) {
        regex = new RegExp(x);
        return function(str){
          return regex.test(str);
        };
      } else {
        return function(str){
          return url_to_domain(str).includes(x);
        };
      }
    });
    intervention_info.nomatch_functions = intervention_info.nomatches.map(function(x){
      var regex;
      if (x.includes('/') || x.includes('\\') || x.includes('*') || x.includes('?')) {
        regex = new RegExp(x);
        return function(str){
          return regex.test(str);
        };
      } else {
        return function(str){
          return url_to_domain(str).includes(x);
        };
      }
    });
    if (intervention_info.goals == null) {
      if (goals_satisfied_by_intervention != null) {
        intervention_info.goals = goals_satisfied_by_intervention;
      } else {
        intervention_info.goals = [];
      }
    }
    return intervention_info;
  };
  fix_intervention_name_to_intervention_info_dict = function(intervention_name_to_info, interventions_to_goals){
    var intervention_name, intervention_info, category_to_interventions, i$, ref$, len$, category, seen_conflicts, j$, ref1$, len1$, conflict;
    for (intervention_name in intervention_name_to_info) {
      intervention_info = intervention_name_to_info[intervention_name];
      fix_intervention_info(intervention_info, interventions_to_goals[intervention_name]);
    }
    category_to_interventions = {};
    for (intervention_name in intervention_name_to_info) {
      intervention_info = intervention_name_to_info[intervention_name];
      for (i$ = 0, len$ = (ref$ = intervention_info.categories).length; i$ < len$; ++i$) {
        category = ref$[i$];
        if (category_to_interventions[category] == null) {
          category_to_interventions[category] = [];
        }
        category_to_interventions[category].push(intervention_name);
      }
    }
    for (intervention_name in intervention_name_to_info) {
      intervention_info = intervention_name_to_info[intervention_name];
      seen_conflicts = {};
      for (i$ = 0, len$ = (ref$ = intervention_info.categories).length; i$ < len$; ++i$) {
        category = ref$[i$];
        for (j$ = 0, len1$ = (ref1$ = category_to_interventions[category]).length; j$ < len1$; ++j$) {
          conflict = ref1$[j$];
          if (conflict === intervention_name) {
            continue;
          }
          if (seen_conflicts[conflict]) {
            continue;
          }
          seen_conflicts[conflict] = true;
          intervention_info.conflicts.push(conflict);
        }
      }
    }
    return intervention_name_to_info;
  };
  /*
  export get_interventions = ->>
    #if local_cache_get_interventions?
      #return local_cache_get_interventions
    cached_get_interventions = localStorage.getItem 'cached_get_interventions'
    if cached_get_interventions?
      interventions_to_goals = await goal_utils.get_interventions_to_goals()
      intervention_name_to_info = JSON.parse cached_get_interventions
      fix_intervention_name_to_intervention_info_dict intervention_name_to_info, interventions_to_goals
      return intervention_name_to_info
      #return JSON.parse cached_get_interventions
      #local_cache_get_interventions := JSON.parse cached_get_interventions
      #return local_cache_get_interventions
    interventions_to_goals_promises = goal_utils.get_interventions_to_goals()
    interventions_list = await list_all_interventions()
    output = {}
    extra_get_interventions_text = localStorage.getItem 'extra_get_interventions'
    if extra_get_interventions_text?
      extra_get_interventions = JSON.parse extra_get_interventions_text
      for intervention_name,intervention_info of extra_get_interventions
        output[intervention_name] = intervention_info
    intervention_name_to_info_promises = {[intervention_name, getInterventionInfo(intervention_name)] for intervention_name in interventions_list when not output[intervention_name]?}
    [intervention_name_to_info, interventions_to_goals] = await Promise.all [intervention_name_to_info_promises, interventions_to_goals_promises]
    for intervention_name,intervention_info of intervention_name_to_info
      output[intervention_name] = intervention_info
    localStorage.setItem 'cached_get_interventions', JSON.stringify(output)
    fix_intervention_name_to_intervention_info_dict output, interventions_to_goals
    return output
  */
  get_interventions_per_goal = function(){
    var interventions_per_goal;
    if (localStorage.getItem('interventions_per_goal') != null) {
      return localStorage.getItem('interventions_per_goal');
    }
    interventions_per_goal = ['one', 'half_of_defaults', 'all_of_defaults'][Math.floor(Math.random() * 3)];
    localStorage.setItem('interventions_per_goal', interventions_per_goal);
    return interventions_per_goal;
  };
  get_intervention_choosing_strategy = function(){
    var intervention_choosing_strategy;
    if (localStorage.getItem('intervention_choosing_strategy') != null) {
      return localStorage.getItem('intervention_choosing_strategy');
    }
    intervention_choosing_strategy = 'random';
    localStorage.setItem('intervention_choosing_strategy', intervention_choosing_strategy);
    return intervention_choosing_strategy;
  };
  select_subset_of_available_interventions = function(intervention_info_list_all){
    var goal_to_intervention_info_list, i$, len$, intervention_info, goal_name, default_enabled_interventions, interventions_per_goal, intervention_info_list, available_default_interventions, num_interventions_chosen, chosen_interventions, intervention_name, intervention_choosing_strategy;
    goal_to_intervention_info_list = {};
    for (i$ = 0, len$ = intervention_info_list_all.length; i$ < len$; ++i$) {
      intervention_info = intervention_info_list_all[i$];
      if (intervention_info.goals == null) {
        continue;
      }
      goal_name = intervention_info.goals[0];
      if (goal_name == null) {
        continue;
      }
      if (goal_to_intervention_info_list[goal_name] == null) {
        goal_to_intervention_info_list[goal_name] = [];
      }
      goal_to_intervention_info_list[goal_name].push(intervention_info);
    }
    default_enabled_interventions = {};
    interventions_per_goal = get_interventions_per_goal();
    for (goal_name in goal_to_intervention_info_list) {
      intervention_info_list = goal_to_intervention_info_list[goal_name];
      available_default_interventions = [];
      for (i$ = 0, len$ = intervention_info_list.length; i$ < len$; ++i$) {
        intervention_info = intervention_info_list[i$];
        if (intervention_info.is_default) {
          available_default_interventions.push(intervention_info.name);
        }
      }
      available_default_interventions = shuffled(available_default_interventions);
      num_interventions_chosen = available_default_interventions.length;
      if (interventions_per_goal === 'half_of_defaults') {
        num_interventions_chosen = Math.round(available_default_interventions.length * 0.5);
      }
      if (interventions_per_goal === 'one') {
        num_interventions_chosen = 1;
      }
      chosen_interventions = available_default_interventions.slice(0, num_interventions_chosen);
      for (i$ = 0, len$ = chosen_interventions.length; i$ < len$; ++i$) {
        intervention_name = chosen_interventions[i$];
        default_enabled_interventions[intervention_name] = true;
      }
    }
    for (i$ = 0, len$ = intervention_info_list_all.length; i$ < len$; ++i$) {
      intervention_info = intervention_info_list_all[i$];
      if (default_enabled_interventions[intervention_info.name] == null) {
        default_enabled_interventions[intervention_info.name] = false;
      }
    }
    intervention_choosing_strategy = get_intervention_choosing_strategy();
    return [default_enabled_interventions, interventions_per_goal, intervention_choosing_strategy];
  };
  /**
   * Gets the intervention info for all interventions, in the form of an object mapping intervention names to intervention info
   * @return {Promise.<Object.<InterventionName, InterventionInfo>>} Object mapping intervention names to intervention info
   */
  out$.get_interventions = get_interventions = async function(){
    var cached_get_interventions, interventions_to_goals, intervention_name_to_info, interventions_list, output, intervention_info_list, default_enabled_interventions, cached_default_enabled_interventions, ref$, interventions_per_goal, intervention_choosing_strategy, i$, len$, intervention_info, extra_get_interventions_text, extra_get_interventions, intervention_name;
    cached_get_interventions = localStorage.getItem('cached_get_interventions');
    interventions_to_goals = (await goal_utils.get_interventions_to_goals());
    if (cached_get_interventions != null) {
      intervention_name_to_info = JSON.parse(cached_get_interventions);
      fix_intervention_name_to_intervention_info_dict(intervention_name_to_info, interventions_to_goals);
      return intervention_name_to_info;
    }
    interventions_list = (await list_all_interventions());
    output = {};
    intervention_info_list = (await goal_utils.get_goal_intervention_info()).interventions;
    default_enabled_interventions = {};
    cached_default_enabled_interventions = localStorage.getItem('default_interventions_on_install_cached');
    if (cached_default_enabled_interventions != null) {
      default_enabled_interventions = JSON.parse(cached_default_enabled_interventions);
    } else {
      ref$ = select_subset_of_available_interventions(intervention_info_list), default_enabled_interventions = ref$[0], interventions_per_goal = ref$[1], intervention_choosing_strategy = ref$[2];
      localStorage.setItem('default_interventions_on_install_cached', JSON.stringify(default_enabled_interventions));
      (await log_utils.add_log_interventions({
        type: 'default_interventions_on_install',
        interventions_per_goal: interventions_per_goal,
        intervention_choosing_strategy: intervention_choosing_strategy,
        enabled_interventions: default_enabled_interventions
      }));
    }
    for (i$ = 0, len$ = intervention_info_list.length; i$ < len$; ++i$) {
      intervention_info = intervention_info_list[i$];
      intervention_info.is_default = default_enabled_interventions[intervention_info.name] === true;
      output[intervention_info.name] = intervention_info;
    }
    extra_get_interventions_text = localStorage.getItem('extra_get_interventions');
    if (extra_get_interventions_text != null) {
      extra_get_interventions = JSON.parse(extra_get_interventions_text);
      for (intervention_name in extra_get_interventions) {
        intervention_info = extra_get_interventions[intervention_name];
        output[intervention_name] = intervention_info;
      }
    }
    localStorage.setItem('cached_get_interventions', JSON.stringify(output));
    fix_intervention_name_to_intervention_info_dict(output, interventions_to_goals);
    return output;
  };
  out$.clear_cache_get_interventions = clear_cache_get_interventions = function(){
    localStorage.removeItem('cached_get_interventions');
  };
  out$.list_enabled_interventions_for_location = list_enabled_interventions_for_location = async function(location){
    var available_interventions, enabled_interventions;
    available_interventions = (await list_available_interventions_for_location(location));
    enabled_interventions = (await get_enabled_interventions());
    return available_interventions.filter(function(x){
      return enabled_interventions[x];
    });
  };
  /*
  export list_all_enabled_interventions_for_location_with_override = (location) ->>
    # TODO this no longer works on new days. need to persist enabled interventions across days
    override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
    if override_enabled_interventions?
      #localStorage.removeItem('override_enabled_interventions_once')
      return as_array(JSON.parse(override_enabled_interventions))
    available_interventions = await list_available_interventions_for_location(location)
    enabled_interventions = await intervention_manager.get_most_recent_enabled_interventions()
    return available_interventions.filter((x) -> enabled_interventions[x])
  */
  out$.list_all_enabled_interventions_for_location = list_all_enabled_interventions_for_location = async function(location){
    var available_interventions, enabled_interventions;
    available_interventions = (await list_available_interventions_for_location(location));
    enabled_interventions = (await intervention_manager.get_currently_enabled_interventions());
    return available_interventions.filter(function(x){
      return enabled_interventions[x];
    });
  };
  out$.list_enabled_nonconflicting_interventions_for_location = list_enabled_nonconflicting_interventions_for_location = async function(location){
    var available_interventions, enabled_interventions, all_interventions, enabled_interventions_for_location, output, output_set, i$, len$, intervention_name, intervention_info, keep_enabled, j$, ref$, len1$, conflict;
    available_interventions = (await list_available_interventions_for_location(location));
    enabled_interventions = (await get_enabled_interventions_with_override_for_visit());
    all_interventions = (await get_interventions());
    enabled_interventions_for_location = available_interventions.filter(function(x){
      return enabled_interventions[x];
    });
    output = [];
    output_set = {};
    for (i$ = 0, len$ = enabled_interventions_for_location.length; i$ < len$; ++i$) {
      intervention_name = enabled_interventions_for_location[i$];
      intervention_info = all_interventions[intervention_name];
      keep_enabled = true;
      for (j$ = 0, len1$ = (ref$ = intervention_info.conflicts).length; j$ < len1$; ++j$) {
        conflict = ref$[j$];
        if (output_set[conflict] != null) {
          keep_enabled = false;
        }
      }
      if (keep_enabled) {
        output.push(intervention_name);
        output_set[intervention_name] = true;
      }
    }
    return output;
  };
  out$.list_available_interventions_for_location = list_available_interventions_for_location = async function(location){
    var all_interventions, possible_interventions, intervention_name, intervention_info, blacklisted, i$, ref$, len$, func, matches;
    all_interventions = (await get_interventions());
    possible_interventions = [];
    for (intervention_name in all_interventions) {
      intervention_info = all_interventions[intervention_name];
      blacklisted = false;
      for (i$ = 0, len$ = (ref$ = intervention_info.nomatch_functions).length; i$ < len$; ++i$) {
        func = ref$[i$];
        if (func(location)) {
          blacklisted = true;
          break;
        }
      }
      if (blacklisted) {
        continue;
      }
      matches = false;
      if (intervention_info.matches_all != null) {
        matches = true;
      } else {
        for (i$ = 0, len$ = (ref$ = intervention_info.match_functions).length; i$ < len$; ++i$) {
          func = ref$[i$];
          if (func(location)) {
            matches = true;
            break;
          }
        }
      }
      if (matches) {
        possible_interventions.push(intervention_name);
      }
    }
    return possible_interventions;
  };
  out$.get_manually_managed_interventions_localstorage = get_manually_managed_interventions_localstorage = async function(){
    var manually_managed_interventions_str, manually_managed_interventions;
    manually_managed_interventions_str = localStorage.getItem('manually_managed_interventions');
    if (manually_managed_interventions_str == null) {
      manually_managed_interventions = {};
    } else {
      manually_managed_interventions = JSON.parse(manually_managed_interventions_str);
    }
    return manually_managed_interventions;
  };
  out$.get_manually_managed_interventions = get_manually_managed_interventions = get_manually_managed_interventions_localstorage;
  /*
  export get_most_recent_manually_enabled_interventions = ->>
    enabled_interventions = await intervention_manager.get_most_recent_enabled_interventions()
    manually_managed_interventions = await get_manually_managed_interventions()
    output = {}
    for intervention_name,is_enabled of enabled_interventions
      output[intervention_name] = is_enabled and manually_managed_interventions[intervention_name]
    return output
  
  export get_most_recent_manually_disabled_interventions = ->>
    enabled_interventions = await intervention_manager.get_most_recent_enabled_interventions()
    manually_managed_interventions = await get_manually_managed_interventions()
    output = {}
    for intervention_name,is_enabled of enabled_interventions
      output[intervention_name] = (!is_enabled) and manually_managed_interventions[intervention_name]
    return output
  */
  out$.set_manually_managed_interventions = set_manually_managed_interventions = async function(manually_managed_interventions){
    localStorage.setItem('manually_managed_interventions', JSON.stringify(manually_managed_interventions));
  };
  out$.set_intervention_manually_managed = set_intervention_manually_managed = async function(intervention_name){
    var manually_managed_interventions;
    manually_managed_interventions = (await get_manually_managed_interventions());
    if (manually_managed_interventions[intervention_name]) {
      return;
    }
    manually_managed_interventions[intervention_name] = true;
    return (await set_manually_managed_interventions(manually_managed_interventions));
  };
  out$.set_intervention_automatically_managed = set_intervention_automatically_managed = async function(intervention_name){
    var manually_managed_interventions;
    manually_managed_interventions = (await get_manually_managed_interventions());
    if (!manually_managed_interventions[intervention_name]) {
      return;
    }
    manually_managed_interventions[intervention_name] = false;
    return (await set_manually_managed_interventions(manually_managed_interventions));
  };
  out$.list_available_interventions_for_enabled_goals = list_available_interventions_for_enabled_goals = async function(){
    var interventions_to_goals, enabled_goals, output, output_set, intervention_name, goal_names, i$, len$, goal_name;
    interventions_to_goals = (await goal_utils.get_interventions_to_goals());
    enabled_goals = (await goal_utils.get_enabled_goals());
    output = [];
    output_set = {};
    for (intervention_name in interventions_to_goals) {
      goal_names = interventions_to_goals[intervention_name];
      for (i$ = 0, len$ = goal_names.length; i$ < len$; ++i$) {
        goal_name = goal_names[i$];
        if (enabled_goals[goal_name] != null && output_set[intervention_name] == null) {
          output.push(intervention_name);
          output_set[intervention_name] = true;
        }
      }
    }
    return output;
  };
  out$.list_available_interventions_for_goal = list_available_interventions_for_goal = async function(goal_name){
    var goal_info;
    goal_info = (await goal_utils.get_goal_info(goal_name));
    if (goal_info.interventions != null) {
      return goal_info.interventions;
    } else {
      return [];
    }
  };
  out$.list_enabled_interventions_for_goal = list_enabled_interventions_for_goal = async function(goal_name){
    var enabled_interventions, available_interventions_for_goal;
    enabled_interventions = (await get_enabled_interventions());
    available_interventions_for_goal = (await list_available_interventions_for_goal(goal_name));
    return available_interventions_for_goal.filter(function(it){
      return enabled_interventions[it];
    });
  };
  cast_to_bool = function(parameter_value){
    if (typeof parameter_value !== 'string') {
      return Boolean(parameter_value);
    }
    if (parameter_value.toLowerCase() === 'false') {
      return false;
    }
    return true;
  };
  cast_to_type = function(parameter_value, type_name){
    if (type_name === 'string') {
      return parameter_value.toString();
    }
    if (type_name === 'int') {
      return parseInt(parameter_value);
    }
    if (type_name === 'float') {
      return parseFloat(parameter_value);
    }
    if (type_name === 'bool') {
      return cast_to_bool(parameter_value);
    }
    return parameter_value;
  };
  out$.set_intervention_parameter = set_intervention_parameter = async function(intervention_name, parameter_name, parameter_value){
    return (await setkey_dictdict('intervention_to_parameters', intervention_name, parameter_name, parameter_value));
  };
  get_intervention_parameter_type = async function(intervention_name, parameter_name){
    var interventions, intervention_info, parameter_type;
    interventions = (await get_interventions());
    intervention_info = interventions[intervention_name];
    parameter_type = intervention_info.params[parameter_name].type;
    return parameter_type;
  };
  out$.get_intervention_parameter_default = get_intervention_parameter_default = async function(intervention_name, parameter_name){
    var interventions, intervention_info, parameter_type, parameter_value;
    interventions = (await get_interventions());
    intervention_info = interventions[intervention_name];
    parameter_type = intervention_info.params[parameter_name].type;
    parameter_value = intervention_info.params[parameter_name]['default'];
    return cast_to_type(parameter_value, parameter_type);
  };
  out$.get_intervention_parameters_default = get_intervention_parameters_default = async function(intervention_name){
    var interventions, intervention_info, x;
    interventions = (await get_interventions());
    intervention_info = interventions[intervention_name];
    return (await (async function(){
      var i$, ref$, len$, resultObj$ = {};
      for (i$ = 0, len$ = (ref$ = intervention_info.parameters).length; i$ < len$; ++i$) {
        x = ref$[i$];
        resultObj$[x.name] = cast_to_type(x['default'], x.type);
      }
      return resultObj$;
    }()));
  };
  out$.get_intervention_parameter = get_intervention_parameter = async function(intervention_name, parameter_name){
    var result, parameter_type;
    result = (await getkey_dictdict('intervention_to_parameters', intervention_name, parameter_name));
    parameter_type = (await get_intervention_parameter_type(intervention_name, parameter_name));
    if (result != null) {
      return cast_to_type(result, parameter_type);
    }
    return (await get_intervention_parameter_default(intervention_name, parameter_name));
  };
  out$.get_intervention_parameters = get_intervention_parameters = async function(intervention_name){
    var results, default_parameters, interventions, intervention_info, output, k, v, parameter_value, ref$, parameter_type;
    results = (await getdict_for_key_dictdict('intervention_to_parameters', intervention_name));
    default_parameters = (await get_intervention_parameters_default(intervention_name));
    interventions = (await get_interventions());
    intervention_info = interventions[intervention_name];
    output = {};
    for (k in default_parameters) {
      v = default_parameters[k];
      parameter_value = (ref$ = results[k]) != null
        ? ref$
        : default_parameters[k];
      parameter_type = intervention_info.params[k].type;
      output[k] = cast_to_type(parameter_value, parameter_type);
    }
    return output;
  };
  out$.get_seconds_spent_on_domain_for_each_intervention = get_seconds_spent_on_domain_for_each_intervention = async function(domain){
    var session_id_to_interventions, session_id_to_seconds, intervention_to_session_lengths, session_id, interventions, intervention, seconds_spent, output, session_lengths;
    session_id_to_interventions = (await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain));
    session_id_to_seconds = (await getdict_for_key_dictdict('seconds_on_domain_per_session', domain));
    intervention_to_session_lengths = {};
    for (session_id in session_id_to_interventions) {
      interventions = session_id_to_interventions[session_id];
      interventions = JSON.parse(interventions);
      if (interventions.length !== 1) {
        continue;
      }
      intervention = interventions[0];
      seconds_spent = session_id_to_seconds[session_id];
      if (seconds_spent == null) {
        continue;
      }
      if (intervention_to_session_lengths[intervention] == null) {
        intervention_to_session_lengths[intervention] = [];
      }
      intervention_to_session_lengths[intervention].push(seconds_spent);
    }
    output = {};
    for (intervention in intervention_to_session_lengths) {
      session_lengths = intervention_to_session_lengths[intervention];
      output[intervention] = median(session_lengths);
    }
    return output;
  };
  out$.get_seconds_saved_per_session_for_each_intervention_for_goal = get_seconds_saved_per_session_for_each_intervention_for_goal = async function(goal_name){
    var goal_info, output, domain, intervention_names, intervention_to_seconds_per_session, baseline_session_time, i$, len$, intervention, seconds_per_session, time_saved;
    goal_info = (await goal_utils.get_goal_info(goal_name));
    output = {};
    if (goal_info.interventions == null) {
      return output;
    }
    domain = goal_info.domain;
    intervention_names = goal_info.interventions;
    intervention_to_seconds_per_session = (await get_seconds_spent_on_domain_for_each_intervention(domain));
    baseline_session_time = (await get_baseline_session_time_on_domain(domain));
    for (i$ = 0, len$ = intervention_names.length; i$ < len$; ++i$) {
      intervention = intervention_names[i$];
      seconds_per_session = intervention_to_seconds_per_session[intervention];
      if (seconds_per_session == null) {
        output[intervention] = NaN;
        continue;
      }
      time_saved = baseline_session_time - seconds_per_session;
      output[intervention] = time_saved;
    }
    return output;
  };
  out$.get_seconds_spent_per_session_for_each_intervention_for_goal = get_seconds_spent_per_session_for_each_intervention_for_goal = async function(goal_name){
    var goal_info, domain, intervention_names, session_id_to_interventions, session_id_to_seconds, intervention_to_seconds_per_session, baseline_session_time, output, i$, len$, intervention, seconds_per_session;
    goal_info = (await goal_utils.get_goal_info(goal_name));
    domain = goal_info.domain;
    intervention_names = goal_info.interventions;
    session_id_to_interventions = (await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain));
    session_id_to_seconds = (await getdict_for_key_dictdict('seconds_on_domain_per_session', domain));
    intervention_to_seconds_per_session = (await get_seconds_spent_on_domain_for_each_intervention(domain));
    baseline_session_time = (await get_baseline_session_time_on_domain(domain));
    output = {};
    for (i$ = 0, len$ = intervention_names.length; i$ < len$; ++i$) {
      intervention = intervention_names[i$];
      seconds_per_session = intervention_to_seconds_per_session[intervention];
      if (seconds_per_session == null) {
        output[intervention] = NaN;
        continue;
      }
      output[intervention] = seconds_per_session;
    }
    return output;
  };
  /*
  # only kept for legacy compatibility purposes, will be removed, do not use
  # replacement: get_seconds_saved_per_session_for_each_intervention_for_goal
  export get_effectiveness_of_all_interventions_for_goal = (goal_name) ->>
    goal_info = await goal_utils.get_goal_info(goal_name)
    domain = goal_info.domain
    intervention_names = goal_info.interventions
    session_id_to_interventions = await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
    session_id_to_seconds = await getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
    intervention_to_seconds_per_session = await get_seconds_spent_on_domain_for_each_intervention(domain)
    output = {}
    for intervention,seconds_per_session of intervention_to_seconds_per_session
      minutes_per_session = seconds_per_session / 60
      output[intervention] = {
        progress: minutes_per_session
        units: 'minutes'
        message: "#{minutes_per_session} minutes"
      }
    for intervention in intervention_names
      if not output[intervention]?
        output[intervention] = {
          progress: NaN
          units: 'minutes'
          message: 'no data'
        }
    return output
  */
  out$.get_goals_and_interventions = get_goals_and_interventions = async function(){
    var intervention_name_to_info, enabled_interventions, enabled_goals, all_goals, all_goals_list, manually_managed_interventions, goal_to_interventions, intervention_name, intervention_info, i$, ref$, len$, goalname, list_of_goals_and_interventions, list_of_goals, current_item, j$, len1$, intervention, this$ = this;
    intervention_name_to_info = (await get_interventions());
    enabled_interventions = (await get_enabled_interventions());
    enabled_goals = (await goal_utils.get_enabled_goals());
    all_goals = (await goal_utils.get_goals());
    all_goals_list = (await goal_utils.list_all_goals());
    manually_managed_interventions = (await get_manually_managed_interventions());
    goal_to_interventions = {};
    for (intervention_name in intervention_name_to_info) {
      intervention_info = intervention_name_to_info[intervention_name];
      for (i$ = 0, len$ = (ref$ = intervention_info.goals).length; i$ < len$; ++i$) {
        goalname = ref$[i$];
        if (goal_to_interventions[goalname] == null) {
          goal_to_interventions[goalname] = [];
        }
        goal_to_interventions[goalname].push(intervention_info);
      }
    }
    list_of_goals_and_interventions = [];
    list_of_goals = prelude.sort(as_array(all_goals_list));
    for (i$ = 0, len$ = list_of_goals.length; i$ < len$; ++i$) {
      goalname = list_of_goals[i$];
      current_item = {
        goal: all_goals[goalname]
      };
      current_item.enabled = enabled_goals[goalname] === true;
      if (goal_to_interventions[goalname] == null) {
        current_item.interventions = [];
      } else {
        current_item.interventions = prelude.sortBy(fn$, goal_to_interventions[goalname]);
      }
      for (j$ = 0, len1$ = (ref$ = current_item.interventions).length; j$ < len1$; ++j$) {
        intervention = ref$[j$];
        intervention.enabled_goals = [];
        intervention.enabled = enabled_interventions[intervention.name] === true;
        intervention.automatic = manually_managed_interventions[intervention.name] !== true;
      }
      list_of_goals_and_interventions.push(current_item);
    }
    return list_of_goals_and_interventions;
    function fn$(it){
      return it.name;
    }
  };
  /*
  export get_goals_and_interventions = ->>
    intervention_name_to_info = await get_interventions()
    enabled_interventions = await get_enabled_interventions()
    enabled_goals = await goal_utils.get_enabled_goals()
    all_goals = await goal_utils.get_goals()
    manually_managed_interventions = await get_manually_managed_interventions()
    goal_to_interventions = {}
    for intervention_name,intervention_info of intervention_name_to_info
      for goal in intervention_info.goals
        goalname = goal.name
        if not goal_to_interventions[goalname]?
          goal_to_interventions[goalname] = []
        goal_to_interventions[goalname].push intervention_info
    list_of_goals_and_interventions = []
    list_of_goals = prelude.sort as_array(enabled_goals)
    for goalname in list_of_goals
      current_item = {goal: all_goals[goalname]}
      current_item.interventions = prelude.sort-by (.name), goal_to_interventions[goalname]
      for intervention in current_item.interventions
        intervention.enabled_goals = []
        #if intervention.goals?
        #  intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
        intervention.enabled = (enabled_interventions[intervention.name] == true)
        intervention.automatic = (manually_managed_interventions[intervention.name] != true)
      list_of_goals_and_interventions.push current_item
    return list_of_goals_and_interventions
  */
  intervention_manager = require('libs_backend/intervention_manager');
  goal_utils = require('libs_backend/goal_utils');
  log_utils = require('libs_backend/log_utils');
  gexport_module('intervention_utils', function(it){
    return eval(it);
  });
}).call(this);
