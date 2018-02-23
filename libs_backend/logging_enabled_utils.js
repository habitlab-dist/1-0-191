(function(){
  var post_json, get_user_id, chrome_manifest, habitlab_version, developer_mode, unofficial_version, get_basic_client_data, send_logging_enabled, send_logging_disabled, out$ = typeof exports != 'undefined' && exports || this;
  post_json = require('libs_backend/ajax_utils').post_json;
  get_user_id = require('libs_backend/background_common').get_user_id;
  chrome_manifest = chrome.runtime.getManifest();
  habitlab_version = chrome_manifest.version;
  developer_mode = chrome_manifest.update_url == null;
  unofficial_version = chrome.runtime.id !== 'obghclocpdgcekcognpkblghkedcpdgd';
  out$.get_basic_client_data = get_basic_client_data = async function(){
    var data;
    data = {};
    data.client_timestamp = Date.now();
    data.client_localtime = new Date().toString();
    data.user_id = (await get_user_id());
    data.browser = navigator.userAgent;
    data.language = navigator.language;
    data.languages = navigator.languages;
    data.version = habitlab_version;
    data.devmode = developer_mode;
    data.chrome_runtime_id = chrome.runtime.id;
    if (unofficial_version) {
      data.unofficial_version = chrome.runtime.id;
    }
    return data;
  };
  out$.send_logging_enabled = send_logging_enabled = async function(options){
    var data, k, v;
    options = options != null
      ? options
      : {};
    data = (await get_basic_client_data());
    data.logging_enabled = true;
    for (k in options) {
      v = options[k];
      data[k] = v;
    }
    post_json('https://habitlab.herokuapp.com/add_logging_state', data);
  };
  out$.send_logging_disabled = send_logging_disabled = async function(options){
    var data, k, v;
    options = options != null
      ? options
      : {};
    data = (await get_basic_client_data());
    data.logging_enabled = false;
    for (k in options) {
      v = options[k];
      data[k] = v;
    }
    post_json('https://habitlab.herokuapp.com/add_logging_state', data);
  };
}).call(this);
