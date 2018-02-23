(function(){
  var polymer_ext, get_all_badges_earned_for_minutes_saved, get_time_saved_total;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  get_all_badges_earned_for_minutes_saved = require('libs_common/badges_utils').get_all_badges_earned_for_minutes_saved;
  get_time_saved_total = require('libs_common/gamification_utils').get_time_saved_total;
  polymer_ext({
    is: 'all-badges-earned-display',
    properties: {
      badges: {
        type: Array
      },
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      },
      minutes_saved: {
        type: Number
      }
    },
    ready: async function(){
      var time_saved, minutes_saved;
      time_saved = (await get_time_saved_total());
      minutes_saved = time_saved / 60;
      if (this.minutes_saved != null) {
        minutes_saved = this.minutes_saved;
      }
      return this.badges = get_all_badges_earned_for_minutes_saved(minutes_saved);
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        return this.minutes_saved = 300;
      }
    },
    no_badges_yet: function(badges){
      return badges.length === 0;
    }
  });
}).call(this);
