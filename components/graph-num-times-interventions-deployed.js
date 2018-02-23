(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, get_num_impressions_today, get_num_actions_today, get_interventions_seen_today, get_interventions;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  ref$ = require('libs_backend/log_utils'), get_num_impressions_today = ref$.get_num_impressions_today, get_num_actions_today = ref$.get_num_actions_today, get_interventions_seen_today = ref$.get_interventions_seen_today;
  get_interventions = require('libs_backend/intervention_utils').get_interventions;
  polymer_ext({
    is: 'graph-num-times-interventions-deployed',
    properties: {},
    ready: async function(){
      var self, seenInterventions, results, i$, len$, intv, interv_descriptions, seenInterventionsLabels, item;
      self = this;
      seenInterventions = (await get_interventions_seen_today());
      results = [];
      for (i$ = 0, len$ = seenInterventions.length; i$ < len$; ++i$) {
        intv = seenInterventions[i$];
        results.push((await get_num_impressions_today(intv)));
      }
      interv_descriptions = (await get_interventions());
      seenInterventionsLabels = [];
      for (i$ = 0, len$ = seenInterventions.length; i$ < len$; ++i$) {
        item = seenInterventions[i$];
        seenInterventionsLabels.push(interv_descriptions[item].description);
      }
      self.interventionFreqData = {
        labels: seenInterventionsLabels,
        datasets: [{
          label: "Times Deployed",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: results
        }]
      };
      return self.interventionFreqOptions = {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of Times'
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
