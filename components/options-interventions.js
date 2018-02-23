(function(){
  var prelude, ref$, get_interventions, get_enabled_interventions, get_manually_managed_interventions, set_intervention_enabled, set_intervention_disabled, set_intervention_automatically_managed, set_intervention_manually_managed, set_override_enabled_interventions_once, get_and_set_new_enabled_interventions_for_today, enable_interventions_because_goal_was_enabled, get_enabled_goals, get_goals, set_goal_enabled_manual, set_goal_disabled_manual, set_goal_target, get_goal_target, remove_custom_goal_and_generated_interventions, as_array, add_log_interventions, url_to_domain, get_canonical_domain, load_css_file, polymer_ext, swal;
  prelude = require('prelude-ls');
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_enabled_interventions = ref$.get_enabled_interventions, get_manually_managed_interventions = ref$.get_manually_managed_interventions, set_intervention_enabled = ref$.set_intervention_enabled, set_intervention_disabled = ref$.set_intervention_disabled, set_intervention_automatically_managed = ref$.set_intervention_automatically_managed, set_intervention_manually_managed = ref$.set_intervention_manually_managed, set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once;
  ref$ = require('libs_backend/intervention_manager'), get_and_set_new_enabled_interventions_for_today = ref$.get_and_set_new_enabled_interventions_for_today, enable_interventions_because_goal_was_enabled = ref$.enable_interventions_because_goal_was_enabled;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals, set_goal_enabled_manual = ref$.set_goal_enabled_manual, set_goal_disabled_manual = ref$.set_goal_disabled_manual, set_goal_target = ref$.set_goal_target, get_goal_target = ref$.get_goal_target, remove_custom_goal_and_generated_interventions = ref$.remove_custom_goal_and_generated_interventions;
  as_array = require('libs_common/collection_utils').as_array;
  add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  get_canonical_domain = require('libs_backend/canonical_url_utils').get_canonical_domain;
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  swal = require('sweetalert2');
  polymer_ext({
    is: 'options-interventions',
    properties: {
      enabled_goals: {
        type: Array,
        value: {}
      },
      start_time_string: {
        type: String,
        value: localStorage.start_as_string ? localStorage.start_as_string : '9:00 AM'
      },
      end_time_string: {
        type: String,
        value: localStorage.end_as_string ? localStorage.end_as_string : '5:00 PM'
      },
      start_time_mins: {
        type: Number,
        value: localStorage.start_mins_since_midnight ? parseInt(localStorage.start_mins_since_midnight) : 540
      },
      end_time_mins: {
        type: Number,
        value: localStorage.end_mins_since_midnight ? parseInt(localStorage.end_mins_since_midnight) : 1020
      },
      activedaysarray: {
        type: Array,
        value: localStorage.activedaysarray != null
          ? JSON.parse(localStorage.activedaysarray)
          : [0, 1, 2, 3, 4, 5, 6]
      },
      always_active: {
        type: Boolean,
        value: localStorage.work_hours_only !== "true"
      },
      days: {
        type: Array,
        value: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
      },
      seen_tutorial: {
        type: Boolean,
        value: localStorage.seen_tutorial !== "true"
      },
      popup_view_has_been_opened: {
        type: Boolean,
        value: localStorage.popup_view_has_been_opened === 'true'
      }
    },
    select_new_interventions: function(evt){
      var self;
      self = this;
      self.goals_and_interventions = [];
      return get_and_set_new_enabled_interventions_for_today(function(){
        return self.rerender();
      });
    },
    on_goal_changed: function(evt){
      return this.rerender();
    },
    is_active_for_day_idx: function(dayidx, activedaysarray){
      console.log('called is_active_for_day_idx');
      console.log(dayidx);
      console.log(activedaysarray);
      return activedaysarray.includes(dayidx);
    },
    change_intervention_activeness: function(evt){
      var day_index;
      console.log(evt.target);
      console.log('change_intervention_activeness called');
      console.log(evt.target.dataDay);
      localStorage.work_hours_only = true;
      day_index = evt.target.dataDay;
      console.log('day_index is');
      console.log(day_index);
      console.log('id attriute is');
      console.log(evt.target.isdayenabled);
      if (!evt.target.isdayenabled) {
        this.activedaysarray.push(day_index);
        this.activedaysarray = JSON.parse(JSON.stringify(this.activedaysarray));
        console.log(evt.target);
        localStorage.activedaysarray = JSON.stringify(this.activedaysarray);
        console.log(this.activedaysarray);
      } else {
        this.activedaysarray = this.activedaysarray.filter(function(it){
          return it !== day_index;
        });
        this.activedaysarray = JSON.parse(JSON.stringify(this.activedaysarray));
        console.log(evt.target);
        localStorage.activedaysarray = JSON.stringify(this.activedaysarray);
        console.log(this.activedaysarray);
      }
    },
    goals_set: function(evt){
      if (Object.keys(this.enabled_goals).length > 0) {
        evt.target.style.display = "none";
        return this.$$('#intro1').style.display = "block";
      }
    },
    intro1_read: function(evt){
      return evt.target.style.display = "none";
    },
    intro2_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    show_how_hl_works: function(evt){
      evt.target.style.display = "none";
      return this.$$('#how_hl_works').style.display = "block";
    },
    get_icon: function(){
      return chrome.extension.getURL('icons/icon_19.png');
    },
    intro3_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    intro4_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    intro5_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    show_swal: function(){
      this.$$('#popup-button').style.display = 'none';
      swal({
        title: 'Tutorial Complete!',
        text: 'That\'s all you need to know to start using HabitLab. If you\'d like, you can configure more options and view the list of interventions for each goal at the bottom of this page.',
        type: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      this.$$('#configurations').style.display = "block";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    show_intro_button_clicked: function(){
      this.$$('#intro1_content').style.display = 'block';
      this.$$('#intro2').style.display = 'block';
      return this.$$('#intro4').style.display = 'block';
    },
    attached: function(){
      var i$, ref$, len$, elem, results$ = [];
      if (window.location.hash !== '#introduction') {
        for (i$ = 0, len$ = (ref$ = Polymer.dom(this.root).querySelectorAll('.intro')).length; i$ < len$; ++i$) {
          elem = ref$[i$];
          results$.push(elem.style.display = 'inline-flex');
        }
        return results$;
      }
    },
    ready: function(){
      this.rerender();
      return load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
    },
    show_randomize_button: function(){
      return localStorage.getItem('intervention_view_show_randomize_button') === 'true';
    },
    have_interventions_available: function(goals_and_interventions){
      return goals_and_interventions && goals_and_interventions.length > 0;
    },
    show_dialog: function(evt){
      if (evt.target.id === 'start-time') {
        return this.$$('#start-dialog').toggle();
      } else {
        return this.$$('#end-dialog').toggle();
      }
    },
    toggle_timepicker_idx: function(evt){
      var buttonidx;
      buttonidx = evt.detail.buttonidx;
      if (buttonidx === 1) {
        localStorage.work_hours_only = true;
        this.always_active = false;
        localStorage.start_mins_since_midnight = this.start_time_mins;
        localStorage.end_mins_since_midnight = this.end_time_mins;
        localStorage.start_as_string = this.start_time_string;
        return localStorage.end_as_string = this.end_time_string;
      } else {
        localStorage.work_hours_only = false;
        return this.always_active = true;
      }
    },
    toggle_timepicker: function(evt){
      if (evt.target.checked) {
        if (this.$$('paper-radio-group').selected === 'always') {
          localStorage.work_hours_only = true;
          this.always_active = false;
          localStorage.start_mins_since_midnight = this.start_time_mins;
          localStorage.end_mins_since_midnight = this.end_time_mins;
          localStorage.start_as_string = this.start_time_string;
          return localStorage.end_as_string = this.end_time_string;
        } else {
          localStorage.work_hours_only = false;
          return this.always_active = true;
        }
      }
    },
    dismiss_dialog: function(evt){
      console.log(evt);
      if (evt.detail.confirmed && this.$$('#end-picker').rawValue - this.$$('#start-picker').rawValue > 0) {
        if (evt.target.id === 'start-dialog') {
          this.start_time_string = this.$$('#start-picker').time;
          this.start_time_mins = this.$$('#start-picker').rawValue;
          localStorage.start_mins_since_midnight = this.start_time_mins;
          return localStorage.start_as_string = this.start_time_string;
        } else {
          this.end_time_string = this.$$('#end-picker').time;
          this.end_time_mins = this.$$('#end-picker').rawValue;
          localStorage.end_mins_since_midnight = this.end_time_mins;
          return localStorage.end_as_string = this.end_time_string;
        }
      } else {
        this.$$('#start-picker').time = this.start_time_string;
        return this.$$('#end-picker').time = this.end_time_string;
      }
    },
    determine_selected: function(always_active){
      if (always_active) {
        return 'always';
      } else {
        return 'workday';
      }
    },
    determine_selected_idx: function(always_active){
      if (always_active) {
        return 0;
      } else {
        return 1;
      }
    },
    sort_custom_goals_and_interventions_after: function(goals_and_interventions){
      var ref$, custom_goals_and_interventions, normal_goals_and_interventions, this$ = this;
      ref$ = prelude.partition(function(it){
        return it.goal.custom;
      }, goals_and_interventions), custom_goals_and_interventions = ref$[0], normal_goals_and_interventions = ref$[1];
      return normal_goals_and_interventions.concat(custom_goals_and_interventions);
    },
    help_icon_clicked: function(){
      return swal({
        title: 'How HabitLab Works',
        html: 'HabitLab will help you achieve your goal by showing you a different <i>nudge</i>, like a news feed blocker or a delayed page loader, each time you visit your goal site.\n<br><br>\nAt first, HabitLab will show you a random nudge each visit, and over time it will learn what works most effectively for you.\n<br><br>\nEach visit, HabitLab will test a new nudge and measure how much time you spend on the site. Then it determines the efficacy of each nudge by comparing the time spent per visit when that nudge was deployed, compared to when other nudges are deployed. HabitLab uses an algorithmic technique called <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">multi-armed-bandit</a> to learn which nudges work best and choose which nudges to deploy, to minimize your time wasted online.',
        allowOutsideClick: true,
        allowEscapeKey: true
      });
    },
    rerender_privacy_options: function(){},
    rerender: async function(){
      (await this.$.goal_selector.set_sites_and_goals());
      return (await this.$.positive_goal_selector.set_sites_and_goals());
    }
  }, [
    {
      source: require('libs_common/localization_utils'),
      methods: ['msg']
    }, {
      source: require('libs_frontend/polymer_methods'),
      methods: ['text_if_elem_in_array', 'text_if_elem_not_in_array']
    }
  ]);
}).call(this);
