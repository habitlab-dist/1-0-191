(function(){
  var ref$, gexport, gexport_module, memoize, list_all_badge_info, get_minutes_saved_to_badges, get_badge_for_minutes_saved, get_timesaved_badge_that_should_be_awarded, get_all_badges_earned_for_minutes_saved, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  memoize = require('libs_common/memoize').memoize;
  out$.list_all_badge_info = list_all_badge_info = function(){
    var output, i$, len$, badge_info, ref$;
    output = [
      {
        minutes_saved: 10,
        name: 'Mile Run',
        message: 'That is enough time to run a mile!',
        icon: 'run.svg'
      }, {
        minutes_saved: 20,
        name: 'Nap Time',
        message: 'That is enough time to fit in a quick nap!',
        icon: 'nap.svg'
      }, {
        minutes_saved: 40,
        name: 'Workout',
        message: 'That is enough time for a workout!',
        icon: 'workout.svg'
      }, {
        minutes_saved: 60,
        name: 'Hike',
        message: 'That is enough time for a hike!',
        icon: 'hike.svg'
      }, {
        minutes_saved: 2 * 60,
        name: 'Harry Potter',
        message: 'That is enough time to watch the first Harry Potter movie!',
        icon: 'wizard.svg'
      }, {
        minutes_saved: 3 * 60,
        name: 'Museum',
        message: 'That is enough time to go to go explore a museum!',
        icon: 'museum.svg'
      }, {
        minutes_saved: 4 * 60,
        name: 'Surfing',
        message: 'That is enough time to go to the beach for some surfing!',
        icon: 'surfing.svg'
      }, {
        minutes_saved: 5 * 60,
        name: 'Skydiving',
        message: 'That is enough time for a skydiving expedition!',
        icon: 'skydiving.svg'
      }
    ];
    for (i$ = 0, len$ = output.length; i$ < len$; ++i$) {
      badge_info = output[i$];
      if (badge_info.icon != null) {
        badge_info.img_url = chrome.extension.getURL("icons/badges/" + badge_info.icon);
      }
      badge_info.type = 'minutes_saved';
      if (badge_info.minutes_saved != null) {
        if (59 < (ref$ = badge_info.minutes_saved) && ref$ < 61) {
          badge_info.time_message = '1 hour';
        } else if (badge_info.minutes_saved > 61) {
          badge_info.time_message = Math.round(badge_info.minutes_saved / 60) + " hours";
        } else {
          badge_info.time_message = badge_info.minutes_saved + " minutes";
        }
      }
    }
    return output;
  };
  out$.get_minutes_saved_to_badges = get_minutes_saved_to_badges = memoize(function(){
    var output, i$, ref$, len$, badge_info;
    output = {};
    for (i$ = 0, len$ = (ref$ = list_all_badge_info()).length; i$ < len$; ++i$) {
      badge_info = ref$[i$];
      output[badge_info.minutes_saved] = badge_info;
    }
    return output;
  });
  out$.get_badge_for_minutes_saved = get_badge_for_minutes_saved = function(minutes_saved){
    var minutes_saved_to_badges;
    minutes_saved_to_badges = get_minutes_saved_to_badges();
    return minutes_saved_to_badges[minutes_saved];
  };
  out$.get_timesaved_badge_that_should_be_awarded = get_timesaved_badge_that_should_be_awarded = function(seconds_saved, seconds_saved_prev){
    var i$, ref$, len$, badge_info, ref1$;
    for (i$ = 0, len$ = (ref$ = list_all_badge_info()).length; i$ < len$; ++i$) {
      badge_info = ref$[i$];
      if (seconds_saved_prev < (ref1$ = badge_info.minutes_saved * 60) && ref1$ <= seconds_saved) {
        return badge_info;
      }
    }
  };
  out$.get_all_badges_earned_for_minutes_saved = get_all_badges_earned_for_minutes_saved = function(minutes_saved){
    var output, i$, ref$, len$, badge_info;
    output = [];
    for (i$ = 0, len$ = (ref$ = list_all_badge_info()).length; i$ < len$; ++i$) {
      badge_info = ref$[i$];
      if (badge_info.minutes_saved <= minutes_saved) {
        output.push(badge_info);
      }
    }
    return output;
  };
  gexport_module('badges_utils', function(it){
    return eval(it);
  });
}).call(this);
