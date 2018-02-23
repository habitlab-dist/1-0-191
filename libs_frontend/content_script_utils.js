(function(){
  var send_message_to_background, load_css_file, load_css_code, set_alternative_url_to_track, register_listener_for_tab_focus, remove_listener_for_tab_focus, out$ = typeof exports != 'undefined' && exports || this;
  send_message_to_background = function(type, data){
    return new Promise(function(resolve, reject){
      chrome.runtime.sendMessage({
        type: type,
        data: data
      }, function(result){
        return resolve(result);
      });
      return true;
    });
  };
  out$.load_css_file = load_css_file = async function(filename){
    (await send_message_to_background('load_css_file', {
      css_file: filename
    }));
  };
  out$.load_css_code = load_css_code = async function(css_code){
    (await send_message_to_background('load_css_code', {
      css_code: css_code
    }));
  };
  out$.set_alternative_url_to_track = set_alternative_url_to_track = async function(url){
    (await send_message_to_background('set_alternative_url_to_track', {
      url: url
    }));
  };
  out$.register_listener_for_tab_focus = register_listener_for_tab_focus = async function(){
    (await send_message_to_background('register_listener_for_tab_focus', {}));
  };
  out$.remove_listener_for_tab_focus = remove_listener_for_tab_focus = async function(){
    (await send_message_to_background('remove_listener_for_tab_focus', {}));
  };
}).call(this);
