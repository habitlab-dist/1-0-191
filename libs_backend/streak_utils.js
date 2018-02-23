(function(){
  var get_duolingo_streak, get_codeacademy_streak, get_goal_target, get_progress_on_goal_days_before_today, get_streak;
  get_duolingo_streak = require('libs_backend/duolingo_utils').get_duolingo_streak;
  get_codeacademy_streak = require('libs_backend/codeacademy_utils').get_codeacademy_streak;
  get_goal_target = require('libs_backend/goal_utils').get_goal_target;
  get_progress_on_goal_days_before_today = require('libs_backend/goal_progress').get_progress_on_goal_days_before_today;
  get_streak = async function(goal_info){
    var goal_name, target, streak, streak_continuing, progress_info;
    goal_name = goal_info.name;
    if (goal_name === 'duolingo/complete_lesson_each_day') {
      return (await get_duolingo_streak());
    } else if (goal_name === 'codeacademy/practice_each_day') {
      return (await get_codeacademy_streak());
    } else {
      target = (await get_goal_target(goal_name));
      streak = 0;
      streak_continuing = true;
      while (streak_continuing) {
        progress_info = (await get_progress_on_goal_days_before_today(goal_name, streak));
        if (goal_info.is_positive === progress_info.progress >= target) {
          streak += 1;
        } else {
          streak_continuing = false;
        }
      }
      return streak;
    }
  };
  module.exports = {
    get_streak: get_streak
  };
}).call(this);
