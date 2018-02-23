(function(){
  var ref$, get_intervention_parameters, get_intervention_parameter, set_intervention_parameter, polymer_ext;
  ref$ = require('libs_backend/intervention_utils'), get_intervention_parameters = ref$.get_intervention_parameters, get_intervention_parameter = ref$.get_intervention_parameter, set_intervention_parameter = ref$.set_intervention_parameter;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  /*
  set_intervention_parameter_debounced = debounce (args, callback) ->
    [intervention_name, parameter_name, parameter_value] = args
    set_intervention_parameter(intervention_name, parameter_name, parameter_value, callback)
  */
  /*
  parameters_changed_debounced = debounce (args, callback) ->
    [self] = args
    console.log 'self.intervention'
    console.log self.intervention
    console.log 'self.parameter'
    console.log self.parameter
    if not self.intervention? or not self.parameter?
      return callback?!
    parameter_value <- get_intervention_parameter self.intervention.name, self.parameter.name
    self.$$('#parameter_input').value = parameter_value
    console.log 'parameters_changed_debounced called'
    console.log "parameter #{self.parameter.name} for intervention #{self.intervention.name} is #{parameter_value}"
    return callback?!
  */
  polymer_ext({
    is: 'intervention-parameter-view',
    properties: {
      intervention: {
        type: Object
      },
      parameter: {
        type: Object,
        observer: 'parameter_changed'
      }
    },
    is_parameter_code: function(parameter){
      return parameter.code != null;
    },
    is_parameter_type_bool: function(parameter){
      return parameter.type === 'bool';
    },
    is_parameter_multiline: function(parameter){
      return parameter.multiline === true;
    },
    is_parameter_singleline: function(parameter){
      return !(parameter.code != null || parameter.type === 'bool' || parameter.multiline === true);
    },
    get_error_message: function(parameter){
      if (parameter == null || parameter.type == null) {
        return '';
      }
      if (parameter.type === 'string') {
        return '.*';
      }
      if (parameter.type === 'int') {
        return 'Need an integer';
      }
      if (parameter.type === 'float') {
        return 'Need a floating-point number';
      }
      return '';
    },
    get_validation_pattern: function(parameter){
      if (parameter == null || parameter.type == null) {
        return '.*';
      }
      if (parameter.type === 'string') {
        return '.*';
      }
      if (parameter.type === 'int') {
        return '[0-9]+';
      }
      if (parameter.type === 'float') {
        return '[0-9]*.?[0-9]+';
      }
      return '.*';
    },
    parameter_changed: function(){
      var self;
      self = this;
      if (self.intervention == null || self.parameter == null) {
        return;
      }
      return get_intervention_parameter(self.intervention.name, self.parameter.name, function(parameter_value){
        if (self.parameter.type === 'bool') {
          return self.$$('#parameter_checkbox_input').checked = parameter_value;
        } else if (self.parameter.code) {
          self.$$('#parameter_code_input').mirror.setValue(parameter_value);
          return setTimeout(function(){
            var els, i$, len$, el, results$ = [];
            els = document.getElementsByClassName('CodeMirror');
            for (i$ = 0, len$ = els.length; i$ < len$; ++i$) {
              el = els[i$];
              results$.push(el.CodeMirror.refresh());
            }
            return results$;
          }, 1000);
        } else if (self.parameter.multiline) {
          return self.$$('#parameter_textarea_input').value = parameter_value;
        } else {
          return self.$$('#parameter_input').value = parameter_value;
        }
      });
    },
    parameter_checkbox_value_changed: function(evt){
      var self, checked;
      self = this;
      checked = evt.target.checked;
      return set_intervention_parameter(self.intervention.name, self.parameter.name, checked, function(){});
    },
    parameter_textarea_value_changed: function(evt){
      var self, value;
      self = this;
      value = evt.target.value;
      return set_intervention_parameter(self.intervention.name, self.parameter.name, value, function(){});
    },
    parameter_code_value_changed: function(evt){
      var self, value;
      self = this;
      value = evt.detail.value;
      return set_intervention_parameter(self.intervention.name, self.parameter.name, value, function(){});
    },
    parameter_value_changed: function(evt){
      var self, value;
      self = this;
      if (self.$$('#parameter_input').invalid) {
        return;
      }
      value = evt.target.value;
      return set_intervention_parameter(self.intervention.name, self.parameter.name, value, function(){});
    },
    ready: function(){
      var self;
      self = this;
      return self.parameter_changed(self, function(){});
    }
  });
}).call(this);
