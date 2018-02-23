(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_enabled_goals, get_interventions, get_seconds_saved_per_session_for_each_intervention_for_goal, get_baseline_time_on_domain;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  get_enabled_goals = require('libs_backend/goal_utils').get_enabled_goals;
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_seconds_saved_per_session_for_each_intervention_for_goal = ref$.get_seconds_saved_per_session_for_each_intervention_for_goal;
  get_baseline_time_on_domain = require('libs_backend/history_utils').get_baseline_time_on_domain;
  polymer_ext({
    is: 'graph-time-saved-daily',
    properties: {},
    ready: async function(){
      var self, enabledGoals, enabledGoalsKeys, time_saved_on_enabled_goals, i$, len$, item, enabledGoalsResults, interventions_list, intervention_progress, key, value, intervention_descriptions, intervention_descriptions_final, k, v;
      self = this;
      enabledGoals = (await get_enabled_goals());
      enabledGoalsKeys = Object.keys(enabledGoals);
      time_saved_on_enabled_goals = [];
      for (i$ = 0, len$ = enabledGoalsKeys.length; i$ < len$; ++i$) {
        item = enabledGoalsKeys[i$];
        enabledGoalsResults = (await get_seconds_saved_per_session_for_each_intervention_for_goal(item));
        time_saved_on_enabled_goals.push(enabledGoalsResults);
      }
      interventions_list = [];
      intervention_progress = [];
      for (i$ = 0, len$ = time_saved_on_enabled_goals.length; i$ < len$; ++i$) {
        item = time_saved_on_enabled_goals[i$];
        for (key in item) {
          value = item[key];
          if (!isNaN(value)) {
            value = value / 60;
            if (value < 0) {
              value = 0;
            }
            intervention_progress.push(value);
            interventions_list.push(key);
          }
        }
      }
      intervention_descriptions = (await get_interventions());
      intervention_descriptions_final = [];
      for (i$ = 0, len$ = interventions_list.length; i$ < len$; ++i$) {
        item = interventions_list[i$];
        intervention_descriptions_final.push(intervention_descriptions[item].description);
      }
      self.timeSavedData = {
        labels: intervention_descriptions_final,
        datasets: [{
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: (await (async function(){
            var ref$, results$ = [];
            for (k in ref$ = intervention_progress) {
              v = ref$[k];
              results$.push(Math.round(v * 10) / 10);
            }
            return results$;
          }()))
        }]
      };
      return self.timeSavedOptions = {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Minutes'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['S', 'once_available']
  });
}).call(this);
