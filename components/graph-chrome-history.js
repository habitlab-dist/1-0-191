(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_enabled_goals, get_goals, get_baseline_time_on_domain;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals;
  get_baseline_time_on_domain = require('libs_backend/history_utils').get_baseline_time_on_domain;
  polymer_ext({
    is: 'graph-chrome-history',
    properties: {},
    ready: async function(){
      var self, goalsHistory, enabledGoalsHistory, intervention_urls, key, value, goal, intervention_time_spent, i$, len$, item, temp;
      self = this;
      goalsHistory = (await get_goals());
      enabledGoalsHistory = (await get_enabled_goals());
      intervention_urls = [];
      for (key in enabledGoalsHistory) {
        value = enabledGoalsHistory[key];
        goal = goalsHistory[key];
        intervention_urls.push(goal.domain);
      }
      intervention_time_spent = [];
      for (i$ = 0, len$ = intervention_urls.length; i$ < len$; ++i$) {
        item = intervention_urls[i$];
        temp = (await get_baseline_time_on_domain(item));
        intervention_time_spent.push(Math.round(10 * temp / (60 * 1000)) / 10);
      }
      self.chromeHistoryData = {
        labels: intervention_urls,
        datasets: [{
          label: "Today",
          backgroundColor: "rgba(27,188,155,0.5)",
          borderColor: "rgba(27,188,155,1)",
          borderWidth: 1,
          data: intervention_time_spent
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
