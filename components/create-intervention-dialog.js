(function(){
  var ref$, list_all_interventions, get_intervention_info, get_goal_info, polymer_ext;
  ref$ = require('libs_backend/intervention_utils'), list_all_interventions = ref$.list_all_interventions, get_intervention_info = ref$.get_intervention_info;
  get_goal_info = require('libs_backend/goal_utils').get_goal_info;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  polymer_ext({
    is: 'create-intervention-dialog',
    properties: {
      goal_info_list: {
        type: Array
      },
      current_goal: {
        type: String
      },
      current_intervention: {
        type: String,
        value: ''
      },
      intervention_list: {
        type: Array
      },
      preview_url: {
        type: String
      },
      is_edit_mode: {
        type: Boolean,
        value: false
      }
    },
    ready: async function(){
      var all_interventions, proposed_intervention_name, proposed_intervention_name_fixed, suffix_num, need_suffix;
      all_interventions = (await list_all_interventions());
      proposed_intervention_name = 'My Custom Intervention';
      proposed_intervention_name_fixed = proposed_intervention_name.split(' ').join('_');
      suffix_num = 0;
      need_suffix = false;
      while (all_interventions.includes(proposed_intervention_name_fixed)) {
        suffix_num += 1;
        need_suffix = true;
        proposed_intervention_name_fixed = (proposed_intervention_name + ' ' + suffix_num).split(' ').join('_');
      }
      if (need_suffix) {
        proposed_intervention_name = proposed_intervention_name + ' ' + suffix_num;
      }
      return this.proposed_intervention_name = proposed_intervention_name;
    },
    open_create_new_intervention_dialog: function(){
      var goal_names_list, this$ = this;
      if (this.current_goal != null) {
        goal_names_list = this.goal_info_list.map(function(it){
          return it.name;
        });
        this.$.goal_selector.selected = goal_names_list.indexOf(this.current_goal);
      }
      this.is_edit_mode = false;
      return this.$$('#create_new_intervention_dialog').open();
    },
    open_existing_custom_intervention_dialog: function(){
      return this.$$('#open_existing_custom_intervention').open();
    },
    open_edit_intervention_info_dialog: async function(){
      var intervention_info, goal_name, goal_names_list, preview_url, goal_info, ref$, this$ = this;
      intervention_info = (await get_intervention_info(this.current_intervention));
      goal_name = intervention_info.goals[0];
      goal_names_list = this.goal_info_list.map(function(it){
        return it.name;
      });
      this.$.goal_selector.selected = goal_names_list.indexOf(goal_name);
      this.$.intervention_description.value = intervention_info.description;
      this.$.intervention_name.value = intervention_info.name;
      preview_url = intervention_info.preview;
      if (preview_url == null) {
        goal_info = (await get_goal_info(intervention_info.goals[0]));
        preview_url = (ref$ = goal_info.preview) != null
          ? ref$
          : 'https://' + goal_info.domain + '/';
      }
      this.preview_url = preview_url;
      this.$.dialog_button.innerHTML = 'MODIFY';
      this.is_edit_mode = true;
      return this.$$('#create_new_intervention_dialog').open();
    },
    validate_intervention_name: async function(){
      var self, proposed_intervention_name, all_interventions, preview_url;
      self = this;
      proposed_intervention_name = this.$.intervention_name.value;
      proposed_intervention_name = proposed_intervention_name.split(' ').join('_');
      if (proposed_intervention_name === '') {
        self.$$('#hint').innerHTML = 'Name must be non-empty';
        return;
      }
      all_interventions = (await list_all_interventions());
      preview_url = 'https://' + self.$.goal_selector.selectedItem.goal_info.domain;
      if (this.preview_url != null && this.preview_url.length > 0) {
        preview_url = this.preview_url;
        if (!(preview_url.startsWith('https://') || preview_url.startsWith('http://'))) {
          self.$$('#hint').innerHTML = 'Preview URL must start with either http:// or https://';
          return;
        }
      }
      if (self.current_intervention !== '') {
        if (all_interventions.indexOf(proposed_intervention_name) !== all_interventions.indexOf(this.current_intervention) && all_interventions.indexOf(proposed_intervention_name) !== -1) {
          self.$$('#hint').innerHTML = 'A nudge with this name already exists';
          return;
        }
        self.fire('modify_intervention_info', {
          old_intervention_name: self.current_intervention,
          new_intervention_name: proposed_intervention_name,
          new_goal_info: self.$.goal_selector.selectedItem.goal_info,
          new_intervention_description: self.$.intervention_description.value,
          new_preview: preview_url
        });
        self.current_intervention = '';
      } else {
        if (all_interventions.indexOf(proposed_intervention_name) !== -1) {
          self.$$('#hint').innerHTML = 'A nudge with this name already exists';
          return;
        }
        console.log('create new intervention mode');
        self.fire('display_new_intervention', {
          goal_info: self.$.goal_selector.selectedItem.goal_info,
          intervention_name: proposed_intervention_name,
          intervention_description: self.$.intervention_description.value,
          preview_url: preview_url
        });
      }
      return self.$$('#create_new_intervention_dialog').close();
    },
    goToTab: function(){
      return chrome.tabs.getAllInWindow(undefined, function(tabs){
        var i$, to$, i;
        for (i$ = 0, to$ = tabs.length - 1; i$ <= to$; ++i$) {
          i = i$;
          if (tabs[i].url === chrome.extension.getURL('index.html?tag=intervention-editor')) {
            chrome.tabs.update(tabs[i].id, {
              selected: true
            });
            console.log('tab update ' + i);
            return;
          }
        }
        chrome.tabs.create({
          url: chrome.extension.getURL('index.html?tag=intervention-editor')
        });
      });
    },
    open_intervention_clicked: async function(){
      this.fire('display_intervention', {
        intervention_name: this.$.intervention_selector.selectedItem.intervention_name
      });
      return this.$$('#open_existing_custom_intervention').close();
    },
    goal_selector_changed: function(change_info){
      var goal_info, ref$;
      goal_info = change_info.detail.item.goal_info;
      return this.preview_url = (ref$ = goal_info.preview) != null
        ? ref$
        : (ref$ = goal_info.homepage) != null
          ? ref$
          : 'https://' + goal_info.domain;
    }
  });
}).call(this);
