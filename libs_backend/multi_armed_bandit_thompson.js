(function(){
  var as_array, bandits, train_multi_armed_bandit_for_data, get_next_intervention_to_test_for_data, train_multi_armed_bandit_for_goal, get_next_intervention_to_test_for_goal, intervention_utils, intervention_manager, goal_progress, __get__, __set__, out$ = typeof exports != 'undefined' && exports || this;
  as_array = require('libs_common/collection_utils').as_array;
  bandits = require('percipio').bandits;
  /*
  to_training_data_for_single_intervention = (list_of_seconds_spent) ->
    # input: dictionary of day => number of seconds spent on FB
    # output: list of rewards (between 0 to 1). 0 = all day spent on FB, 1 = no time spent on FB
    list_of_seconds_spent = as_array list_of_seconds_spent
    output = []
    normalizing_value = Math.log(24*3600)
    for x in list_of_seconds_spent
      log_seconds_spent_normalized = Math.log(x) / normalizing_value
      output.push(1.0 - log_seconds_spent_normalized)
    return output
  
  to_training_data_for_all_interventions = (intervention_to_seconds_spent) ->
    output = {}
    for k,seconds_sepnt of intervention_to_seconds_spent
      output[k] = to_training_data_for_single_intervention seconds_spent
    return output
  */
  out$.train_multi_armed_bandit_for_data = train_multi_armed_bandit_for_data = function(data_list, intervention_names){
    var bandit_arms, bandit_arms_dict, intervention_name_to_arm, i$, len$, idx, intervention_name, arm, predictor, ref$, intervention, reward;
    bandit_arms = [];
    bandit_arms_dict = {};
    intervention_name_to_arm = {};
    for (i$ = 0, len$ = intervention_names.length; i$ < len$; ++i$) {
      idx = i$;
      intervention_name = intervention_names[i$];
      arm = bandits.createArm(idx, intervention_name);
      bandit_arms.push(arm);
      bandit_arms_dict[intervention_name] = arm;
      intervention_name_to_arm[intervention_name] = arm;
    }
    predictor = bandits.Predictor(bandit_arms);
    for (i$ = 0, len$ = data_list.length; i$ < len$; ++i$) {
      ref$ = data_list[i$], intervention = ref$.intervention, reward = ref$.reward;
      arm = intervention_name_to_arm[intervention];
      predictor.learn(arm, reward);
    }
    predictor.arms_list = bandit_arms;
    predictor.arms = bandit_arms_dict;
    return predictor;
  };
  out$.get_next_intervention_to_test_for_data = get_next_intervention_to_test_for_data = function(data_list, intervention_names){
    var predictor, arm;
    predictor = train_multi_armed_bandit_for_data(data_list, intervention_names);
    arm = predictor.predict();
    return arm.reward;
  };
  out$.train_multi_armed_bandit_for_goal = train_multi_armed_bandit_for_goal = async function(goal_name, intervention_names){
    var days_before_today_to_intervention, days_before_today_to_reward, days_to_exclude, i$, len$, intervention_name, days_deployed, progress_list, j$, len1$, day, progress_info, allowed_days, res$, ref$, data_list, intervention, reward;
    if (intervention_names == null) {
      intervention_names = (await intervention_utils.list_available_interventions_for_goal(goal_name));
    }
    days_before_today_to_intervention = {};
    days_before_today_to_reward = {};
    days_to_exclude = {};
    for (i$ = 0, len$ = intervention_names.length; i$ < len$; ++i$) {
      intervention_name = intervention_names[i$];
      days_deployed = (await intervention_manager.get_days_before_today_on_which_intervention_was_deployed(intervention_name));
      progress_list = [];
      for (j$ = 0, len1$ = days_deployed.length; j$ < len1$; ++j$) {
        day = days_deployed[j$];
        if (days_to_exclude[day]) {
          continue;
        }
        if (days_before_today_to_intervention[day] != null) {
          days_to_exclude[day] = true;
          continue;
        }
        days_before_today_to_intervention[day] = intervention_name;
        progress_info = (await goal_progress.get_progress_on_goal_days_before_today(goal_name, day));
        days_before_today_to_reward[day] = progress_info.reward;
      }
    }
    res$ = [];
    for (i$ = 0, len$ = (ref$ = Object.keys(days_before_today_to_intervention)).length; i$ < len$; ++i$) {
      day = ref$[i$];
      if (!days_to_exclude[day]) {
        res$.push(parseInt(day));
      }
    }
    allowed_days = res$;
    allowed_days.sort();
    allowed_days.reverse();
    data_list = [];
    for (i$ = 0, len$ = allowed_days.length; i$ < len$; ++i$) {
      day = allowed_days[i$];
      intervention = days_before_today_to_intervention[day];
      reward = days_before_today_to_reward[day];
      data_list.push({
        intervention: intervention,
        reward: reward
      });
    }
    return train_multi_armed_bandit_for_data(data_list, intervention_names);
  };
  out$.get_next_intervention_to_test_for_goal = get_next_intervention_to_test_for_goal = async function(goal_name, intervention_names){
    var predictor, arm;
    predictor = (await train_multi_armed_bandit_for_goal(goal_name, intervention_names));
    arm = predictor.predict();
    return arm.reward;
  };
  intervention_utils = require('libs_backend/intervention_utils');
  intervention_manager = require('libs_backend/intervention_manager');
  goal_progress = require('libs_backend/goal_progress');
  out$.__get__ = __get__ = function(name){
    return eval(name);
  };
  out$.__set__ = __set__ = function(name, val){
    return eval(name + ' = val');
  };
}).call(this);
