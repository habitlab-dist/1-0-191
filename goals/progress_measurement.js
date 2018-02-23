(function(){
  var ref$, get_seconds_spent_on_domain_days_before_today, get_visits_to_domain_days_before_today, printable_time_spent, time_spent_on_domain, visits_to_domain, whether_visited_domain, always_zero_progress, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/time_spent_utils'), get_seconds_spent_on_domain_days_before_today = ref$.get_seconds_spent_on_domain_days_before_today, get_visits_to_domain_days_before_today = ref$.get_visits_to_domain_days_before_today;
  printable_time_spent = require('libs_common/time_utils').printable_time_spent;
  out$.time_spent_on_domain = time_spent_on_domain = function(goal_info){
    var domain, is_positive;
    domain = goal_info.domain, is_positive = goal_info.is_positive;
    return async function(days_before_today){
      var seconds_spent, progress, units, message, reward;
      seconds_spent = (await get_seconds_spent_on_domain_days_before_today(domain, days_before_today));
      progress = seconds_spent / 60;
      units = "minutes";
      message = printable_time_spent(seconds_spent);
      if (is_positive) {
        reward = Math.tanh(seconds_spent / 3600);
      } else {
        reward = 1.0 - Math.tanh(seconds_spent / 3600);
      }
      return {
        progress: progress,
        units: units,
        message: message,
        reward: reward
      };
    };
  };
  out$.visits_to_domain = visits_to_domain = function(goal_info){
    var domain, is_positive;
    domain = goal_info.domain, is_positive = goal_info.is_positive;
    return async function(days_before_today){
      var visits, progress, units, message, reward;
      visits = (await get_visits_to_domain_days_before_today(domain, days_before_today));
      progress = visits;
      units = "visits";
      message = visits + " visits";
      if (is_positive) {
        reward = Math.tanh(visits);
      } else {
        reward = 1 - Math.tanh(visits);
      }
      return {
        progress: progress,
        units: units,
        message: message,
        reward: reward
      };
    };
  };
  out$.whether_visited_domain = whether_visited_domain = function(goal_info){
    var domain, is_positive;
    domain = goal_info.domain, is_positive = goal_info.is_positive;
    return async function(days_before_today){
      var visits, progress, units, message, reward;
      visits = (await get_visits_to_domain_days_before_today(domain, days_before_today));
      progress = visits > 0 ? 1 : 0;
      units = "visits";
      message = visits > 0 ? "visited" : "not yet visited";
      if (is_positive) {
        reward = progress;
      } else {
        reward = 1 - progress;
      }
      return {
        progress: progress,
        units: units,
        message: message,
        reward: reward
      };
    };
  };
  out$.always_zero_progress = always_zero_progress = function(goal_info){
    return async function(days_before_today){
      var progress, units, message, reward;
      progress = 0;
      units = "minutes";
      message = "0 seconds";
      reward = 0;
      return {
        progress: progress,
        units: units,
        message: message,
        reward: reward
      };
    };
  };
}).call(this);
