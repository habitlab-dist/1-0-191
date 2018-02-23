(function(){
  var shuffled, prelude, ref$, list_available_interventions_for_enabled_goals, get_manually_managed_interventions, get_manually_managed_interventions_localstorage, list_all_interventions, get_enabled_interventions, get_enabled_goals, get_goals, as_array, gexport, gexport_module, one_random_intervention_per_enabled_goal, selection_algorithms_for_visit, get_intervention_selection_algorithm_for_visit, multi_armed_bandit, out$ = typeof exports != 'undefined' && exports || this;
  shuffled = require('shuffled');
  prelude = require('prelude-ls');
  ref$ = require('libs_backend/intervention_utils'), list_available_interventions_for_enabled_goals = ref$.list_available_interventions_for_enabled_goals, get_manually_managed_interventions = ref$.get_manually_managed_interventions, get_manually_managed_interventions_localstorage = ref$.get_manually_managed_interventions_localstorage, list_all_interventions = ref$.list_all_interventions, get_enabled_interventions = ref$.get_enabled_interventions;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals;
  as_array = require('libs_common/collection_utils').as_array;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.one_random_intervention_per_enabled_goal = one_random_intervention_per_enabled_goal = async function(enabled_goals){
    var enabled_interventions, goals, output, output_set, goal_name, goal_enabled, goal_info, interventions, available_interventions, res$, i$, len$, intervention, selected_intervention;
    if (enabled_goals == null) {
      enabled_goals = (await get_enabled_goals());
    }
    enabled_interventions = (await get_enabled_interventions());
    goals = (await get_goals());
    output = [];
    output_set = {};
    for (goal_name in enabled_goals) {
      goal_enabled = enabled_goals[goal_name];
      goal_info = goals[goal_name];
      if (goal_info == null || goal_info.interventions == null) {
        continue;
      }
      interventions = goal_info.interventions;
      res$ = [];
      for (i$ = 0, len$ = interventions.length; i$ < len$; ++i$) {
        intervention = interventions[i$];
        if (enabled_interventions[intervention]) {
          res$.push(intervention);
        }
      }
      available_interventions = res$;
      if (available_interventions.length === 0) {
        continue;
      }
      selected_intervention = shuffled(available_interventions)[0];
      output.push(selected_intervention);
      output_set[selected_intervention] = true;
    }
    return prelude.sort(output);
  };
  /*
  export one_random_intervention_per_enabled_goal = (enabled_goals) ->>
    if not enabled_goals?
      enabled_goals = await get_enabled_goals()
    manually_enabled_interventions = await get_most_recent_manually_enabled_interventions()
    manually_enabled_interventions_list = as_array manually_enabled_interventions
    manually_disabled_interventions = await get_most_recent_manually_disabled_interventions()
    manually_disabled_interventions_list = as_array manually_disabled_interventions
    goals = await get_goals()
    output = []
    output_set = {}
    for goal_name,goal_enabled of enabled_goals
      goal_info = goals[goal_name]
      interventions = goal_info.interventions
      # do any manually enabled interventions already satisfy this goal? if yes we don't need to select one
      should_select_intervention = true
      for intervention in interventions
        if manually_enabled_interventions[intervention]
          should_select_intervention = false
          break
      if not should_select_intervention
        continue
      # what interventions are available that have not been manually disabled?
      available_interventions = [intervention for intervention in interventions when not manually_disabled_interventions[intervention]]
      if available_interventions.length == 0
        continue
      selected_intervention = shuffled(available_interventions)[0]
      output.push selected_intervention
      output_set[selected_intervention] = true
    return prelude.sort(output)
  */
  /*
  export each_intervention_enabled_with_probability_half = (enabled_goals) ->>
    interventions = await list_available_interventions_for_enabled_goals()
    return prelude.sort [x for x in interventions when Math.random() < 0.5]
  
  export one_intervention_per_goal_multi_armed_bandit = (enabled_goals) ->>
    if not enabled_goals?
      enabled_goals = await get_enabled_goals()
    manually_enabled_interventions = await get_most_recent_manually_enabled_interventions()
    manually_enabled_interventions_list = as_array manually_enabled_interventions
    manually_disabled_interventions = await get_most_recent_manually_disabled_interventions()
    manually_disabled_interventions_list = as_array manually_disabled_interventions
    goals = await get_goals()
    output = []
    output_set = {}
    for goal_name,goal_enabled of enabled_goals
      goal_info = goals[goal_name]
      interventions = goal_info.interventions
      # do any manually enabled interventions already satisfy this goal? if yes we don't need to select one
      should_select_intervention = true
      for intervention in interventions
        if manually_enabled_interventions[intervention]
          should_select_intervention = false
          break
      if not should_select_intervention
        continue
      # what interventions are available that have not been manually disabled?
      available_interventions = [intervention for intervention in interventions when not manually_disabled_interventions[intervention]]
      if available_interventions.length == 0
        continue
      selected_intervention = await multi_armed_bandit.get_next_intervention_to_test_for_goal(goal_name, available_interventions)
      output.push selected_intervention
      output_set[selected_intervention] = true
    return prelude.sort(output)
  
  selection_algorithms = {
    'one_intervention_per_goal_multi_armed_bandit': one_intervention_per_goal_multi_armed_bandit
    'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal
    'each_intervention_enabled_with_probability_half': each_intervention_enabled_with_probability_half
    'default': one_intervention_per_goal_multi_armed_bandit
  }
  
  export get_intervention_selection_algorithm = ->>
    algorithm_name = localStorage.getItem('selection_algorithm')
    if not (algorithm_name? and selection_algorithms[algorithm_name]?)
      algorithm_name = 'default'
    return selection_algorithms[algorithm_name]
  */
  selection_algorithms_for_visit = {
    'random': one_random_intervention_per_enabled_goal,
    'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal,
    'default': one_random_intervention_per_enabled_goal
  };
  out$.get_intervention_selection_algorithm_for_visit = get_intervention_selection_algorithm_for_visit = async function(){
    var algorithm_name;
    algorithm_name = localStorage.getItem('selection_algorithm_for_visit');
    if (!(algorithm_name != null && selection_algorithms_for_visit[algorithm_name] != null)) {
      algorithm_name = 'default';
    }
    return selection_algorithms_for_visit[algorithm_name];
  };
  multi_armed_bandit = require('libs_backend/multi_armed_bandit').get_multi_armed_bandit_algorithm('thompson');
  gexport_module('intervention_selection_algorithms', function(it){
    return eval(it);
  });
}).call(this);
