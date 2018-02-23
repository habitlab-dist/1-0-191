(function(){
  var open_debug_page_for_tab_id;
  open_debug_page_for_tab_id = async function(tab_id){
    var debug_page_url, popup_windows, i$, len$, popup_window, window_info, j$, ref$, len1$, tab;
    debug_page_url = chrome.runtime.getURL('index.html?tag=terminal-view&autoload=true&ispopup=true&tabid=' + tab_id);
    popup_windows = (await new Promise(function(it){
      return chrome.windows.getAll({
        windowTypes: ['popup']
      }, it);
    }));
    for (i$ = 0, len$ = popup_windows.length; i$ < len$; ++i$) {
      popup_window = popup_windows[i$];
      window_info = (await new Promise(fn$));
      for (j$ = 0, len1$ = (ref$ = window_info.tabs).length; j$ < len1$; ++j$) {
        tab = ref$[j$];
        if (tab.url === debug_page_url) {
          (await new Promise(fn1$));
          return (await new Promise(fn2$));
        }
      }
    }
    return (await new Promise(function(it){
      return chrome.windows.create({
        url: debug_page_url,
        type: 'popup',
        width: 566,
        height: 422
      }, it);
    }));
    function fn$(it){
      return chrome.windows.get(popup_window.id, {
        populate: true
      }, it);
    }
    function fn1$(it){
      return chrome.tabs.update(tab.id, {
        active: true
      }, it);
    }
    function fn2$(it){
      return chrome.windows.update(popup_window.id, {
        focused: true
      }, it);
    }
  };
  module.exports.open_debug_page_for_tab_id = open_debug_page_for_tab_id;
}).call(this);
