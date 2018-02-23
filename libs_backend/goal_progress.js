(function(){
  var memoizeSingleAsync, ref$, gexport, gexport_module, as_array, measurement_functions, measurement_functions_generated, get_progress_measurement_functions, get_progress_measurement_function_for_goal_name, get_progress_on_goal_today, get_whether_goal_achieved_today, get_whether_goal_achieved_days_before_today, get_progress_on_goal_this_week, get_progress_on_enabled_goals_today, get_progress_on_goal_days_before_today, get_num_goals_met_today, get_num_goals_met_yesterday, get_num_goals_met_days_before_today, get_num_goals_met_this_week, get_progress_on_enabled_goals_days_before_today, get_progress_on_enabled_goals_this_week, intervention_manager, goal_utils, out$ = typeof exports != 'undefined' && exports || this;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  as_array = require('libs_common/collection_utils').as_array;
  measurement_functions = require('goals/progress_measurement');
  measurement_functions_generated = require('goals/progress_measurement_generated');
  out$.get_progress_measurement_functions = get_progress_measurement_functions = async function(){
    var output, goals, goal_name, goal_info, measurement_function;
    output = {};
    goals = (await goal_utils.get_goals());
    for (goal_name in goals) {
      goal_info = goals[goal_name];
      if (goal_info.measurement != null) {
        measurement_function = measurement_functions[goal_info.measurement];
        if (measurement_function != null) {
          output[goal_name] = measurement_function(goal_info);
          continue;
        }
      }
      measurement_function = measurement_functions_generated[goal_name];
      if (measurement_function != null) {
        output[goal_name] = measurement_function(goal_info);
        continue;
      }
      console.log("no measurement found for goal " + goal_name);
    }
    return output;
  };
  out$.get_progress_measurement_function_for_goal_name = get_progress_measurement_function_for_goal_name = async function(goal_name){
    var progress_measurement_functions;
    progress_measurement_functions = (await get_progress_measurement_functions());
    return progress_measurement_functions[goal_name];
  };
  out$.get_progress_on_goal_today = get_progress_on_goal_today = async function(goal_name){
    return (await get_progress_on_goal_days_before_today(goal_name, 0));
  };
  out$.get_whether_goal_achieved_today = get_whether_goal_achieved_today = async function(goal_name){
    return (await get_whether_goal_achieved_days_before_today(goal_name, 0));
  };
  out$.get_whether_goal_achieved_days_before_today = get_whether_goal_achieved_days_before_today = async function(goal_name, days_before_today){
    var goal_targets, progress_info, goal_target, goal_info;
    goal_targets = (await goal_utils.get_all_goal_targets());
    progress_info = (await get_progress_on_goal_days_before_today(goal_name, days_before_today));
    goal_target = goal_targets[goal_name];
    goal_info = (await goal_utils.get_goal_info(goal_name));
    return progress_info.progress >= goal_target === goal_info.is_positive;
  };
  out$.get_progress_on_goal_this_week = get_progress_on_goal_this_week = async function(goal_name){
    var results, i$, days_before_today, progress_info;
    results = [];
    for (i$ = 0; i$ <= 6; ++i$) {
      days_before_today = i$;
      progress_info = (await get_progress_on_goal_days_before_today(goal_name, days_before_today));
      results.push(progress_info);
    }
    return results;
  };
  out$.get_progress_on_enabled_goals_today = get_progress_on_enabled_goals_today = async function(){
    return (await get_progress_on_enabled_goals_days_before_today(0));
  };
  out$.get_progress_on_goal_days_before_today = get_progress_on_goal_days_before_today = async function(goal_name, days_before_today){
    var goal_measurement_function;
    goal_measurement_function = (await get_progress_measurement_function_for_goal_name(goal_name));
    if (goal_measurement_function == null) {
      console.log('no goal_measurement_function found for goal');
      console.log(goal_name);
      return;
    }
    return (await goal_measurement_function(days_before_today));
  };
  out$.get_num_goals_met_today = get_num_goals_met_today = async function(){
    return (await get_num_goals_met_days_before_today(0));
  };
  out$.get_num_goals_met_yesterday = get_num_goals_met_yesterday = async function(){
    return (await get_num_goals_met_days_before_today(1));
  };
  out$.get_num_goals_met_days_before_today = get_num_goals_met_days_before_today = async function(days_before_today){
    var enabled_goals, goal_targets, num_goals_met, i$, ref$, len$, goal_name;
    enabled_goals = (await goal_utils.get_enabled_goals());
    goal_targets = (await goal_utils.get_all_goal_targets());
    num_goals_met = 0;
    for (i$ = 0, len$ = (ref$ = as_array(enabled_goals)).length; i$ < len$; ++i$) {
      goal_name = ref$[i$];
      if (get_whether_goal_achieved_days_before_today(goal_name, days_before_today)) {
        num_goals_met += 1;
      }
    }
    return num_goals_met;
  };
  out$.get_num_goals_met_this_week = get_num_goals_met_this_week = async function(){
    var enabled_goals, goal_targets, days_before_today_to_num_goals_met, i$, days_before_today, num_goals_met, j$, ref$, len$, goal_name, progress_info, goal_target, goal_info;
    enabled_goals = (await goal_utils.get_enabled_goals());
    goal_targets = (await goal_utils.get_all_goal_targets());
    days_before_today_to_num_goals_met = [0, 0, 0, 0, 0, 0, 0];
    for (i$ = 0; i$ <= 6; ++i$) {
      days_before_today = i$;
      num_goals_met = 0;
      for (j$ = 0, len$ = (ref$ = as_array(enabled_goals)).length; j$ < len$; ++j$) {
        goal_name = ref$[j$];
        progress_info = (await get_progress_on_goal_days_before_today(goal_name, days_before_today));
        goal_target = goal_targets[goal_name];
        goal_info = (await goal_utils.get_goal_info(goal_name));
        if (goal_info.is_positive) {
          if (progress_info.progress > goal_target) {
            num_goals_met += 1;
          }
        } else {
          if (progress_info.progress < goal_target) {
            num_goals_met += 1;
          }
        }
      }
      days_before_today_to_num_goals_met[days_before_today] = num_goals_met;
    }
    return days_before_today_to_num_goals_met;
  };
  out$.get_progress_on_enabled_goals_days_before_today = get_progress_on_enabled_goals_days_before_today = async function(days_before_today){
    var enabled_goals, enabled_goals_list, output, i$, len$, goal_name, progress_info;
    enabled_goals = (await goal_utils.get_enabled_goals());
    enabled_goals_list = as_array(enabled_goals);
    output = {};
    for (i$ = 0, len$ = enabled_goals_list.length; i$ < len$; ++i$) {
      goal_name = enabled_goals_list[i$];
      progress_info = (await get_progress_on_goal_days_before_today(goal_name, days_before_today));
      output[goal_name] = progress_info;
    }
    return output;
  };
  /**
   * Gets the goal progress info on each enabled goal this week.
   * @return {Promise.<Object.<string, Array.<GoalProgressInfo>>>} Object mapping goal names to an array of goal progress info objects, one for each of the past 7 days (index 0=today, 1=yesterday, etc)
   */
  out$.get_progress_on_enabled_goals_this_week = get_progress_on_enabled_goals_this_week = async function(){
    var enabled_goals, enabled_goals_list, output, i$, len$, goal_name, progress_this_week;
    enabled_goals = (await goal_utils.get_enabled_goals());
    enabled_goals_list = as_array(enabled_goals);
    output = {};
    for (i$ = 0, len$ = enabled_goals_list.length; i$ < len$; ++i$) {
      goal_name = enabled_goals_list[i$];
      progress_this_week = (await get_progress_on_goal_this_week(goal_name));
      output[goal_name] = progress_this_week;
    }
    return output;
  };
  intervention_manager = require('libs_backend/intervention_manager');
  goal_utils = require('libs_backend/goal_utils');
  gexport_module('goal_progress', function(it){
    return eval(it);
  });
}).call(this);
