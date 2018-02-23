(function(){
  var polymer_ext, ref$, list_all_goals, get_goals, get_interventions, list_custom_interventions;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  ref$ = require('libs_backend/goal_utils'), list_all_goals = ref$.list_all_goals, get_goals = ref$.get_goals;
  ref$ = require('libs_common/intervention_utils'), get_interventions = ref$.get_interventions, list_custom_interventions = ref$.list_custom_interventions;
  polymer_ext({
    is: 'intervention-editor-onboard',
    properties: {
      templates_info_list: {
        type: Array
      },
      custom_intervention_list: {
        type: Array
      }
    },
    open_template: function(evt){
      localStorage.setItem('intervention_editor_open_template_name', JSON.stringify(evt.model.template_name.name));
      return chrome.tabs.create({
        url: chrome.extension.getURL('index.html?tag=intervention-editor')
      });
    },
    open_custom_intervention: function(evt){
      localStorage.setItem('intervention_editor_open_intervention_name', JSON.stringify(evt.model.intervention_name));
      return chrome.tabs.create({
        url: chrome.extension.getURL('index.html?tag=intervention-editor')
      });
    },
    add_new_clicked: async function(){
      var self, create_intervention_dialog, all_goals, goals_list, res$, i$, len$, x;
      self = this;
      create_intervention_dialog = document.createElement('create-intervention-dialog');
      document.body.appendChild(create_intervention_dialog);
      all_goals = (await get_goals());
      goals_list = (await list_all_goals());
      res$ = [];
      for (i$ = 0, len$ = goals_list.length; i$ < len$; ++i$) {
        x = goals_list[i$];
        res$.push(all_goals[x]);
      }
      create_intervention_dialog.goal_info_list = res$;
      create_intervention_dialog.open_create_new_intervention_dialog();
      return create_intervention_dialog.addEventListener('display_new_intervention', function(evt){
        return localStorage.setItem('intervention_editor_new_intervention_info', JSON.stringify(evt.detail));
      });
    },
    ready: async function(){
      var all_interventions, templates_list, res$, i$, len$, x, writing_interventions_text, this$ = this;
      all_interventions = (await get_interventions());
      templates_list = ['generic/make_user_wait', "generic/toast_notifications", "iqiyi/prompt_before_watch", "iqiyi/remove_sidebar_links", "netflix/infinite_alarm", "netflix/link_articles", "facebook/remove_news_feed", "facebook/rich_notifications"];
      res$ = [];
      for (i$ = 0, len$ = templates_list.length; i$ < len$; ++i$) {
        x = templates_list[i$];
        res$.push(all_interventions[x]);
      }
      this.templates_info_list = res$;
      this.custom_intervention_list = (await list_custom_interventions());
      writing_interventions_text = (await fetch("https://raw.githubusercontent.com/wiki/habitlab/habitlab/Writing-Interventions.md").then(function(it){
        return it.text();
      }));
      writing_interventions_text = writing_interventions_text.slice(writing_interventions_text.indexOf('#'));
      return this.$.markdown_display.markdown = writing_interventions_text;
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: []
  });
}).call(this);
