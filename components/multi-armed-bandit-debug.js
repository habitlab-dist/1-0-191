(function(){
  var polymer_ext, moment, prelude, get_multi_armed_bandit_algorithm, intervention_utils;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  moment = require('moment');
  prelude = require('prelude-ls');
  get_multi_armed_bandit_algorithm = require('libs_backend/multi_armed_bandit').get_multi_armed_bandit_algorithm;
  intervention_utils = require('libs_common/intervention_utils');
  polymer_ext({
    is: 'multi-armed-bandit-debug',
    properties: {
      goal: {
        type: String,
        value: 'facebook/spend_less_time',
        observer: 'goal_changed'
      },
      mab_algorithm: {
        type: Object,
        computed: 'compute_mab_algorithm(algorithm, algorithm_options)'
      },
      rewards_info: {
        type: Array,
        value: []
      },
      chosen_intervention: {
        type: String,
        value: ''
      },
      multi_armed_bandit: {
        type: Object
      },
      intervention_score_ranges: {
        type: Object
      },
      chosen_intervention_reward_value: {
        type: Number
      },
      regret_this_round: {
        type: Number
      },
      total_regret: {
        type: Number,
        value: 0
      },
      total_rounds_played: {
        type: Number,
        value: 0
      },
      average_regret: {
        type: Number,
        computed: "compute_average_regret(total_regret, total_rounds_played)"
      },
      simulations_disabled: {
        type: Object,
        value: {}
      },
      algorithm: {
        type: String,
        value: 'thompson'
      },
      algorithm_options: {
        type: Object,
        value: {}
      }
    },
    compute_mab_algorithm: function(algorithm, algorithm_options){
      return get_multi_armed_bandit_algorithm(algorithm, algorithm_options);
    },
    algorithm_changed: function(evt){
      var prev_algorithm, new_algorithm;
      prev_algorithm = this.algorithm;
      new_algorithm = evt.target.name;
      if (prev_algorithm === new_algorithm) {
        return;
      }
      console.log('algorithm changed to ' + new_algorithm);
      return this.algorithm = new_algorithm;
    },
    get_lower_range_time: function(intervention_name, intervention_score_ranges){
      var lower_range, seconds;
      lower_range = intervention_score_ranges[intervention_name].min;
      seconds = 3600 * Math.atanh(1 - lower_range);
      return moment.utc(1000 * seconds).format('HH:mm:ss');
    },
    get_upper_range_time: function(intervention_name, intervention_score_ranges){
      var upper_range, seconds;
      upper_range = intervention_score_ranges[intervention_name].max;
      seconds = 3600 * Math.atanh(1 - upper_range);
      return moment.utc(1000 * seconds).format('HH:mm:ss');
    },
    compute_average_regret: function(total_regret, total_rounds_played){
      return total_regret / total_rounds_played;
    },
    retrain_multi_armed_bandit: async function(){
      var goal_name, intervention_names, res$, i$, len$, x;
      goal_name = this.goal;
      intervention_names = (await intervention_utils.list_available_interventions_for_goal(goal_name));
      res$ = [];
      for (i$ = 0, len$ = intervention_names.length; i$ < len$; ++i$) {
        x = intervention_names[i$];
        if (this.simulations_disabled[x] !== true) {
          res$.push(x);
        }
      }
      intervention_names = res$;
      this.multi_armed_bandit = (await this.mab_algorithm.train_multi_armed_bandit_for_goal(goal_name, intervention_names));
      return this.update_rewards_info();
    },
    goal_changed: async function(){
      var goal_name;
      goal_name = this.goal;
      console.log("new goal is " + goal_name);
      return (await this.retrain_multi_armed_bandit());
    },
    disable_intervention_in_simulation: async function(evt){
      var intervention;
      intervention = evt.target.intervention;
      this.simulations_disabled[evt.target.intervention] = !evt.target.checked;
      this.multi_armed_bandit = null;
      this.total_rounds_played = 0;
      this.total_regret = 0;
      return (await this.retrain_multi_armed_bandit());
    },
    is_simulation_enabled: function(intervention, simulations_disabled){
      return simulations_disabled[intervention] !== true;
    },
    update_rewards_info: function(){
      var new_rewards_info, i$, ref$, len$, arm, intervention, average_score, num_trials;
      new_rewards_info = [];
      for (i$ = 0, len$ = (ref$ = this.multi_armed_bandit.arms_list).length; i$ < len$; ++i$) {
        arm = ref$[i$];
        intervention = arm.reward;
        if (arm.trials === 0) {
          average_score = 0;
        } else {
          average_score = arm.wins / arm.trials;
        }
        num_trials = arm.trials;
        new_rewards_info.push({
          intervention: intervention,
          average_score: average_score,
          num_trials: num_trials
        });
      }
      console.log(new_rewards_info);
      return this.rewards_info = new_rewards_info;
    },
    slider_changed: function(evt){
      var score_ranges, i$, ref$, len$, slider, value_min, value_max, intervention;
      score_ranges = {};
      for (i$ = 0, len$ = (ref$ = this.$$$('.intervention_score_range')).length; i$ < len$; ++i$) {
        slider = ref$[i$];
        value_min = parseFloat(slider.getAttribute('value-min'));
        value_max = parseFloat(slider.getAttribute('value-max'));
        intervention = slider.intervention;
        score_ranges[intervention] = {
          min: value_min,
          max: value_max
        };
      }
      console.log('score ranges are now');
      console.log(score_ranges);
      return this.intervention_score_ranges = score_ranges;
    },
    get_reward_values_for_all_interventions: function(){
      var output, intervention, ref$, score_range, reward_value;
      output = {};
      for (intervention in ref$ = this.intervention_score_ranges) {
        score_range = ref$[intervention];
        reward_value = score_range.min + Math.random() * (score_range.max - score_range.min);
        output[intervention] = reward_value;
      }
      return output;
    },
    to_id: function(intervention_name){
      var alphabet, output;
      alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].concat(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].concat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]));
      output = intervention_name.split('').filter(function(it){
        return alphabet.indexOf(it) !== -1;
      }).join('');
      console.log(output);
      return output;
    },
    choose_intervention: async function(){
      var goal_name, arm, intervention, score_range, all_reward_values, best_reward_value, k, v, reward_value;
      console.log('choose intervention button clicked');
      goal_name = this.goal;
      if (this.multi_armed_bandit == null) {
        this.total_rounds_played = 0;
        this.total_regret = 0;
        (await this.retrain_multi_armed_bandit());
      }
      arm = this.multi_armed_bandit.predict();
      intervention = arm.reward;
      score_range = this.intervention_score_ranges[intervention];
      all_reward_values = this.get_reward_values_for_all_interventions();
      best_reward_value = prelude.maximum((await (async function(){
        var ref$, results$ = [];
        for (k in ref$ = all_reward_values) {
          v = ref$[k];
          results$.push(v);
        }
        return results$;
      }())));
      reward_value = all_reward_values[intervention];
      this.chosen_intervention = intervention;
      this.chosen_intervention_reward_value = reward_value;
      this.total_rounds_played += 1;
      this.regret_this_round = best_reward_value - reward_value;
      this.total_regret += this.regret_this_round;
      this.multi_armed_bandit.learn(arm, reward_value);
      this.update_rewards_info();
      this.SM('.intervention_name').css('background-color', 'white');
      return this.S('#' + this.to_id(intervention)).css('background-color', 'yellow');
    },
    ready: function(){
      var self;
      self = this;
      return self.once_available('.intervention_score_range', function(){
        return self.slider_changed();
      });
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['$$$', 'SM', 'S', 'once_available']
  });
}).call(this);
