(function(){
  var polymer_ext, list_goals_for_site;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  list_goals_for_site = require('libs_backend/goal_utils').list_goals_for_site;
  polymer_ext({
    is: 'site-goal-view-v2',
    properties: {
      site: {
        type: String,
        observer: 'siteChanged'
      },
      goals: {
        type: Array
      },
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      }
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        return this.site = 'facebook';
      }
    },
    siteChanged: async function(site){
      var goals;
      goals = (await list_goals_for_site(site));
      if (this.site !== site) {
        return;
      }
      return this.goals = goals;
    }
  });
}).call(this);
