(function(){
  var prelude, swal, load_css_file, ref$, get_enabled_goals, get_goals, set_goal_target, get_all_goal_targets, remove_custom_goal_and_generated_interventions, add_enable_custom_goal_reduce_time_on_domain, set_goal_enabled_manual, set_goal_disabled_manual, getDb, get_interventions, get_enabled_interventions, set_intervention_disabled, enable_interventions_because_goal_was_enabled, add_log_interventions, url_to_domain, get_canonical_domain, polymer_ext;
  prelude = require('prelude-ls');
  swal = require('sweetalert2');
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals, set_goal_target = ref$.set_goal_target, get_all_goal_targets = ref$.get_all_goal_targets, remove_custom_goal_and_generated_interventions = ref$.remove_custom_goal_and_generated_interventions, add_enable_custom_goal_reduce_time_on_domain = ref$.add_enable_custom_goal_reduce_time_on_domain, set_goal_enabled_manual = ref$.set_goal_enabled_manual, set_goal_disabled_manual = ref$.set_goal_disabled_manual;
  getDb = require('libs_backend/db_utils').getDb;
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_enabled_interventions = ref$.get_enabled_interventions, set_intervention_disabled = ref$.set_intervention_disabled;
  enable_interventions_because_goal_was_enabled = require('libs_backend/intervention_manager').enable_interventions_because_goal_was_enabled;
  add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  get_canonical_domain = require('libs_backend/canonical_url_utils').get_canonical_domain;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  polymer_ext({
    is: 'goal-selector',
    properties: {
      sites_and_spend_less_time_goals: {
        type: Array,
        value: []
      },
      sites_and_spend_more_time_goals: {
        type: Array,
        value: []
      },
      daily_goal_values: {
        type: Array,
        value: ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "25 minutes", "30 minutes", "35 minutes", "40 minutes", "45 minutes", "50 minutes", "55 minutes", "60 minutes"]
      },
      index_of_daily_goal_mins: {
        type: Object,
        value: {}
      },
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      }
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        this.set_sites_and_goals();
        return document.body.style.backgroundColor = 'white';
      }
    },
    delete_goal_clicked: async function(evt){
      var goal_name;
      goal_name = evt.target.goal_name;
      (await remove_custom_goal_and_generated_interventions(goal_name));
      (await this.set_sites_and_goals());
      return this.fire('need_rerender', {});
    },
    disable_interventions_which_do_not_satisfy_any_goals: async function(goal_name){
      var enabled_goals, enabled_interventions, all_interventions, interventions_to_disable, intervention_name, intervention_enabled, intervention_info, intervention_satisfies_an_enabled_goal, i$, ref$, len$, prev_enabled_interventions;
      enabled_goals = (await get_enabled_goals());
      enabled_interventions = (await get_enabled_interventions());
      all_interventions = (await get_interventions());
      interventions_to_disable = [];
      for (intervention_name in enabled_interventions) {
        intervention_enabled = enabled_interventions[intervention_name];
        if (!intervention_enabled) {
          continue;
        }
        intervention_info = all_interventions[intervention_name];
        intervention_satisfies_an_enabled_goal = false;
        for (i$ = 0, len$ = (ref$ = intervention_info.goals).length; i$ < len$; ++i$) {
          goal_name = ref$[i$];
          if (enabled_goals[goal_name]) {
            intervention_satisfies_an_enabled_goal = true;
          }
        }
        if (!intervention_satisfies_an_enabled_goal) {
          interventions_to_disable.push(intervention_name);
        }
      }
      prev_enabled_interventions = import$({}, enabled_interventions);
      for (i$ = 0, len$ = interventions_to_disable.length; i$ < len$; ++i$) {
        intervention_name = interventions_to_disable[i$];
        (await set_intervention_disabled(intervention_name));
      }
      if (interventions_to_disable.length > 0) {
        return add_log_interventions({
          type: 'interventions_disabled_due_to_user_disabling_goal',
          manual: false,
          goal_name: goal_name,
          interventions_list: interventions_to_disable,
          prev_enabled_interventions: prev_enabled_interventions
        });
      }
    },
    time_updated: async function(evt, obj){
      var mins;
      mins = Number(obj.item.innerText.trim(' ').split(' ')[0]);
      return set_goal_target(obj.item['class'], mins);
    },
    goal_number_updated: async function(evt, obj){
      var num;
      num = Number(obj.item.innerText.trim(' ').split(' ')[0]);
      return set_goal_target(obj.item['class'], num);
    },
    get_daily_targets: async function(){
      var goal_targets, index_of_daily_goal_mins, goal_name, goal_target, mins;
      goal_targets = (await get_all_goal_targets());
      index_of_daily_goal_mins = {};
      for (goal_name in goal_targets) {
        goal_target = goal_targets[goal_name];
        if (goal_name === "debug/all_interventions") {
          continue;
        }
        mins = goal_targets[goal_name];
        mins = mins / 5 - 1;
        index_of_daily_goal_mins[goal_name] = mins;
      }
      return index_of_daily_goal_mins;
    },
    show_internal_names_of_goals: function(){
      return localStorage.getItem('intervention_view_show_internal_names') === 'true';
    },
    daily_goal_help_clicked: function(){
      return swal({
        title: 'How are Daily Goals used?',
        text: 'Your daily goal is used only to display your progress. If you exceed your daily goal, HabitLab will continue to show nudges as usual (it will not block the site).'
      });
    },
    settings_goal_clicked: function(evt){
      var newtab;
      evt.preventDefault();
      evt.stopPropagation();
      newtab = evt.target.sitename;
      return this.fire('need_tab_change', {
        newtab: newtab
      });
    },
    is_goal_shown: function(goal){
      if (goal.hidden && localStorage.getItem('show_hidden_goals_and_interventions') !== 'true') {
        return false;
      }
      if (goal.beta && localStorage.getItem('show_beta_goals_and_interventions') !== 'true') {
        return false;
      }
      return true;
    },
    set_sites_and_goals: async function(){
      var self, ref$, goal_name_to_info, enabled_goals, sitename_to_goals, goal_name, goal_info, sitename, list_of_sites_and_spend_less_time_goals, list_of_sites_and_spend_more_time_goals, list_of_sites, i$, len$, current_item, positive_site, j$, len1$, goal, this$ = this;
      self = this;
      ref$ = (await Promise.all([get_goals(), get_enabled_goals()])), goal_name_to_info = ref$[0], enabled_goals = ref$[1];
      sitename_to_goals = {};
      for (goal_name in goal_name_to_info) {
        goal_info = goal_name_to_info[goal_name];
        if (goal_name === 'debug/all_interventions' && localStorage.getItem('intervention_view_show_debug_all_interventions_goal') !== 'true') {
          continue;
        }
        sitename = goal_info.sitename_printable;
        if (sitename_to_goals[sitename] == null) {
          sitename_to_goals[sitename] = [];
        }
        sitename_to_goals[sitename].push(goal_info);
      }
      list_of_sites_and_spend_less_time_goals = [];
      list_of_sites_and_spend_more_time_goals = [];
      list_of_sites = prelude.sort(Object.keys(sitename_to_goals));
      for (i$ = 0, len$ = list_of_sites.length; i$ < len$; ++i$) {
        sitename = list_of_sites[i$];
        current_item = {
          sitename: sitename
        };
        current_item.goals = prelude.sortBy(fn$, sitename_to_goals[sitename]);
        positive_site = false;
        for (j$ = 0, len1$ = (ref$ = current_item.goals).length; j$ < len1$; ++j$) {
          goal = ref$[j$];
          goal.enabled = enabled_goals[goal.name] === true;
          if (goal.is_positive === true) {
            positive_site = true;
          }
        }
        if (!positive_site) {
          list_of_sites_and_spend_less_time_goals.push(current_item);
        } else {
          list_of_sites_and_spend_more_time_goals.push(current_item);
        }
      }
      self.sites_and_spend_less_time_goals = list_of_sites_and_spend_less_time_goals;
      return self.sites_and_spend_more_time_goals = list_of_sites_and_spend_more_time_goals;
      function fn$(it){
        return it.name;
      }
    },
    goal_changed: async function(evt){
      var checked, goal_name, self, check_if_first_goal;
      checked = evt.target.checked;
      goal_name = evt.target.goal.name;
      self = this;
      if (checked) {
        (await set_goal_enabled_manual(goal_name));
        check_if_first_goal = async function(){
          if (localStorage.first_goal == null) {
            return localStorage.first_goal = 'has enabled a goal before';
          }
        };
        check_if_first_goal();
      } else {
        (await set_goal_disabled_manual(goal_name));
      }
      (await self.set_sites_and_goals());
      return self.fire('goal_changed', {
        goal_name: goal_name
      });
    },
    sort_custom_sites_after: function(sites_and_spend_less_time_goals){
      var ref$, custom_sites_and_spend_less_time_goals, normal_sites_and_spend_less_time_goals;
      ref$ = prelude.partition(function(it){
        var this$ = this;
        return it.goals.filter(function(it){
          return it.custom;
        }).length > 0;
      }, sites_and_spend_less_time_goals), custom_sites_and_spend_less_time_goals = ref$[0], normal_sites_and_spend_less_time_goals = ref$[1];
      return normal_sites_and_spend_less_time_goals.concat(custom_sites_and_spend_less_time_goals);
    },
    add_goal_clicked: function(evt){
      this.add_custom_website_from_input();
    },
    add_website_input_keydown: function(evt){
      if (evt.keyCode === 13) {
        this.add_custom_website_from_input();
      }
    },
    add_custom_website_from_input: async function(){
      var domain, canonical_domain, escape_as_html, all_goals, goal_name, goal_info;
      domain = url_to_domain(this.$$('#add_website_input').value.trim());
      if (domain.length === 0) {
        return;
      }
      this.$$('#add_website_input').value = '';
      canonical_domain = (await get_canonical_domain(domain));
      if (canonical_domain == null) {
        escape_as_html = require('libs_common/html_utils').escape_as_html;
        swal({
          title: 'Invalid Domain',
          html: '<div>\n  <div>You entered an invalid domain: ' + escape_as_html(domain) + '</div>\n  <div>Please enter a valid domain such as www.amazon.com</div>\n</div>',
          type: 'error'
        });
        return;
      }
      all_goals = (await get_goals());
      for (goal_name in all_goals) {
        goal_info = all_goals[goal_name];
        if (domain === goal_info.domain || canonical_domain === goal_info.domain) {
          (await set_goal_enabled_manual(goal_name));
          (await this.set_sites_and_goals());
          this.fire('need_rerender', {});
          return;
        }
      }
      if (domain !== canonical_domain && domain.replace('www.', '') !== canonical_domain && canonical_domain.replace('www.', '') !== domain) {
        (await add_enable_custom_goal_reduce_time_on_domain(domain));
      }
      (await add_enable_custom_goal_reduce_time_on_domain(canonical_domain));
      (await this.set_sites_and_goals());
      this.fire('need_rerender', {});
    },
    ready: async function(){
      this.start_time = Date.now();
      return load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
    }
  }, {
    source: require('libs_common/localization_utils'),
    methods: ['msg']
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
