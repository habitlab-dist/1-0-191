(function(){
  var get_measurement_for_days_before_today, ref$, get_duolingo_is_logged_in, get_duolingo_info;
  get_measurement_for_days_before_today = require('libs_common/measurement_utils').get_measurement_for_days_before_today;
  ref$ = require('libs_backend/duolingo_utils'), get_duolingo_is_logged_in = ref$.get_duolingo_is_logged_in, get_duolingo_info = ref$.get_duolingo_info;
  module.exports = function(goal_info){
    return async function(days_before_today){
      var lessons_completed, progress, units, message, reward;
      lessons_completed = (await get_measurement_for_days_before_today('duolingo_lessons_completed', days_before_today));
      progress = lessons_completed;
      units = "lessons";
      message = progress + " " + units;
      reward = Math.tanh(lessons_completed);
      return {
        progress: progress,
        units: units,
        message: message,
        reward: reward
      };
    };
  };
}).call(this);
