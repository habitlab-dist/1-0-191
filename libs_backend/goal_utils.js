(function(){
  var memoizeSingleAsync, ref$, gexport, gexport_module, getkey_dict, setkey_dict, getdict, url_to_domain, as_array, remove_key_from_localstorage_dict, remove_item_from_localstorage_list, unique_concat, localget_json, remove_cached_favicon_for_domain, getAllInterventionsGoalInfo, get_num_enabled_goals, list_enabled_goals, default_goals_list, get_enabled_goals, set_enabled_goals, set_goal_enabled_manual, set_goals_enabled, set_default_goals_enabled, set_goal_enabled, set_goal_disabled_manual, set_goals_disabled, set_goal_disabled, is_goal_enabled, site_has_enabled_spend_less_time_goal, get_goal_intervention_info, list_all_goals, clear_cache_list_all_goals, get_site_to_goals_sync, get_site_to_goals, list_goals_for_site, list_sites_for_which_goals_are_enabled, list_site_info_for_sites_for_which_goals_are_enabled, get_goal_info, get_goals, get_positive_enabled_goals, get_positive_enabled_uncompleted_goals, get_random_positive_goal, get_random_uncompleted_positive_goal, get_random_value_from_object, get_spend_more_time_goals, clear_cache_get_goals, clear_cache_all_goals, add_custom_goal_info, add_custom_goal_reduce_time_on_domain, get_goal_statement, add_custom_goal_involving_time_on_domain, add_enable_custom_goal_reduce_time_on_domain, add_enable_custom_goal_increase_time_on_domain, disable_all_custom_goals, remove_all_custom_goals_and_interventions, remove_all_custom_goals, remove_custom_goal_and_generated_interventions, get_interventions_to_goals, get_goals_for_intervention, get_goal_target, set_goal_target, get_all_goal_targets, list_goal_info_for_enabled_goals, intervention_utils, log_utils, goal_progress, out$ = typeof exports != 'undefined' && exports || this;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  ref$ = require('libs_backend/db_utils'), getkey_dict = ref$.getkey_dict, setkey_dict = ref$.setkey_dict, getdict = ref$.getdict;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  ref$ = require('libs_common/collection_utils'), as_array = ref$.as_array, remove_key_from_localstorage_dict = ref$.remove_key_from_localstorage_dict, remove_item_from_localstorage_list = ref$.remove_item_from_localstorage_list;
  unique_concat = require('libs_common/array_utils').unique_concat;
  localget_json = require('libs_common/cacheget_utils').localget_json;
  remove_cached_favicon_for_domain = require('libs_backend/favicon_utils').remove_cached_favicon_for_domain;
  getAllInterventionsGoalInfo = async function(){
    var goal_info, all_interventions;
    goal_info = {
      name: 'debug/all_interventions',
      sitename: 'debug',
      description: 'This goal is satisfied by all interventions',
      measurement: 'always_zero_progress'
    };
    all_interventions = (await intervention_utils.list_all_interventions());
    goal_info.interventions = all_interventions;
    return goal_info;
  };
  /*
  cached_get_goal_info_unmodified = {}
  
  export getGoalInfo = (goal_name) ->>
    if goal_name == 'debug/all_interventions'
      return await getAllInterventionsGoalInfo()
    cached_goal_info = cached_get_goal_info_unmodified[goal_name]
    if cached_goal_info?
      return cached_goal_info
    goal_info = await localget_json("/goals/#{goal_name}/info.json")
    goal_info.name = goal_name
    if not goal_info.sitename?
      goal_info.sitename = goal_name.split('/')[0]
    if not goal_info.sitename_printable?
      goal_info.sitename_printable = goal_info.sitename.substr(0, 1).toUpperCase() + goal_info.sitename.substr(1)
    if not goal_info.homepage?
      goal_info.homepage = "https://www.#{goal_info.sitename}.com/"
    cached_get_goal_info_unmodified[goal_name] = goal_info
    return goal_info
  */
  out$.get_num_enabled_goals = get_num_enabled_goals = async function(){
    var enabled_goals;
    enabled_goals = (await get_enabled_goals());
    return as_array(enabled_goals).length;
  };
  /**
   * Returns a list of names of enabled goals
   * @return {Promise.<Array.<GoalName>>} List of enabled goal names
   */
  out$.list_enabled_goals = list_enabled_goals = async function(){
    var enabled_goals;
    enabled_goals = (await get_enabled_goals());
    return as_array(enabled_goals);
  };
  default_goals_list = ['facebook/spend_less_time', 'youtube/spend_less_time'];
  /**
   * Returns a object with with names of enabled goals as keys, and whether they are enabled as values
   * @return {Promise.<Object.<GoalName, boolean>>} Object with enabled goals as keys
   */
  out$.get_enabled_goals = get_enabled_goals = async function(){
    var all_goals, enabled_goals_str, enabled_goals, i$, ref$, len$, default_goal_name, k, v;
    all_goals = (await get_goals());
    enabled_goals_str = localStorage.getItem('enabled_goals');
    enabled_goals = {};
    if (enabled_goals_str == null) {
      for (i$ = 0, len$ = (ref$ = default_goals_list).length; i$ < len$; ++i$) {
        default_goal_name = ref$[i$];
        if (all_goals[default_goal_name] == null) {
          continue;
        }
        enabled_goals[default_goal_name] = true;
      }
    } else {
      for (k in ref$ = JSON.parse(enabled_goals_str)) {
        v = ref$[k];
        if (all_goals[k] == null) {
          continue;
        }
        enabled_goals[k] = v;
      }
      if (enabled_goals['debug/all_interventions']) {
        if (localStorage.getItem('intervention_view_show_debug_all_interventions_goal') !== 'true') {
          delete enabled_goals['debug/all_interventions'];
          localStorage.setItem('enabled_goals', JSON.stringify(enabled_goals));
        }
      }
    }
    return enabled_goals;
  };
  out$.set_enabled_goals = set_enabled_goals = async function(enabled_goals){
    localStorage.setItem('enabled_goals', JSON.stringify(enabled_goals));
  };
  out$.set_goal_enabled_manual = set_goal_enabled_manual = async function(goal_name){
    var enabled_goals, prev_enabled_goals;
    enabled_goals = (await get_enabled_goals());
    prev_enabled_goals = import$({}, enabled_goals);
    if (enabled_goals[goal_name] != null) {
      return;
    }
    enabled_goals[goal_name] = true;
    (await set_enabled_goals(enabled_goals));
    return log_utils.add_log_goals({
      type: 'goal_enabled',
      manual: true,
      goal_name: goal_name,
      prev_enabled_goals: prev_enabled_goals,
      enabled_goals: enabled_goals
    });
  };
  out$.set_goals_enabled = set_goals_enabled = async function(goal_list){
    var enabled_goals, prev_enabled_goals, i$, len$, goal_name;
    enabled_goals = (await get_enabled_goals());
    prev_enabled_goals = import$({}, enabled_goals);
    for (i$ = 0, len$ = goal_list.length; i$ < len$; ++i$) {
      goal_name = goal_list[i$];
      if (enabled_goals[goal_name] != null) {
        continue;
      }
      enabled_goals[goal_name] = true;
    }
    (await set_enabled_goals(enabled_goals));
    return log_utils.add_log_goals({
      type: 'goals_enabled',
      manual: false,
      goal_list: goal_list,
      prev_enabled_goals: prev_enabled_goals
    });
  };
  out$.set_default_goals_enabled = set_default_goals_enabled = async function(){
    return (await set_goals_enabled(default_goals_list));
  };
  out$.set_goal_enabled = set_goal_enabled = async function(goal_name){
    var enabled_goals, prev_enabled_goals;
    enabled_goals = (await get_enabled_goals());
    prev_enabled_goals = import$({}, enabled_goals);
    if (enabled_goals[goal_name] != null) {
      return;
    }
    enabled_goals[goal_name] = true;
    (await set_enabled_goals(enabled_goals));
    return log_utils.add_log_goals({
      type: 'goal_enabled',
      manual: false,
      goal_name: goal_name,
      prev_enabled_goals: prev_enabled_goals
    });
  };
  out$.set_goal_disabled_manual = set_goal_disabled_manual = async function(goal_name){
    var enabled_goals, prev_enabled_goals;
    enabled_goals = (await get_enabled_goals());
    prev_enabled_goals = import$({}, enabled_goals);
    if (enabled_goals[goal_name] == null) {
      return;
    }
    delete enabled_goals[goal_name];
    (await set_enabled_goals(enabled_goals));
    return log_utils.add_log_goals({
      type: 'goal_disabled',
      manual: false,
      goal_name: goal_name,
      prev_enabled_goals: prev_enabled_goals
    });
  };
  out$.set_goals_disabled = set_goals_disabled = async function(goal_list){
    var enabled_goals, prev_enabled_goals, i$, len$, goal_name;
    enabled_goals = (await get_enabled_goals());
    prev_enabled_goals = import$({}, enabled_goals);
    for (i$ = 0, len$ = goal_list.length; i$ < len$; ++i$) {
      goal_name = goal_list[i$];
      if (enabled_goals[goal_name] == null) {
        continue;
      }
      delete enabled_goals[goal_name];
    }
    (await set_enabled_goals(enabled_goals));
    return log_utils.add_log_goals({
      type: 'goals_disabled',
      manual: false,
      goal_list: goal_list,
      prev_enabled_goals: prev_enabled_goals
    });
  };
  out$.set_goal_disabled = set_goal_disabled = async function(goal_name){
    var enabled_goals, prev_enabled_goals;
    enabled_goals = (await get_enabled_goals());
    prev_enabled_goals = import$({}, enabled_goals);
    if (enabled_goals[goal_name] == null) {
      return;
    }
    delete enabled_goals[goal_name];
    (await set_enabled_goals(enabled_goals));
    return log_utils.add_log_goals({
      type: 'goal_disabled',
      manual: false,
      goal_name: goal_name,
      prev_enabled_goals: prev_enabled_goals
    });
  };
  out$.is_goal_enabled = is_goal_enabled = async function(goal_name){
    var enabled_goals;
    enabled_goals = (await get_enabled_goals());
    return enabled_goals[goal_name] != null;
  };
  out$.site_has_enabled_spend_less_time_goal = site_has_enabled_spend_less_time_goal = async function(domain){
    var goals, goal_name, goal_info;
    goals = (await get_goals());
    for (goal_name in goals) {
      goal_info = goals[goal_name];
      if (domain === goal_info.domain && !goal_info.is_positive) {
        return (await is_goal_enabled(goal_name));
      }
    }
    return false;
  };
  out$.get_goal_intervention_info = get_goal_intervention_info = memoizeSingleAsync(async function(){
    return (await localget_json('/goal_intervention_info.json'));
  });
  /**
   * Lists names of all available goals
   * @return {Promise.<Array.<GoalName>>} List of goal names.
   */
  out$.list_all_goals = list_all_goals = async function(){
    var cached_list_all_goals, goals_list, extra_list_all_goals_text, extra_list_all_goals, this$ = this;
    cached_list_all_goals = localStorage.getItem('cached_list_all_goals');
    if (cached_list_all_goals != null) {
      return JSON.parse(cached_list_all_goals);
    }
    goals_list = (await get_goal_intervention_info()).goals.map(function(it){
      return it.name;
    });
    extra_list_all_goals_text = localStorage.getItem('extra_list_all_goals');
    if (extra_list_all_goals_text != null) {
      extra_list_all_goals = JSON.parse(extra_list_all_goals_text);
      goals_list = unique_concat(goals_list, extra_list_all_goals);
    }
    localStorage.setItem('cached_list_all_goals', JSON.stringify(goals_list));
    return goals_list;
  };
  out$.clear_cache_list_all_goals = clear_cache_list_all_goals = function(){
    localStorage.removeItem('cached_list_all_goals');
  };
  get_site_to_goals_sync = function(goals){
    var output, goal_name, goal_info, sitename;
    output = {};
    for (goal_name in goals) {
      goal_info = goals[goal_name];
      sitename = goal_info.sitename;
      if (output[sitename] == null) {
        output[sitename] = [];
      }
      output[sitename].push(goal_info);
    }
    return output;
  };
  get_site_to_goals = async function(){
    var goals;
    goals = (await get_goals());
    return get_site_to_goals_sync(goals);
  };
  out$.list_goals_for_site = list_goals_for_site = async function(sitename){
    var site_to_goals;
    site_to_goals = (await get_site_to_goals());
    return site_to_goals[sitename];
  };
  out$.list_sites_for_which_goals_are_enabled = list_sites_for_which_goals_are_enabled = async function(){
    var goals, enabled_goals, output, output_set, goal_name, goal_info, sitename;
    goals = (await get_goals());
    enabled_goals = (await get_enabled_goals());
    output = [];
    output_set = {};
    for (goal_name in goals) {
      goal_info = goals[goal_name];
      sitename = goal_info.sitename;
      if (enabled_goals[goal_name] != null && output_set[sitename] == null) {
        output.push(sitename);
        output_set[sitename] = true;
      }
    }
    return output;
  };
  out$.list_site_info_for_sites_for_which_goals_are_enabled = list_site_info_for_sites_for_which_goals_are_enabled = async function(){
    var goals, enabled_goals, site_to_goals, output, output_set, goal_name, goal_info, sitename, this$ = this;
    goals = (await get_goals());
    enabled_goals = (await get_enabled_goals());
    site_to_goals = get_site_to_goals_sync(goals);
    output = [];
    output_set = {};
    for (goal_name in goals) {
      goal_info = goals[goal_name];
      sitename = goal_info.sitename;
      if (enabled_goals[goal_name] != null && output_set[sitename] == null) {
        output.push({
          sitename: sitename,
          sitename_printable: goal_info.sitename_printable,
          goals: site_to_goals[sitename],
          goal_names: site_to_goals[sitename].map(fn$)
        });
        output_set[sitename] = true;
      }
    }
    return output;
    function fn$(it){
      return it.name;
    }
  };
  /**
   * Gets the goal info for the specified goal name
   * @param {GoalName} goal_name - The name of the goal
   * @return {Promise.<GoalInfo>} The goal info
   */
  out$.get_goal_info = get_goal_info = async function(goal_name){
    var goals;
    goals = (await get_goals());
    return goals[goal_name];
  };
  /*
  export get_goals = ->>
    #if local_cached_get_goals?
    #  return local_cached_get_goals
    cached_get_goals = localStorage.getItem 'cached_get_goals'
    if cached_get_goals?
      return JSON.parse cached_get_goals
      #local_cached_get_goals := JSON.parse cached_get_goals
      #return local_cached_get_goals
    goals_list = await list_all_goals()
    output = {}
    extra_get_goals_text = localStorage.getItem 'extra_get_goals'
    if extra_get_goals_text?
      extra_get_goals = JSON.parse extra_get_goals_text
      for k,v of extra_get_goals
        output[k] = v
    goal_name_to_info_promises = {[goal_name, getGoalInfo(goal_name)] for goal_name in goals_list when not output[goal_name]?}
    goal_info_dict = await goal_name_to_info_promises
    for k,v of goal_info_dict
      output[k] = v
    localStorage.setItem 'cached_get_goals', JSON.stringify(output)
    #local_cached_get_goals := output
    return output
  */
  /**
   * Gets the goal info for all goals, in the form of an object mapping goal names to goal info
   * @return {Promise.<Object.<GoalName, GoalInfo>>} Object mapping goal names to goal info
   */
  out$.get_goals = get_goals = async function(){
    var cached_get_goals, output, goal_name, goal_info, goal_info_list, i$, len$, extra_get_goals_text, extra_get_goals, k, v, extra_get_interventions_text, goal_name_to_intervention_name_set, extra_get_interventions, intervention_name, intervention_info, ref$, intervention_name_set, res$, j$, ref1$, len1$, existing_intervention_name;
    cached_get_goals = localStorage.getItem('cached_get_goals');
    if (cached_get_goals != null) {
      output = JSON.parse(cached_get_goals);
      for (goal_name in output) {
        goal_info = output[goal_name];
        if (goal_info.icon === 'icon.png' || goal_info.icon === 'icon.svg' || goal_info.icon === 'icon.jpg') {
          goal_info.icon = chrome.runtime.getURL('goals/' + goal_name + '/' + goal_info.icon);
        }
      }
      return output;
    }
    goal_info_list = JSON.parse(JSON.stringify((await get_goal_intervention_info()).goals));
    output = {};
    for (i$ = 0, len$ = goal_info_list.length; i$ < len$; ++i$) {
      goal_info = goal_info_list[i$];
      output[goal_info.name] = goal_info;
    }
    extra_get_goals_text = localStorage.getItem('extra_get_goals');
    if (extra_get_goals_text != null) {
      extra_get_goals = JSON.parse(extra_get_goals_text);
      for (k in extra_get_goals) {
        v = extra_get_goals[k];
        output[k] = v;
      }
    }
    extra_get_interventions_text = localStorage.getItem('extra_get_interventions');
    goal_name_to_intervention_name_set = {};
    if (extra_get_interventions_text != null) {
      extra_get_interventions = JSON.parse(extra_get_interventions_text);
      for (intervention_name in extra_get_interventions) {
        intervention_info = extra_get_interventions[intervention_name];
        if (!intervention_info.custom) {
          continue;
        }
        for (i$ = 0, len$ = (ref$ = intervention_info.goals).length; i$ < len$; ++i$) {
          goal_name = ref$[i$];
          goal_info = output[goal_name];
          if (goal_info == null) {
            continue;
          }
          intervention_name_set = goal_name_to_intervention_name_set[goal_name];
          if (intervention_name_set == null) {
            res$ = {};
            for (j$ = 0, len1$ = (ref1$ = goal_info.interventions).length; j$ < len1$; ++j$) {
              existing_intervention_name = ref1$[j$];
              res$[existing_intervention_name] = true;
            }
            intervention_name_set = res$;
            goal_name_to_intervention_name_set[goal_name] = intervention_name_set;
          }
          if (intervention_name_set[intervention_name]) {
            continue;
          }
          intervention_name_set[intervention_name] = true;
          goal_info.interventions.push(intervention_name);
        }
      }
    }
    localStorage.setItem('cached_get_goals', JSON.stringify(output));
    for (goal_name in output) {
      goal_info = output[goal_name];
      if (goal_info.icon === 'icon.png' || goal_info.icon === 'icon.svg' || goal_info.icon === 'icon.jpg') {
        goal_info.icon = chrome.runtime.getURL('goals/' + goal_name + '/' + goal_info.icon);
      }
    }
    return output;
  };
  /**
   * Gets the goal info for all goals where is_positive set to true, in the form of an object mapping goal names to goal info
   * @return {Promise.<Object.<GoalName, GoalInfo>>} Object mapping goal names to goal info
   */
  out$.get_positive_enabled_goals = get_positive_enabled_goals = async function(){
    var goalToInfoMap, enabled_goals, output, goal, goal_info;
    goalToInfoMap = (await get_goals());
    enabled_goals = (await get_enabled_goals());
    output = {};
    for (goal in goalToInfoMap) {
      goal_info = goalToInfoMap[goal];
      if (enabled_goals[goal] && goal_info.is_positive) {
        output[goal] = goal_info;
      }
    }
    return output;
  };
  /**
   * Gets the goal info for all goals where is_positive set to true and that have not yet been completed
   * @return {Promise.<Object.<GoalName, GoalInfo>>} Object mapping goal names to goal info
   */
  out$.get_positive_enabled_uncompleted_goals = get_positive_enabled_uncompleted_goals = async function(){
    var goals, output, completed_promises_list, goal_list, i$, len$, goal_name, completed_list, idx, completed, goal_info;
    goals = (await get_positive_enabled_goals());
    output = {};
    completed_promises_list = [];
    goal_list = Object.keys(goals);
    for (i$ = 0, len$ = goal_list.length; i$ < len$; ++i$) {
      goal_name = goal_list[i$];
      completed_promises_list.push(goal_progress.get_whether_goal_achieved_today(goal_name));
    }
    completed_list = (await Promise.all(completed_promises_list));
    for (i$ = 0, len$ = goal_list.length; i$ < len$; ++i$) {
      idx = i$;
      goal_name = goal_list[i$];
      completed = completed_list[idx];
      goal_info = goals[goal_name];
      if (!completed) {
        output[goal_name] = goal_info;
      }
    }
    return output;
  };
  /**
   * Gets the goal info for a random enabled positive goal
   * @return {GoalInfo} The goal info
   */
  out$.get_random_positive_goal = get_random_positive_goal = async function(){
    var goalNameToGoalInfo;
    goalNameToGoalInfo = (await get_positive_enabled_goals());
    return get_random_value_from_object(goalNameToGoalInfo);
  };
  /**
   * Gets the goal info for a random enabled uncompleted positive goal
   * @return {GoalInfo} The goal info
   */
  out$.get_random_uncompleted_positive_goal = get_random_uncompleted_positive_goal = async function(){
    var goalNameToGoalInfo;
    goalNameToGoalInfo = (await get_positive_enabled_uncompleted_goals());
    console.log(goalNameToGoalInfo);
    return get_random_value_from_object(goalNameToGoalInfo);
  };
  get_random_value_from_object = function(obj){
    var keyList, randIndex, key;
    keyList = Object.keys(obj);
    if (keyList.length === 0) {
      return null;
    }
    randIndex = Math.floor(Math.random() * keyList.length);
    key = keyList[randIndex];
    return obj[key];
  };
  /* TODO: Consolidate with get_positive_enabled_goals */
  out$.get_spend_more_time_goals = get_spend_more_time_goals = async function(){
    var goals, spendMoreTimeGoals, goal, goalInfo;
    goals = (await get_goals());
    spendMoreTimeGoals = {};
    for (goal in goals) {
      goalInfo = goals[goal];
      if (goalInfo.is_positive) {
        spendMoreTimeGoals[goal] = goalInfo;
      }
    }
    return spendMoreTimeGoals;
  };
  out$.clear_cache_get_goals = clear_cache_get_goals = function(){
    localStorage.removeItem('cached_get_goals');
  };
  out$.clear_cache_all_goals = clear_cache_all_goals = function(){
    clear_cache_get_goals();
    clear_cache_list_all_goals();
  };
  out$.add_custom_goal_info = add_custom_goal_info = async function(goal_info){
    var extra_get_goals_text, extra_get_goals, extra_list_all_goals_text, extra_list_all_goals;
    extra_get_goals_text = localStorage.getItem('extra_get_goals');
    if (extra_get_goals_text != null) {
      extra_get_goals = JSON.parse(extra_get_goals_text);
    } else {
      extra_get_goals = {};
    }
    extra_list_all_goals_text = localStorage.getItem('extra_list_all_goals');
    if (extra_list_all_goals_text != null) {
      extra_list_all_goals = JSON.parse(extra_list_all_goals_text);
    } else {
      extra_list_all_goals = [];
    }
    extra_list_all_goals = unique_concat(extra_list_all_goals, [goal_info.name]);
    extra_get_goals[goal_info.name] = goal_info;
    clear_cache_all_goals();
    localStorage.setItem('extra_list_all_goals', JSON.stringify(extra_list_all_goals));
    localStorage.setItem('extra_get_goals', JSON.stringify(extra_get_goals));
    (await list_all_goals());
    (await get_goals());
  };
  out$.add_custom_goal_reduce_time_on_domain = add_custom_goal_reduce_time_on_domain = async function(domain){
    (await add_custom_goal_involving_time_on_domain(domain, false));
  };
  out$.get_goal_statement = get_goal_statement = async function(goal_info){
    var ad_lib, target, unit;
    if (goal_info.goal_statement_to_fill_in != null) {
      ad_lib = goal_info.goal_statement_to_fill_in;
      target = (await get_goal_target(goal_info.name));
      ad_lib = ad_lib.replace("TARGET", target);
      unit = goal_info.target.units;
      if (goal_info.goal_statement_units != null) {
        unit = goal_info.goal_statement_units;
      }
      if (target === 1) {
        unit = unit.substring(0, unit.length - 1);
      }
      return ad_lib.replace("UNITS", unit);
    } else {
      return goal_info.description;
    }
  };
  out$.add_custom_goal_involving_time_on_domain = add_custom_goal_involving_time_on_domain = async function(domain, isPositive){
    var domain_printable, custom_goal_name, description, goal_statement_to_fill_in, call_to_action, generic_positive_interventions, fix_names_generic_positive, generated_interventions, default_interventions, target_default, generic_interventions, fix_names_generic, fix_names_video, video_interventions, goal_info;
    domain_printable = domain;
    if (domain_printable.startsWith('www.')) {
      domain_printable = domain_printable.substr(4);
    }
    if (isPositive) {
      custom_goal_name = "custom/spend_more_time_" + domain;
      description = "Spend more time on " + domain_printable;
      goal_statement_to_fill_in = "Spend at least TARGET UNITS on " + domain_printable + " each day";
      call_to_action = "Go to " + domain_printable;
      generic_positive_interventions = (await intervention_utils.list_generic_positive_interventions());
      fix_names_generic_positive = function(x){
        return x.replace('generic_positive/', "generated_" + domain + "/");
      };
      generated_interventions = generic_positive_interventions.map(fix_names_generic_positive);
      default_interventions = (await intervention_utils.list_enabled_generic_positive_interventions());
      default_interventions = default_interventions.map(fix_names_generic_positive);
      target_default = 5;
    } else {
      custom_goal_name = "custom/spend_less_time_" + domain;
      description = "Spend less time on " + domain_printable;
      goal_statement_to_fill_in = "Spend less than TARGET UNITS on " + domain_printable + " each day";
      call_to_action = "Close " + domain_printable;
      generic_interventions = (await intervention_utils.list_generic_interventions());
      fix_names_generic = function(x){
        return x.replace('generic/', "generated_" + domain + "/");
      };
      fix_names_video = function(x){
        return x.replace('video/', "generated_" + domain + "/");
      };
      generated_interventions = generic_interventions.map(fix_names_generic);
      default_interventions = (await intervention_utils.list_enabled_generic_interventions());
      default_interventions = default_interventions.map(fix_names_generic);
      if (intervention_utils.is_video_domain(domain)) {
        video_interventions = (await intervention_utils.list_video_interventions());
        generated_interventions = generated_interventions.concat(video_interventions.map(fix_names_video));
      }
      target_default = 20;
    }
    goal_info = {
      name: custom_goal_name,
      custom: true,
      description: description,
      call_to_action: call_to_action,
      homepage: "http://" + domain + "/",
      progress_description: "Time spent on " + domain_printable,
      sitename: domain,
      sitename_printable: domain_printable,
      default_interventions: default_interventions,
      interventions: generated_interventions,
      measurement: 'time_spent_on_domain',
      domain: domain,
      is_positive: isPositive,
      target: {
        'default': target_default,
        units: 'minutes'
      }
    };
    (await add_custom_goal_info(goal_info));
  };
  out$.add_enable_custom_goal_reduce_time_on_domain = add_enable_custom_goal_reduce_time_on_domain = async function(domain){
    (await add_custom_goal_reduce_time_on_domain(domain));
    (await set_goal_enabled("custom/spend_less_time_" + domain));
    (await intervention_utils.generate_interventions_for_domain(domain));
    return "custom/spend_less_time_" + domain;
  };
  out$.add_enable_custom_goal_increase_time_on_domain = add_enable_custom_goal_increase_time_on_domain = async function(domain){
    (await add_custom_goal_involving_time_on_domain(domain, true));
    (await set_goal_enabled("custom/spend_more_time_" + domain));
    (await intervention_utils.generate_interventions_for_positive_domain(domain));
    return "custom/spend_more_time_" + domain;
  };
  out$.disable_all_custom_goals = disable_all_custom_goals = async function(){
    var enabled_goals, new_enabled_goals, goal_name, is_enabled;
    enabled_goals = (await get_enabled_goals());
    new_enabled_goals = {};
    for (goal_name in enabled_goals) {
      is_enabled = enabled_goals[goal_name];
      if (goal_name.startsWith('custom/')) {
        continue;
      }
      new_enabled_goals[goal_name] = is_enabled;
    }
    (await set_enabled_goals(new_enabled_goals));
  };
  out$.remove_all_custom_goals_and_interventions = remove_all_custom_goals_and_interventions = async function(){
    (await remove_all_custom_goals());
    intervention_utils.remove_all_custom_interventions();
  };
  out$.remove_all_custom_goals = remove_all_custom_goals = async function(){
    (await disable_all_custom_goals());
    clear_cache_all_goals();
    localStorage.removeItem('extra_get_goals');
    localStorage.removeItem('extra_list_all_goals');
  };
  out$.remove_custom_goal_and_generated_interventions = remove_custom_goal_and_generated_interventions = async function(goal_name){
    var all_goals, goal;
    all_goals = (await get_goals());
    goal = all_goals[goal_name];
    intervention_utils.remove_generated_interventions_for_domain(goal.domain);
    (await set_goal_disabled(goal_name));
    clear_cache_all_goals();
    remove_key_from_localstorage_dict('extra_get_goals', goal_name);
    remove_item_from_localstorage_list('extra_list_all_goals', goal_name);
    remove_cached_favicon_for_domain(goal.domain);
  };
  out$.get_interventions_to_goals = get_interventions_to_goals = async function(){
    var output, goals, goal_name, goal_info, i$, ref$, len$, intervention_name;
    output = {};
    goals = (await get_goals());
    for (goal_name in goals) {
      goal_info = goals[goal_name];
      if (goal_info.interventions == null) {
        continue;
      }
      for (i$ = 0, len$ = (ref$ = goal_info.interventions).length; i$ < len$; ++i$) {
        intervention_name = ref$[i$];
        if (output[intervention_name] == null) {
          output[intervention_name] = [];
        }
        output[intervention_name].push(goal_name);
      }
    }
    return output;
  };
  out$.get_goals_for_intervention = get_goals_for_intervention = async function(intervention_name){
    var interventions_to_goals, goals_for_intervention, ref$;
    interventions_to_goals = (await get_interventions_to_goals());
    goals_for_intervention = (ref$ = interventions_to_goals[intervention_name]) != null
      ? ref$
      : [];
    return goals_for_intervention;
  };
  out$.get_goal_target = get_goal_target = async function(goal_name){
    var result, all_goals, goal_info;
    result = (await getkey_dict('goal_targets', goal_name));
    if (result != null) {
      return parseFloat(result);
    }
    all_goals = (await get_goals());
    goal_info = all_goals[goal_name];
    return parseFloat(goal_info.target['default']);
  };
  out$.set_goal_target = set_goal_target = async function(goal_name, target_value){
    var result;
    result = (await getkey_dict('goal_targets', goal_name));
    if (result != null && parseInt(result) === target_value) {
      return;
    }
    (await setkey_dict('goal_targets', goal_name, target_value));
  };
  out$.get_all_goal_targets = get_all_goal_targets = async function(){
    var all_goals, saved_targets, output, goal_name, goal_info;
    all_goals = (await get_goals());
    saved_targets = (await getdict('goal_targets'));
    output = {};
    for (goal_name in all_goals) {
      goal_info = all_goals[goal_name];
      if (saved_targets[goal_name] != null) {
        output[goal_name] = parseFloat(saved_targets[goal_name]);
      } else {
        output[goal_name] = parseFloat(goal_info.target['default']);
      }
    }
    return output;
  };
  out$.list_goal_info_for_enabled_goals = list_goal_info_for_enabled_goals = async function(){
    var goal_names, goal_name_to_info, output, i$, len$, goal_name;
    goal_names = (await get_enabled_goals());
    goal_names = as_array(goal_names);
    goal_name_to_info = (await get_goals());
    output = [];
    for (i$ = 0, len$ = goal_names.length; i$ < len$; ++i$) {
      goal_name = goal_names[i$];
      if (goal_name_to_info[goal_name] != null) {
        output.push(goal_name_to_info[goal_name]);
      }
    }
    return output;
  };
  intervention_utils = require('libs_backend/intervention_utils');
  log_utils = require('libs_backend/log_utils');
  goal_progress = require('libs_common/goal_progress');
  gexport_module('goal_utils', function(it){
    return eval(it);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
