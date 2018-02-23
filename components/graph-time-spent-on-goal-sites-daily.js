(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_enabled_goals, get_goals, as_array, get_progress_on_enabled_goals_today;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals;
  as_array = require('libs_common/collection_utils').as_array;
  get_progress_on_enabled_goals_today = require('libs_backend/goal_progress').get_progress_on_enabled_goals_today;
  polymer_ext({
    is: 'graph-time-spent-on-goal-sites-daily',
    properties: {},
    ready: async function(){
      var self, goals, enabled_goals, goal_to_progress, labels, time_spent, i$, ref$, len$, goal_name, ref1$, minutes_spent, goal_domain;
      self = this;
      goals = (await get_goals());
      enabled_goals = (await get_enabled_goals());
      goal_to_progress = (await get_progress_on_enabled_goals_today());
      labels = [];
      time_spent = [];
      for (i$ = 0, len$ = (ref$ = as_array(enabled_goals)).length; i$ < len$; ++i$) {
        goal_name = ref$[i$];
        if (((ref1$ = goal_to_progress[goal_name]) != null ? ref1$.progress : void 8) == null) {
          continue;
        }
        minutes_spent = goal_to_progress[goal_name].progress;
        if (isNaN(minutes_spent)) {
          continue;
        }
        goal_domain = goals[goal_name].sitename_printable;
        labels.push(goal_domain);
        time_spent.push(minutes_spent);
      }
      self.chromeHistoryData = {
        labels: labels,
        datasets: [{
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: time_spent
        }]
      };
      return self.chromeHistoryOptions = {
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
