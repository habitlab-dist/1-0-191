(function(){
  var ref$, get_enabled_interventions, set_intervention_enabled, set_intervention_disabled, set_intervention_automatically_managed, set_intervention_manually_managed, get_intervention_parameters, set_intervention_parameter, set_override_enabled_interventions_once, add_log_interventions, localstorage_getbool, polymer_ext, get_all_badges_earned_for_minutes_saved, get_time_saved_total, Bounce, $;
  ref$ = require('libs_backend/intervention_utils'), get_enabled_interventions = ref$.get_enabled_interventions, set_intervention_enabled = ref$.set_intervention_enabled, set_intervention_disabled = ref$.set_intervention_disabled, set_intervention_automatically_managed = ref$.set_intervention_automatically_managed, set_intervention_manually_managed = ref$.set_intervention_manually_managed, get_intervention_parameters = ref$.get_intervention_parameters, set_intervention_parameter = ref$.set_intervention_parameter, set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once;
  add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
  localstorage_getbool = require('libs_common/localstorage_utils').localstorage_getbool;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  get_all_badges_earned_for_minutes_saved = require('libs_common/badges_utils').get_all_badges_earned_for_minutes_saved;
  get_time_saved_total = require('libs_common/gamification_utils').get_time_saved_total;
  Bounce = require('bounce.js');
  $ = require('jquery');
  polymer_ext({
    is: 'interventions-for-sites',
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
      intervention: {
        type: Object,
        observer: 'intervention_property_changed'
      },
      enabled: {
        type: Boolean,
        observer: 'enabled_changed'
      },
      compact: {
        type: Boolean,
        value: false
      },
      pill_button_idx: {
        type: Number,
        computed: 'get_pill_button_idx(enabled)'
      },
      goal: {
        type: Object
      },
      sitename: {
        type: String,
        computed: 'compute_sitename(goal)'
      }
    },
    compute_sitename: function(goal){
      return goal.sitename_printable;
    },
    intervention_property_changed: function(intervention, old_intervention){
      return this.enabled = this.intervention.enabled;
    }
    /*
    automatic_and_enabled: (automatic, enabled) ->
      return automatic and enabled
    automatic_and_disabled: (automatic, enabled) ->
      return automatic and !enabled
    automatic_changed: (automatic, old_automatic) ->
      this.intervention.automatic = automatic
    */,
    enabled_changed: function(enabled, old_enabled){
      return this.intervention.enabled = enabled;
    },
    display_internal_names_for_interventions: function(){
      return localstorage_getbool('intervention_view_show_internal_names');
    }
    /*
    pill_button_selected: (evt) ->>
      buttonidx = evt.detail.buttonidx
      if buttonidx == 1 # smartly managed
        this.automatic = true
        prev_enabled_interventions = await get_enabled_interventions()
        await set_intervention_enabled this.intervention.name
        await set_intervention_automatically_managed this.intervention.name
        add_log_interventions {
          type: 'intervention_set_smartly_managed'
          manual: true
          intervention_name: this.intervention.name
          prev_enabled_interventions: prev_enabled_interventions
        }
      else if buttonidx == 0 # never shown
        this.enabled = false
        this.automatic = false
        prev_enabled_interventions = await get_enabled_interventions()
        await set_intervention_disabled this.intervention.name
        await set_intervention_manually_managed this.intervention.name
        add_log_interventions {
          type: 'intervention_set_always_disabled'
          manual: true
          intervention_name: this.intervention.name
          prev_enabled_interventions: prev_enabled_interventions
        }
    */,
    pill_button_selected: async function(evt){
      var buttonidx, prev_enabled_interventions;
      buttonidx = evt.detail.buttonidx;
      if (buttonidx === 1) {
        this.enabled = true;
        prev_enabled_interventions = (await get_enabled_interventions());
        (await set_intervention_enabled(this.intervention.name));
        return add_log_interventions({
          type: 'intervention_set_smartly_managed',
          manual: true,
          intervention_name: this.intervention.name,
          prev_enabled_interventions: prev_enabled_interventions
        });
      } else if (buttonidx === 0) {
        this.enabled = false;
        prev_enabled_interventions = (await get_enabled_interventions());
        (await set_intervention_disabled(this.intervention.name));
        return add_log_interventions({
          type: 'intervention_set_always_disabled',
          manual: true,
          intervention_name: this.intervention.name,
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
    preview_intervention: function(){
      var intervention_name, preview_page, ref$;
      intervention_name = this.intervention.name;
      set_override_enabled_interventions_once(intervention_name);
      preview_page = (ref$ = this.intervention.preview) != null
        ? ref$
        : (ref$ = this.goal.preview) != null
          ? ref$
          : this.goal.homepage;
      return chrome.tabs.create({
        url: preview_page
      });
    },
    parameters_shown: function(){
      return localstorage_getbool('intervention_view_show_parameters');
    },
    isdemo_changed: function(isdemo){
      if (isdemo) {
        return this.minutes_saved = 300;
      }
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['SM']
  });
}).call(this);
