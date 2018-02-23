(function(){
  var prelude, $, swal, load_css_file, ref$, get_enabled_goals, get_goals, get_spend_more_time_goals, set_goal_target, get_goal_target, remove_custom_goal_and_generated_interventions, add_enable_custom_goal_reduce_time_on_domain, add_enable_custom_goal_increase_time_on_domain, set_goal_enabled_manual, set_goal_disabled_manual, get_interventions, get_enabled_interventions, set_intervention_disabled, enable_interventions_because_goal_was_enabled, get_baseline_time_on_domains, list_all_domains_in_history, add_log_interventions, url_to_domain, get_canonical_domain, get_favicon_data_for_domain_cached, promise_all_object, msg, polymer_ext;
  prelude = require('prelude-ls');
  $ = require('jquery');
  swal = require('sweetalert2');
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals, get_spend_more_time_goals = ref$.get_spend_more_time_goals, set_goal_target = ref$.set_goal_target, get_goal_target = ref$.get_goal_target, remove_custom_goal_and_generated_interventions = ref$.remove_custom_goal_and_generated_interventions, add_enable_custom_goal_reduce_time_on_domain = ref$.add_enable_custom_goal_reduce_time_on_domain, add_enable_custom_goal_increase_time_on_domain = ref$.add_enable_custom_goal_increase_time_on_domain, set_goal_enabled_manual = ref$.set_goal_enabled_manual, set_goal_disabled_manual = ref$.set_goal_disabled_manual;
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_enabled_interventions = ref$.get_enabled_interventions, set_intervention_disabled = ref$.set_intervention_disabled;
  enable_interventions_because_goal_was_enabled = require('libs_backend/intervention_manager').enable_interventions_because_goal_was_enabled;
  ref$ = require('libs_backend/history_utils'), get_baseline_time_on_domains = ref$.get_baseline_time_on_domains, list_all_domains_in_history = ref$.list_all_domains_in_history;
  add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  get_canonical_domain = require('libs_backend/canonical_url_utils').get_canonical_domain;
  get_favicon_data_for_domain_cached = require('libs_backend/favicon_utils').get_favicon_data_for_domain_cached;
  promise_all_object = require('libs_common/promise_utils').promise_all_object;
  msg = require('libs_common/localization_utils').msg;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  polymer_ext({
    is: 'positive-goal-selector',
    properties: {
      sites_and_goals: {
        type: Array,
        value: []
      },
      suggested_sites: {
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
      },
      title: {
        type: String,
        value: msg("What sites would you like to use more?")
      },
      num_per_line: {
        type: Number,
        value: 4
      },
      icon_check_url: {
        type: String,
        value: chrome.extension.getURL('icons/icon_check_bluewhite.png')
      },
      icon_gear_url: {
        type: String,
        value: chrome.extension.getURL('icons/icon_gear_bluewhite.png')
      },
      icon_add_url: {
        type: String,
        value: chrome.extension.getURL('icons/plus.png')
      },
      delete_url: {
        type: String,
        value: chrome.extension.getURL('icons/delete.svg')
      },
      configure_url: {
        type: String,
        value: chrome.extension.getURL('icons/configure.svg')
      },
      baseline_time_on_domains: {
        type: Object
      },
      goal_name_to_icon: {
        type: Object,
        value: {}
      },
      is_onboarding: {
        type: Boolean,
        value: false
      }
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        this.set_sites_and_goals();
        return document.body.style.backgroundColor = 'white';
      }
    },
    get_time_spent_for_domain: function(domain, baseline_time_on_domains){
      var minutes;
      if (baseline_time_on_domains[domain] != null) {
        minutes = baseline_time_on_domains[domain] / (1000 * 60);
        return minutes.toPrecision(2) + ' mins';
      }
      return '0 mins';
    },
    limit_to_eight: function(list){
      return [list[0], list[1], list[2], list[3], list[4], list[5], list[6], list[7]];
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
    get_daily_targets: async function(){
      var goals, i$, ref$, len$, goal, mins, results$ = [];
      goals = (await get_goals());
      for (i$ = 0, len$ = (ref$ = Object.keys(goals)).length; i$ < len$; ++i$) {
        goal = ref$[i$];
        if (goal === "debug/all_interventions") {
          continue;
        }
        mins = (await get_goal_target(goal));
        mins = mins / 5 - 1;
        results$.push(this.index_of_daily_goal_mins[goal] = mins);
      }
      return results$;
    },
    show_internal_names_of_goals: function(){
      return localStorage.getItem('intervention_view_show_internal_names') === 'true';
    },
    daily_goal_help_clicked: function(){
      return swal({
        title: 'How will HabitLab help me use these more?',
        text: 'With variety of different nudges and helpers, such as putting your next Duolingo lesson in the YouTube sidebar when an ad is running, or putting a friendly reminder in the Facebook news feed to go to the site of your choice.'
      });
    },
    openBy: function(evt){
      this.$.alignedDialog.positionTarget = evt.target;
      this.$.alignedDialog.open();
    }
    /*open_feedback_form: ->>
        feedback_form = document.createElement('feedback-form')
        feedback_form.screenshot = this.screenshot
        feedback_form.other = this.other
        this.$$('#intervention_info_dialog').close()
        document.body.appendChild(feedback_form)
        feedback_form.open()
    }*/,
    add_website_input: function(evt){},
    valueChange: function(evt){
      var domain;
      domain = this.$$('#add_website_input').value.trim();
      this.add_custom_website_from_input();
    },
    settings_goal_clicked: function(evt){
      var newtab;
      evt.preventDefault();
      evt.stopPropagation();
      newtab = evt.target.sitename.toLowerCase();
      return this.fire('need_tab_change', {
        newtab: newtab
      });
    },
    get_icon_for_goal: function(goal, goal_name_to_icon){
      if (goal.icon != null) {
        return goal.icon;
      }
      if (goal_name_to_icon[goal.name] != null) {
        return goal_name_to_icon[goal.name];
      }
      return chrome.extension.getURL('icons/loading.gif');
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
      var self, ref$, goal_name_to_info, enabled_goals, sitename_to_goals, goal_name, goal_info, sitename, list_of_sites_and_goals, list_of_sites, i$, len$, current_item, j$, len1$, goal, this$ = this;
      self = this;
      ref$ = (await Promise.all([get_goals(), get_enabled_goals()])), goal_name_to_info = ref$[0], enabled_goals = ref$[1];
      sitename_to_goals = {};
      for (goal_name in goal_name_to_info) {
        goal_info = goal_name_to_info[goal_name];
        if (goal_name === 'debug/all_interventions' && localStorage.getItem('intervention_view_show_debug_all_interventions_goal') !== 'true') {
          continue;
        }
        if (!goal_info.is_positive) {
          continue;
        }
        sitename = goal_info.sitename_printable;
        if (sitename_to_goals[sitename] == null) {
          sitename_to_goals[sitename] = [];
        }
        sitename_to_goals[sitename].push(goal_info);
      }
      list_of_sites_and_goals = [];
      list_of_sites = prelude.sort(Object.keys(sitename_to_goals));
      for (i$ = 0, len$ = list_of_sites.length; i$ < len$; ++i$) {
        sitename = list_of_sites[i$];
        current_item = {
          sitename: sitename
        };
        current_item.goals = prelude.sortBy(fn$, sitename_to_goals[sitename]);
        for (j$ = 0, len1$ = (ref$ = current_item.goals).length; j$ < len1$; ++j$) {
          goal = ref$[j$];
          goal.enabled = enabled_goals[goal.name] === true;
        }
        list_of_sites_and_goals.push(current_item);
      }
      self.sites_and_goals = list_of_sites_and_goals;
      (async function(){
        var goal_name_to_icon_changed, goal_name_to_new_icon_promises, i$, ref$, len$, sitename_and_goals, j$, ref1$, len1$, goal_info, goal_name_to_new_icons, goal_name, icon;
        goal_name_to_icon_changed = false;
        goal_name_to_new_icon_promises = {};
        for (i$ = 0, len$ = (ref$ = list_of_sites_and_goals).length; i$ < len$; ++i$) {
          sitename_and_goals = ref$[i$];
          for (j$ = 0, len1$ = (ref1$ = sitename_and_goals.goals).length; j$ < len1$; ++j$) {
            goal_info = ref1$[j$];
            if (goal_info.icon == null) {
              goal_name_to_new_icon_promises[goal_info.name] = get_favicon_data_for_domain_cached(goal_info.domain);
              goal_name_to_icon_changed = true;
            }
          }
        }
        if (goal_name_to_icon_changed) {
          goal_name_to_new_icons = (await promise_all_object(goal_name_to_new_icon_promises));
          for (goal_name in goal_name_to_new_icons) {
            icon = goal_name_to_new_icons[goal_name];
            if (icon == null) {
              icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
            }
            self.goal_name_to_icon[goal_name] = icon;
          }
          self.goal_name_to_icon = JSON.parse(JSON.stringify(self.goal_name_to_icon));
        }
      })();
      function fn$(it){
        return it.name;
      }
    }
    /*add_custom: (evt) ->
    console.log 'add custom site.'*/,
    image_clicked: async function(evt){
      var goal_name, checked, self, check_if_first_goal;
      goal_name = evt.target.goalname;
      checked = evt.target.checked;
      self = this;
      if (!checked) {
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
    should_have_newline: function(index, num_per_line){
      return index % num_per_line === 0;
    },
    sort_custom_sites_after_and_limit_to_eight: function(sites_and_goals){
      var ref$;
      return [(ref$ = this.sort_custom_sites_after(sites_and_goals))[0], ref$[1], ref$[2], ref$[3], ref$[4], ref$[5], ref$[6], ref$[7]];
    },
    sort_custom_sites_after: function(sites_and_goals){
      var ref$, custom_sites_and_goals, normal_sites_and_goals;
      ref$ = prelude.partition(function(it){
        var this$ = this;
        return it.goals.filter(function(it){
          return it.custom;
        }).length > 0;
      }, sites_and_goals), custom_sites_and_goals = ref$[0], normal_sites_and_goals = ref$[1];
      return normal_sites_and_goals.concat(custom_sites_and_goals);
    },
    add_goal_clicked: function(evt){
      this.add_custom_website_from_input();
    },
    configure_clicked: function(evt){
      var newtab, goal_description, is_enabled;
      newtab = evt.target.sitename_printable.toLowerCase();
      goal_description = evt.target.goal_description;
      is_enabled = evt.target.is_enabled;
      if (!is_enabled) {
        swal({
          title: 'Enable goal to configure it',
          html: $('<div>').append([$('<div>').text('Please enable the goal:'), $('<div>').text(goal_description)])
        });
        return;
      }
      return this.fire('need_tab_change', {
        newtab: newtab
      });
    },
    remove_clicked: async function(evt){
      var goal_name, is_custom, goal_description;
      goal_name = evt.target.goal_name;
      is_custom = evt.target.is_custom;
      if (is_custom) {
        (await remove_custom_goal_and_generated_interventions(goal_name));
        (await this.set_sites_and_goals());
        this.fire('need_rerender', {});
        return;
      }
      goal_description = evt.target.goal_description;
      swal({
        title: 'Built-in goal disabled but not removed',
        html: $('<div>').append([$('<div>').text('The goal you selected is built-in, so it has been disabled, but not removed:'), $('<div>').text(goal_description)])
      });
      (await set_goal_disabled_manual(goal_name));
      (await this.set_sites_and_goals());
      return this.fire('need_rerender', {});
    },
    add_custom_website_from_input: async function(){
      var domain, canonical_domain, goal_name;
      domain = url_to_domain(this.$$('#add_website_input').value.trim());
      if (domain.length === 0) {
        return;
      }
      canonical_domain = domain;
      goal_name = (await add_enable_custom_goal_increase_time_on_domain(domain));
      (await this.set_sites_and_goals());
      this.fire('need_rerender', {});
    },
    repaint_due_to_resize_once_in_view: function(){
      var self, leftmost, rightmost, rightmost_without_width, i$, ref$, len$, icon, width, left, right;
      self = this;
      leftmost = null;
      rightmost = null;
      rightmost_without_width = null;
      for (i$ = 0, len$ = (ref$ = this.SM('.siteicon')).length; i$ < len$; ++i$) {
        icon = ref$[i$];
        width = $(icon).width();
        left = $(icon).offset().left;
        right = left + width;
        if (leftmost === null || left < leftmost) {
          leftmost = left;
        }
        if (rightmost === null || right > rightmost) {
          rightmost = right;
        }
        if (rightmost_without_width === null || left > rightmost_without_width) {
          rightmost_without_width = left;
        }
      }
      if (leftmost === rightmost_without_width && rightmost_without_width === 0) {
        return setTimeout(function(){
          return self.repaint_due_to_resize_once_in_view();
        }, 100);
      } else {
        return self.repaint_due_to_resize();
      }
    },
    repaint_due_to_resize: function(){
      var self, leftmost, rightmost, rightmost_without_width, i$, ref$, len$, icon, width, left, right, total_width, margin_needed, parent_offset, orig_offset;
      self = this;
      leftmost = null;
      rightmost = null;
      rightmost_without_width = null;
      for (i$ = 0, len$ = (ref$ = this.SM('.siteicon')).length; i$ < len$; ++i$) {
        icon = ref$[i$];
        width = $(icon).width();
        left = $(icon).offset().left;
        right = left + width;
        if (leftmost === null || left < leftmost) {
          leftmost = left;
        }
        if (rightmost === null || right > rightmost) {
          rightmost = right;
        }
        if (rightmost_without_width === null || left > rightmost_without_width) {
          rightmost_without_width = left;
        }
      }
      if (leftmost === rightmost_without_width && rightmost_without_width === 0) {
        return;
      }
      total_width = $(self).width();
      margin_needed = (total_width - (rightmost - leftmost)) / 2 - 15;
      parent_offset = $(self).offset();
      orig_offset = this.S('.flexcontainer').offset();
      return this.S('.flexcontainer').offset({
        left: margin_needed + parent_offset.left,
        top: orig_offset.top
      });
    },
    attached: async function(){
      var self;
      self = this;
      load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
      self.on_resize('#outer_wrapper', function(){
        return self.repaint_due_to_resize();
      });
      (async function(){
        return self.baseline_time_on_domains_array = (await list_all_domains_in_history());
      })();
      (async function(){
        return self.baseline_time_on_domains = (await get_baseline_time_on_domains());
      })();
      return self.once_available('.siteiconregular', function(){
        return self.repaint_due_to_resize();
      });
    }
  }, [
    {
      source: require('libs_common/localization_utils'),
      methods: ['msg']
    }, {
      source: require('libs_frontend/polymer_methods'),
      methods: ['text_if', 'once_available', 'S', 'SM']
    }, {
      source: require('libs_frontend/polymer_methods_resize'),
      methods: ['on_resize']
    }
  ]);
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
