(function(){
  var log_action, get_intervention, get_random_uncompleted_positive_goal, msg;
  log_action = require('libs_frontend/intervention_log_utils').log_action;
  get_intervention = require('libs_common/intervention_info').get_intervention;
  get_random_uncompleted_positive_goal = require('libs_common/goal_utils').get_random_uncompleted_positive_goal;
  msg = require('libs_common/localization_utils').msg;
  Polymer({
    is: 'positive-goal-site-button',
    properties: {
      goal: {
        type: Object,
        observer: 'goalChanged'
      },
      buttontext: String
    },
    goalChanged: function(){
      return this.buttontext = msg(this.goal.call_to_action + "");
    },
    button_clicked: function(){
      var domain;
      log_action({
        'positive': 'positive-goal-site-button clicked'
      });
      domain = this.goal.domain;
      if (domain.search("http") === -1) {
        domain = 'https://' + domain;
      }
      return window.location.href = domain;
    },
    ready: async function(){
      return this.goal = (await get_random_uncompleted_positive_goal());
    }
  });
}).call(this);
