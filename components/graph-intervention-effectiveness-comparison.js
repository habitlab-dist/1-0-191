(function(){
  var polymer_ext, get_goal_info, ref$, get_interventions, list_enabled_interventions_for_goal, get_seconds_saved_per_session_for_each_intervention_for_goal, list_available_interventions_for_goal, prelude;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  get_goal_info = require('libs_backend/goal_utils').get_goal_info;
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, list_enabled_interventions_for_goal = ref$.list_enabled_interventions_for_goal, get_seconds_saved_per_session_for_each_intervention_for_goal = ref$.get_seconds_saved_per_session_for_each_intervention_for_goal, list_available_interventions_for_goal = ref$.list_available_interventions_for_goal;
  prelude = require('prelude-ls');
  polymer_ext({
    is: 'graph-intervention-effectiveness-comparison',
    properties: {
      goal_name: {
        type: String,
        observer: 'goal_name_changed'
      },
      goal_info: {
        type: Object,
        observer: 'goal_info_changed'
      },
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      }
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        return this.goal_name = 'facebook/spend_less_time';
      }
    },
    goal_name_changed: async function(goal_name){
      var goal_info;
      goal_info = (await get_goal_info(goal_name));
      if (goal_name !== this.goal_name) {
        return;
      }
      if (this.goal_info != null && this.goal_info.name === goal_name) {
        return;
      }
      this.goal_info = goal_name;
      return (await this.set_new_goal_info(goal_info));
    },
    goal_info_changed: async function(goal_info){
      if (this.goal_name === goal_info.name) {
        return;
      }
      this.goal_name = goal_info.name;
      return (await this.set_new_goal_info(goal_info));
    },
    set_new_goal_info: async function(goal_info){
      var self, goal_name, all_interventions, available_interventions, intervention_to_seconds_saved, intervention_minutes_saved_and_displayname, i$, len$, intervention_name, seconds_saved, minutes_saved, intervention_info, intervention_displayname, minutes_saved_list, intervention_displayname_list, this$ = this;
      self = this;
      goal_name = goal_info.name;
      all_interventions = (await get_interventions());
      available_interventions = (await list_available_interventions_for_goal(goal_name));
      intervention_to_seconds_saved = (await get_seconds_saved_per_session_for_each_intervention_for_goal(goal_name));
      intervention_minutes_saved_and_displayname = [];
      for (i$ = 0, len$ = available_interventions.length; i$ < len$; ++i$) {
        intervention_name = available_interventions[i$];
        seconds_saved = intervention_to_seconds_saved[intervention_name];
        if (isNaN(seconds_saved)) {
          seconds_saved = 0;
        }
        minutes_saved = seconds_saved / 60;
        if (minutes_saved < 0) {
          minutes_saved = 0;
        }
        intervention_info = all_interventions[intervention_name];
        if (intervention_info != null) {
          intervention_displayname = intervention_info.displayname;
        } else {
          console.error('unable to find info for ' + intervention_name);
        }
        intervention_minutes_saved_and_displayname.push({
          name: intervention_name,
          displayname: intervention_displayname,
          minutes_saved: minutes_saved
        });
      }
      intervention_minutes_saved_and_displayname = prelude.sortBy(function(it){
        return -it.minutes_saved;
      }, intervention_minutes_saved_and_displayname);
      minutes_saved_list = intervention_minutes_saved_and_displayname.map(function(it){
        return it.minutes_saved;
      });
      intervention_displayname_list = intervention_minutes_saved_and_displayname.map(function(it){
        return it.displayname;
      });
      if (goal_name !== this.goal_name) {
        return;
      }
      self.goal_info = goal_info;
      self.interventionFreqData = {
        labels: intervention_displayname_list,
        datasets: [{
          label: "Minutes saved per visit (average)",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: minutes_saved_list
        }]
      };
      return self.interventionFreqOptions = {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Minutes saved per visit (average)'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
    }
  });
}).call(this);
