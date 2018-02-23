(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_progress_on_enabled_goals_today, get_progress_on_goal_today, get_goals;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  ref$ = require('libs_backend/goal_progress'), get_progress_on_enabled_goals_today = ref$.get_progress_on_enabled_goals_today, get_progress_on_goal_today = ref$.get_progress_on_goal_today;
  get_goals = require('libs_backend/goal_utils').get_goals;
  polymer_ext({
    is: 'graph-daily-overview',
    properties: {},
    ready: async function(){
      var self, goalsDataToday, goal_name_to_info, goal_descriptions, minutes_spent_on_sites, goal_name, progress_info, minutes_spent, goal_info;
      self = this;
      goalsDataToday = (await get_progress_on_enabled_goals_today());
      goal_name_to_info = (await get_goals());
      goal_descriptions = [];
      minutes_spent_on_sites = [];
      for (goal_name in goalsDataToday) {
        progress_info = goalsDataToday[goal_name];
        minutes_spent = progress_info.progress;
        if (isNaN(minutes_spent)) {
          continue;
        }
        goal_info = goal_name_to_info[goal_name];
        goal_descriptions.push(goal_info.description);
        minutes_spent_on_sites.push(minutes_spent);
      }
      self.goalOverviewData = {
        labels: goal_descriptions,
        datasets: [{
          label: "Today",
          backgroundColor: "rgba(75,192,192,0.5)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          data: minutes_spent_on_sites
        }]
      };
      return self.goalOverviewOptions = {
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
