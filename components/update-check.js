(function(){
  var polymer_ext, ref$, get_latest_habitlab_version, run_check_for_update_if_needed, localstorage_getbool, semver;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  ref$ = require('libs_backend/habitlab_update_utils'), get_latest_habitlab_version = ref$.get_latest_habitlab_version, run_check_for_update_if_needed = ref$.run_check_for_update_if_needed;
  localstorage_getbool = require('libs_common/localstorage_utils').localstorage_getbool;
  semver = require('semver');
  polymer_ext({
    is: 'update-check',
    properties: {
      current_version: {
        type: String,
        value: chrome.runtime.getManifest().version
      },
      devmode: {
        type: Boolean,
        value: chrome.runtime.getManifest().update_url == null
      },
      unofficial: {
        type: Boolean,
        value: function(){
          if (chrome.runtime.getManifest().update_url == null) {
            return false;
          }
          if (chrome.runtime.id === 'obghclocpdgcekcognpkblghkedcpdgd' || chrome.runtime.id === 'bleifeoekkfhicamkpadfoclfhfmmina') {
            return false;
          }
          return true;
        }()
      },
      preview: {
        type: Boolean,
        value: function(){
          ({
            value: function(){}()
          });
          if (chrome.runtime.getManifest().update_url == null) {
            return false;
          }
          return chrome.runtime.id === 'bleifeoekkfhicamkpadfoclfhfmmina';
        }()
      },
      official: {
        type: Boolean,
        value: function(){
          if (chrome.runtime.getManifest().update_url == null) {
            return false;
          }
          return chrome.runtime.id === 'obghclocpdgcekcognpkblghkedcpdgd' || chrome.runtime.id === 'bleifeoekkfhicamkpadfoclfhfmmina';
        }()
      },
      appid: {
        type: String,
        value: chrome.runtime.id
      },
      installable_update_version: {
        type: String,
        value: (ref$ = localStorage.extension_update_available_version) != null ? ref$ : ''
      },
      is_update_installable: {
        type: Boolean,
        computed: 'compute_is_update_installable(installable_update_version, current_version)'
      },
      available_update_version: {
        type: String,
        value: ''
      },
      is_update_available: {
        type: Boolean,
        computed: 'compute_is_update_installable(available_update_version, current_version)'
      },
      have_checked_for_updates: {
        type: Boolean,
        value: false
      },
      check_for_updates_button_text: {
        type: String,
        value: 'Check for updates now'
      },
      is_update_available_or_installable: {
        type: Boolean,
        computed: 'compute_is_update_available_or_installable(is_update_available, is_update_installable)'
      },
      autocheck: {
        type: Boolean,
        value: localstorage_getbool('allow_logging')
      }
    },
    compute_is_update_available_or_installable: function(is_update_available, is_update_installable){
      return is_update_available || is_update_installable;
    },
    compute_is_update_installable: function(installable_update_version, current_version){
      return typeof installable_update_version === 'string' && installable_update_version.length > 0 && semver.valid(installable_update_version) && semver.gt(installable_update_version, current_version);
    },
    install_update_now: function(){
      localStorage.habitlab_open_url_on_next_start = 'https://habitlab.github.io/to?q=options';
      chrome.runtime.reload();
      return chrome.runtime.restart();
    },
    check_for_updates_now: async function(){
      var self;
      self = this;
      self.check_for_updates_button_text = 'Checking for updates';
      self.available_update_version = (await get_latest_habitlab_version());
      self.have_checked_for_updates = true;
      self.check_for_updates_button_text = 'Check for updates now';
      if (self.available_update_version != null && semver.valid(self.available_update_version) && semver.gt(self.available_update_version, self.current_version)) {
        return run_check_for_update_if_needed();
      }
    },
    ready: function(){
      var self, display_update_info;
      self = this;
      display_update_info = function(){
        if (localStorage.extension_update_available_version != null) {
          return self.installable_update_version = localStorage.extension_update_available_version;
        }
      };
      setInterval(display_update_info, 1000);
      return setTimeout(function(){
        if (self.autocheck) {
          return self.check_for_updates_now();
        }
      }, 0);
    }
  });
}).call(this);
