(function(){
  var polymer_ext, swal, load_css_file, ref$, set_intervention_disabled, set_intervention_disabled_permanently, disable_habitlab, open_url_in_new_tab, get_goals, intervention;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  swal = require('sweetalert2');
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_common/intervention_utils'), set_intervention_disabled = ref$.set_intervention_disabled, set_intervention_disabled_permanently = ref$.set_intervention_disabled_permanently;
  disable_habitlab = require('libs_common/disable_habitlab_utils').disable_habitlab;
  open_url_in_new_tab = require('libs_common/tab_utils').open_url_in_new_tab;
  get_goals = require('libs_common/goal_utils').get_goals;
  intervention = require('libs_common/intervention_info').get_intervention();
  polymer_ext({
    is: 'habitlab-options-popup',
    doc: 'A habitlab options popup for user to turn off the current nudge or HabitLab',
    properties: {
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      },
      intervention: {
        type: String,
        value: intervention != null ? intervention.name : '',
        observer: 'intervention_changed'
      },
      intervention_description: {
        type: String,
        value: intervention != null ? intervention.description : ''
      },
      goal_descriptions: {
        type: String
      },
      goal_name_to_info: {
        type: Object
      },
      screenshot: {
        type: String
      },
      other: {
        type: Object,
        value: {}
      }
    },
    isdemo_changed: function(){
      if (this.isdemo) {
        return this.open();
      }
    },
    intervention_changed: async function(){
      var goal_name_to_info, goal_names, this$ = this;
      if (this.goal_name_to_info == null) {
        this.goal_name_to_info = (await get_goals());
      }
      goal_name_to_info = this.goal_name_to_info;
      goal_names = intervention.goals;
      return this.goal_descriptions = goal_names.map(function(it){
        return goal_name_to_info[it];
      }).map(function(it){
        return it.description;
      }).join(', ');
    },
    ready: async function(){
      return (await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css'));
    },
    open: function(){
      return this.$$('#intervention_info_dialog').open();
    },
    disable_temp_callback: function(){
      var self;
      this.$$('#intervention_info_dialog').close();
      self = this;
      this.fire('disable_intervention');
      return swal({
        title: 'Turned Off!',
        text: 'This intervention will be turned off temporarily.'
      });
    },
    disable_perm_callback: function(){
      var self;
      this.$$('#intervention_info_dialog').close();
      self = this;
      this.fire('disable_intervention');
      return set_intervention_disabled_permanently(this.intervention, function(){
        return swal('Turned Off!', 'This intervention will be turned off permanently.');
      });
    },
    disable_habitlab_callback: function(){
      this.$$('#intervention_info_dialog').close();
      disable_habitlab();
      return swal({
        title: 'HabitLab Turned Off!',
        text: 'HabitLab will not show you interventions for the rest of today.'
      });
    },
    open_interventions_page: function(){
      open_url_in_new_tab('options.html#interventions');
      return this.$$('#intervention_info_dialog').close();
    },
    open_feedback_form: async function(){
      var feedback_form;
      feedback_form = document.createElement('feedback-form');
      feedback_form.screenshot = this.screenshot;
      feedback_form.other = this.other;
      this.$$('#intervention_info_dialog').close();
      document.body.appendChild(feedback_form);
      return feedback_form.open();
    }
  });
}).call(this);
