(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_seconds_spent_on_all_domains_today, get_seconds_spent_on_all_domains_days_before_today, get_seconds_spent_on_domain_all_days, get_goal_info, get_goal_target, get_progress_on_goal_this_week, reverse, moment;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  ref$ = require('libs_common/time_spent_utils'), get_seconds_spent_on_all_domains_today = ref$.get_seconds_spent_on_all_domains_today, get_seconds_spent_on_all_domains_days_before_today = ref$.get_seconds_spent_on_all_domains_days_before_today, get_seconds_spent_on_domain_all_days = ref$.get_seconds_spent_on_domain_all_days;
  ref$ = require('libs_backend/goal_utils'), get_goal_info = ref$.get_goal_info, get_goal_target = ref$.get_goal_target;
  get_progress_on_goal_this_week = require('libs_backend/goal_progress').get_progress_on_goal_this_week;
  reverse = require('prelude-ls').reverse;
  moment = require('moment');
  polymer_ext({
    is: 'goal-progress-view',
    properties: {
      loaded: {
        type: Boolean,
        value: false
      },
      goal: {
        type: String,
        observer: 'goalChanged'
      }
    },
    goalChanged: async function(goal){
      var goal_info, goal_progress, progress_values, progress_labels, res$, i$, to$, ridx$, target, goal_data, i, ref$, this$ = this;
      goal_info = (await get_goal_info(goal));
      goal_progress = (await get_progress_on_goal_this_week(goal));
      progress_values = goal_progress.map(function(it){
        return it.progress;
      });
      progress_values = progress_values.map(function(it){
        return Math.round(it * 10) / 10;
      });
      res$ = [];
      for (i$ = 0, to$ = goal_progress.length; i$ < to$; ++i$) {
        ridx$ = i$;
        res$.push(ridx$);
      }
      progress_labels = res$;
      progress_labels.forEach(function(element, index, array){
        array[index] = moment().subtract(array[index], 'day').format('ddd MM/D');
      });
      target = (await get_goal_target(this.goal));
      goal_data = [];
      for (i$ = 0, to$ = progress_values.length; i$ <= to$; ++i$) {
        i = i$;
        goal_data.push(target);
      }
      if (this.goal !== goal) {
        return;
      }
      this.data = {
        labels: reverse(progress_labels),
        datasets: [
          {
            label: goal_info.progress_description,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: reverse(progress_values)
          }, {
            label: 'Daily goal',
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(0,255,0,0.4)",
            borderColor: "rgba(0,255,0,1)",
            pointBorderColor: "rgba(0,255,0,1)",
            pointBackgroundColor: '#00ff00',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(0,255,0,1)",
            pointHoverBorderColor: "rgba(0,255,0,1)",
            data: goal_data
          }
        ]
      };
      this.options = {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Day'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: (ref$ = goal_info.units) != null
                ? ref$
                : (ref$ = goal_info.target.units) != null ? ref$ : 'minutes'
            }
          }]
        }
      };
      return this.loaded = true;
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['S', 'once_available']
  });
}).call(this);
