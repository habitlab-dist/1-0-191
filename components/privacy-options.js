(function(){
  var ref$, start_syncing_all_data, stop_syncing_all_data, send_logging_enabled, send_logging_disabled;
  ref$ = require('libs_backend/log_sync_utils'), start_syncing_all_data = ref$.start_syncing_all_data, stop_syncing_all_data = ref$.stop_syncing_all_data;
  ref$ = require('libs_backend/logging_enabled_utils'), send_logging_enabled = ref$.send_logging_enabled, send_logging_disabled = ref$.send_logging_disabled;
  Polymer({
    is: 'privacy-options',
    properties: {
      allow_logging: {
        type: Boolean,
        value: function(){
          var stored_value;
          stored_value = localStorage.getItem('allow_logging');
          if (stored_value != null) {
            return stored_value === 'true';
          }
          return true;
        }(),
        observer: 'allow_logging_changed'
      }
    },
    rerender: function(){
      return this.allow_logging = function(){
        var stored_value;
        stored_value = localStorage.getItem('allow_logging');
        if (stored_value != null) {
          return stored_value === 'true';
        }
        return true;
      }();
    },
    allow_logging_changed: function(allow_logging, prev_value_allow_logging){
      var send_change, prev_allow_logging;
      if (prev_value_allow_logging == null) {
        return;
      }
      if (allow_logging == null) {
        return;
      }
      send_change = true;
      prev_allow_logging = localStorage.getItem('allow_logging');
      if (prev_allow_logging != null) {
        prev_allow_logging = prev_allow_logging === 'true';
        if (prev_allow_logging === allow_logging) {
          send_change = false;
        }
      }
      localStorage.setItem('allow_logging', allow_logging);
      if (allow_logging) {
        if (send_change) {
          send_logging_enabled({
            page: 'settings',
            manual: true
          });
        }
        return start_syncing_all_data();
      } else {
        if (send_change) {
          send_logging_disabled({
            page: 'settings',
            manual: true
          });
        }
        return stop_syncing_all_data();
      }
    }
  });
}).call(this);
