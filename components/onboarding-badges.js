(function(){
  var ref$, get_interventions, get_intervention_info, get_enabled_interventions, list_generic_interventions, set_override_enabled_interventions_once, set_intervention_enabled, set_intervention_disabled, list_goal_info_for_enabled_goals, get_enabled_goals, get_goal_info, list_site_info_for_sites_for_which_goals_are_enabled, add_enable_custom_goal_reduce_time_on_domain, set_goal_enabled_manual, set_goal_disabled_manual, add_log_interventions, localstorage_getbool, polymer_ext, get_all_badges_earned_for_minutes_saved, get_time_saved_total, swal, Bounce, $;
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_intervention_info = ref$.get_intervention_info, get_enabled_interventions = ref$.get_enabled_interventions, list_generic_interventions = ref$.list_generic_interventions, set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once, set_intervention_enabled = ref$.set_intervention_enabled, set_intervention_disabled = ref$.set_intervention_disabled;
  list_goal_info_for_enabled_goals = require('libs_backend/goal_utils').list_goal_info_for_enabled_goals;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goal_info = ref$.get_goal_info, list_site_info_for_sites_for_which_goals_are_enabled = ref$.list_site_info_for_sites_for_which_goals_are_enabled, add_enable_custom_goal_reduce_time_on_domain = ref$.add_enable_custom_goal_reduce_time_on_domain, set_goal_enabled_manual = ref$.set_goal_enabled_manual, set_goal_disabled_manual = ref$.set_goal_disabled_manual;
  add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
  localstorage_getbool = require('libs_common/localstorage_utils').localstorage_getbool;
  localstorage_getbool = require('libs_common/localstorage_utils').localstorage_getbool;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  get_all_badges_earned_for_minutes_saved = require('libs_common/badges_utils').get_all_badges_earned_for_minutes_saved;
  get_time_saved_total = require('libs_common/gamification_utils').get_time_saved_total;
  swal = require('sweetalert2').swal;
  Bounce = require('bounce.js');
  $ = require('jquery');
  polymer_ext({
    is: 'onboarding-badges',
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
      },
      logo_glow_black_bubbles: {
        type: String,
        value: chrome.extension.getURL('icons/badges/habitlab_glow_black_bubbles.svg')
      },
      heart_empty_url: {
        type: String,
        value: chrome.extension.getURL('icons/badges/heart.svg')
      },
      generic_url: {
        type: String,
        value: chrome.extension.getURL('icons/generic_goal_icon.svg')
      },
      unlock_icon_url: {
        type: String,
        value: chrome.extension.getURL('icons/unlock.svg')
      },
      intervention: {
        type: Object,
        observer: 'intervention_property_changed'
      },
      goal_info_list: {
        type: Array
      },
      dialog_intervention: {
        type: Object
      },
      dialog_goal: {
        type: Object
      },
      interventions_info: {
        type: Array
      },
      intervention_name_to_info_map: {
        type: Object
      },
      enabled_goals_info_list: {
        type: Array
      },
      goal_intervention_info_list: {
        type: Array
      },
      generic_interventions: {
        type: Array
      },
      enabled_interventions_for_goal: {
        type: Array
      },
      goal_name_to_intervention_info_list: {
        type: Object
      },
      pill_button_idx: {
        type: Number,
        computed: 'get_pill_button_idx(enabled)'
      }
    },
    get_intervention_icon_url: function(intervention){
      var url_path;
      if (intervention.generic_intervention != null) {
        url_path = 'interventions/' + intervention.generic_intervention + '/icon.svg';
      } else {
        if (intervention.custom === true) {
          url_path = 'icons/custom_intervention_icon.svg';
        } else {
          url_path = 'interventions/' + intervention.name + '/icon.svg';
        }
      }
      return chrome.extension.getURL(url_path).toString();
    },
    get_enabled_interventions_for_goal_sync: function(goal_name, goal_name_to_intervention_info_list){
      return goal_name_to_intervention_info_list[goal_name];
    },
    distinct_interventions_exist: function(goal_name, goal_name_to_intervention_info_list){
      if (goal_name_to_intervention_info_list[goal_name] == null) {
        return false;
      }
      if (goal_name_to_intervention_info_list[goal_name].length < 1) {
        return false;
      }
      return true;
    },
    get_enabled_interventions_for_goal: async function(goal_name){
      var goal_info, all_interventions, enabled_interventions, output, i$, ref$, len$, intervention_name, intervention_info;
      goal_info = (await get_goal_info(goal_name));
      all_interventions = (await get_interventions());
      enabled_interventions = (await get_enabled_interventions());
      output = [];
      for (i$ = 0, len$ = (ref$ = goal_info.interventions).length; i$ < len$; ++i$) {
        intervention_name = ref$[i$];
        if (!enabled_interventions[intervention_name]) {
          continue;
        }
        intervention_info = all_interventions[intervention_name];
        if (intervention_info.generic_intervention != null) {
          continue;
        }
        output.push(intervention_info);
      }
      return output;
    },
    compute_sitename: function(goal){
      return goal.sitename_printable;
    },
    openBy: async function(evt){
      var dialog_intervention, dialog_goal, enabled_interventions;
      dialog_intervention = evt.target.intervention_info;
      if (evt.target.goal_info != null) {
        dialog_goal = evt.target.goal_info;
      } else {
        dialog_goal = 0;
      }
      this.dialog_intervention = dialog_intervention;
      this.dialog_goal = dialog_goal;
      enabled_interventions = (await get_enabled_interventions());
      this.enabled = enabled_interventions[dialog_intervention.name];
      this.$$('#alignedDialog').open();
    },
    pill_button_selected: async function(evt){
      var buttonidx, prev_enabled_interventions;
      buttonidx = evt.detail.buttonidx;
      if (buttonidx === 1) {
        this.enabled = true;
        prev_enabled_interventions = (await get_enabled_interventions());
        (await set_intervention_enabled(this.dialog_intervention.name));
        return add_log_interventions({
          type: 'intervention_set_smartly_managed',
          manual: true,
          intervention_name: this.dialog_intervention.name,
          prev_enabled_interventions: prev_enabled_interventions
        });
      } else if (buttonidx === 0) {
        this.enabled = false;
        prev_enabled_interventions = (await get_enabled_interventions());
        (await set_intervention_disabled(this.dialog_intervention.name));
        return add_log_interventions({
          type: 'intervention_set_always_disabled',
          manual: true,
          intervention_name: this.dialog_intervention.name,
          prev_enabled_interventions: prev_enabled_interventions
        });
      }
    },
    get_pill_button_idx: function(enabled){
      if (enabled) {
        return 1;
      } else {
        return 0;
      }
    }
    /*
    get_dropdown_idx: (automatic, enabled) ->
      if !automatic
        if enabled
          return 1
        else
          return 2
      return 0
    */,
    preview_intervention: async function(){
      var intervention_name, enabled_goal_names, facebook_enabled, reddit_enabled, preview_page, ref$, intervention_info, goal_info, this$ = this;
      intervention_name = this.dialog_intervention.name;
      enabled_goal_names = this.enabled_goals_info_list.map(function(it){
        return it.name;
      });
      facebook_enabled = enabled_goal_names.includes('facebook/spend_less_time');
      reddit_enabled = enabled_goal_names.includes('reddit/spend_less_time');
      preview_page = (ref$ = this.dialog_goal.preview) != null
        ? ref$
        : (ref$ = this.dialog_intervention.preview) != null
          ? ref$
          : 'https://' + this.dialog_goal.domain;
      if (intervention_name.startsWith('generic/')) {
        if (facebook_enabled && !reddit_enabled) {
          intervention_name = intervention_name.replace('generic/', 'facebook/');
        } else {
          intervention_name = intervention_name.replace('generic/', 'reddit/');
        }
        intervention_info = (await get_intervention_info(intervention_name));
        goal_info = (await get_goal_info(intervention_info.goals[0]));
        set_override_enabled_interventions_once(intervention_name);
        preview_page = (ref$ = goal_info.preview) != null
          ? ref$
          : 'https://' + goal_info.domain;
      } else {
        set_override_enabled_interventions_once(intervention_name);
      }
      return chrome.tabs.create({
        url: preview_page
      });
    },
    rerender: async function(){
      var ref$, enabled_goals_info_list, generic_interventions, all_interventions, enabled_interventions, generic_interventions_info, i$, len$, x, info, goal_name_to_intervention_info_list, goal_info, intervention_info_list_for_goal, j$, len1$, intervention_name, intervention_info;
      ref$ = (await Promise.all([list_goal_info_for_enabled_goals(), list_generic_interventions(), get_interventions(), get_enabled_interventions()])), enabled_goals_info_list = ref$[0], generic_interventions = ref$[1], all_interventions = ref$[2], enabled_interventions = ref$[3];
      generic_interventions_info = [];
      for (i$ = 0, len$ = generic_interventions.length; i$ < len$; ++i$) {
        x = generic_interventions[i$];
        info = all_interventions[x];
        generic_interventions_info.push(info);
      }
      this.generic_interventions_info = generic_interventions_info;
      goal_name_to_intervention_info_list = [];
      for (i$ = 0, len$ = enabled_goals_info_list.length; i$ < len$; ++i$) {
        goal_info = enabled_goals_info_list[i$];
        intervention_info_list_for_goal = [];
        for (j$ = 0, len1$ = (ref$ = goal_info.interventions).length; j$ < len1$; ++j$) {
          intervention_name = ref$[j$];
          intervention_info = all_interventions[intervention_name];
          if (intervention_info.generic_intervention != null) {
            continue;
          }
          intervention_info_list_for_goal.push(intervention_info);
        }
        goal_name_to_intervention_info_list[goal_info.name] = intervention_info_list_for_goal;
      }
      this.goal_name_to_intervention_info_list = goal_name_to_intervention_info_list;
      enabled_goals_info_list.sort(function(a, b){
        var intervention_info_list_a, intervention_info_list_b, num_interventions_a, ref$, num_interventions_b;
        intervention_info_list_a = goal_name_to_intervention_info_list[a.name];
        intervention_info_list_b = goal_name_to_intervention_info_list[b.name];
        num_interventions_a = (ref$ = intervention_info_list_a.length) != null ? ref$ : 0;
        num_interventions_b = (ref$ = intervention_info_list_b.length) != null ? ref$ : 0;
        return num_interventions_b - num_interventions_a;
      });
      return this.enabled_goals_info_list = enabled_goals_info_list;
    },
    ready: async function(){
      return this.rerender();
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        return this.minutes_saved = 300;
      }
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['SM', 'S', 'once_available', 'first_elem']
  });
}).call(this);
