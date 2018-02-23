(function(){
  var ref$, gexport, gexport_module, as_array, memoizeSingleAsync, generate_random_id, chrome_tabs_sendmessage, chrome_storage_sync, ref1$, cached_user_id, get_user_id, get_user_id_from_history, clear_user_id_from_history, set_user_id_in_history, get_user_id_real, cached_user_secret, get_user_secret, get_user_secret_real, send_message_to_active_tab, send_message_to_all_active_tabs, eval_content_script, eval_content_script_for_active_tab, eval_content_script_debug_for_active_tab, eval_content_script_debug_for_tabid, eval_content_script_for_tabid, list_currently_loaded_interventions, list_currently_loaded_interventions_for_tabid, is_tab_still_open, open_debug_page_for_tab_id, send_message_to_tabid, disable_interventions_for_tabid, disable_interventions_in_active_tab, disable_interventions_in_all_tabs, get_active_tab_info, get_active_tab_url, get_active_tab_id, remote_file_exists, extension_url_exists, fetch_remote_json_cache, fetch_remote_json, list_files_in_path_for_github_repo, list_files_in_libs_common, list_files_in_libs_backend, list_files_in_libs_frontend, list_jspm_packages, list_jspm_libraries_as_markdown, printcb, printcb_json, jspm_eval, printfunc, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  as_array = require('libs_common/collection_utils').as_array;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  generate_random_id = require('libs_common/generate_random_id').generate_random_id;
  chrome_tabs_sendmessage = function(tab_id, data, options){
    if (options == null) {
      options = {};
    }
    return new Promise(function(resolve, reject){
      return chrome.tabs.sendMessage(tab_id, data, options, function(result){
        resolve(result);
        return true;
      });
    });
  };
  chrome_storage_sync = (ref$ = (ref1$ = chrome.storage) != null ? ref1$.sync : void 8) != null
    ? ref$
    : (ref$ = chrome.storage) != null ? ref$.local : void 8;
  cached_user_id = null;
  out$.get_user_id = get_user_id = memoizeSingleAsync(async function(){
    var user_id;
    user_id = (await get_user_id_real());
    if (user_id.length === 24) {
      return user_id;
    } else {
      cached_user_id = null;
      localStorage.removeItem('userid');
      (await new Promise(function(it){
        return chrome_storage_sync.remove('userid', it);
      }));
      return (await get_user_id_real());
    }
  });
  out$.get_user_id_from_history = get_user_id_from_history = async function(){
    var history_search_results, i$, len$, search_result, data_text, j$, ref$, len1$, data_line, data_line_entries, key, value;
    history_search_results = (await new Promise(function(it){
      return chrome.history.search({
        text: 'https://habitlab.stanford.edu',
        startTime: 0
      }, it);
    }));
    for (i$ = 0, len$ = history_search_results.length; i$ < len$; ++i$) {
      search_result = history_search_results[i$];
      if (search_result.url.startsWith('https://habitlab.stanford.edu/#hashdata|')) {
        data_text = search_result.url.replace('https://habitlab.stanford.edu/#hashdata|', '');
        for (j$ = 0, len1$ = (ref$ = data_text.split('|')).length; j$ < len1$; ++j$) {
          data_line = ref$[j$];
          if (data_line.includes('=')) {
            data_line_entries = data_line.split('=');
            key = data_line_entries[0];
            value = data_line_entries[1];
            if (key === 'userid') {
              return value;
            }
          }
        }
      }
    }
    return null;
  };
  out$.clear_user_id_from_history = clear_user_id_from_history = async function(){
    var history_search_results, i$, len$, search_result, results$ = [];
    history_search_results = (await new Promise(function(it){
      return chrome.history.search({
        text: 'https://habitlab.stanford.edu',
        startTime: 0
      }, it);
    }));
    for (i$ = 0, len$ = history_search_results.length; i$ < len$; ++i$) {
      search_result = history_search_results[i$];
      if (search_result.url.startsWith('https://habitlab.stanford.edu/#hashdata|')) {
        results$.push((await new Promise(fn$)));
      }
    }
    return results$;
    function fn$(it){
      return chrome.history.deleteUrl({
        url: search_result.url
      }, it);
    }
  };
  out$.set_user_id_in_history = set_user_id_in_history = async function(userid){
    return (await new Promise(function(it){
      return chrome.history.addUrl({
        url: 'https://habitlab.stanford.edu/#hashdata|source=extension|userid=' + userid
      }, it);
    }));
  };
  get_user_id_real = async function(){
    var userid, items;
    if (cached_user_id != null) {
      return cached_user_id;
    }
    userid = localStorage.getItem('userid');
    if (userid != null) {
      cached_user_id = userid;
      return userid;
    }
    items = (await new Promise(function(it){
      return chrome_storage_sync.get('userid', it);
    }));
    userid = items.userid;
    if (userid != null) {
      cached_user_id = userid;
      localStorage.setItem('userid', userid);
      return userid;
    }
    userid = (await get_user_id_from_history());
    if (userid == null) {
      userid = generate_random_id();
      (await set_user_id_in_history(userid));
    }
    cached_user_id = userid;
    localStorage.setItem('userid', userid);
    (await new Promise(function(it){
      return chrome_storage_sync.set({
        userid: userid
      }, it);
    }));
    return userid;
  };
  cached_user_secret = null;
  out$.get_user_secret = get_user_secret = memoizeSingleAsync(async function(){
    var user_secret;
    user_secret = (await get_user_secret_real());
    if (user_secret.length === 24) {
      return user_secret;
    } else {
      cached_user_secret = null;
      localStorage.removeItem('user_secret');
      (await new Promise(function(it){
        return chrome_storage_sync.remove('user_secret', it);
      }));
      return (await get_user_secret_real());
    }
  });
  get_user_secret_real = async function(){
    var user_secret, items;
    if (cached_user_secret != null) {
      return cached_user_secret;
    }
    user_secret = localStorage.getItem('user_secret');
    if (user_secret != null) {
      cached_user_secret = user_secret;
      return user_secret;
    }
    items = (await new Promise(function(it){
      return chrome_storage_sync.get('user_secret', it);
    }));
    user_secret = items.user_secret;
    if (user_secret != null) {
      cached_user_secret = user_secret;
      localStorage.setItem('user_secret', user_secret);
      return user_secret;
    }
    user_secret = generate_random_id();
    cached_user_secret = user_secret;
    localStorage.setItem('user_secret', user_secret);
    (await new Promise(function(it){
      return chrome_storage_sync.set({
        user_secret: user_secret
      }, it);
    }));
    return user_secret;
  };
  out$.send_message_to_active_tab = send_message_to_active_tab = async function(type, data){
    var tabs;
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, it);
    }));
    if (tabs.length === 0) {
      return;
    }
    return (await chrome_tabs_sendmessage(tabs[0].id, {
      type: type,
      data: data
    }));
  };
  send_message_to_all_active_tabs = async function(type, data){
    var tabs, outputs, i$, len$, tab, result;
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({
        active: true
      }, it);
    }));
    if (tabs.length === 0) {
      return;
    }
    outputs = [];
    for (i$ = 0, len$ = tabs.length; i$ < len$; ++i$) {
      tab = tabs[i$];
      result = (await chrome_tabs_sendmessage(tab.id, {
        type: type,
        data: data
      }));
      outputs.push(result);
    }
    return outputs;
  };
  out$.eval_content_script = eval_content_script = async function(script){
    var results, i$, len$, result;
    results = (await send_message_to_all_active_tabs('eval_content_script', script));
    for (i$ = 0, len$ = results.length; i$ < len$; ++i$) {
      result = results[i$];
      console.log(result);
    }
    return result;
  };
  out$.eval_content_script_for_active_tab = eval_content_script_for_active_tab = async function(script){
    return (await send_message_to_active_tab('eval_content_script', script));
  };
  out$.eval_content_script_debug_for_active_tab = eval_content_script_debug_for_active_tab = async function(script){
    return (await send_message_to_active_tab('eval_content_script_debug', script));
  };
  out$.eval_content_script_debug_for_tabid = eval_content_script_debug_for_tabid = async function(tabid, script){
    return (await chrome_tabs_sendmessage(tabid, {
      type: 'eval_content_script_debug',
      data: script
    }));
  };
  out$.eval_content_script_for_tabid = eval_content_script_for_tabid = async function(tabid, script){
    return (await chrome_tabs_sendmessage(tabid, {
      type: 'eval_content_script',
      data: script
    }));
  };
  out$.list_currently_loaded_interventions = list_currently_loaded_interventions = async function(){
    var tab, loaded_interventions;
    console.log('list_currently_loaded_interventions');
    tab = (await get_active_tab_info());
    console.log('tab');
    console.log(tab);
    loaded_interventions = (await eval_content_script_for_tabid(tab.id, 'window.loaded_interventions'));
    console.log('loaded_interventions');
    console.log(loaded_interventions);
    return as_array(loaded_interventions);
  };
  out$.list_currently_loaded_interventions_for_tabid = list_currently_loaded_interventions_for_tabid = async function(tab_id){
    var loaded_interventions;
    console.log('list_currently_loaded_interventions_for_tabid');
    loaded_interventions = (await eval_content_script_for_tabid(tab_id, 'window.loaded_interventions'));
    return as_array(loaded_interventions);
  };
  out$.is_tab_still_open = is_tab_still_open = async function(tab_id){
    var tabs, i$, len$, tab;
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({}, it);
    }));
    for (i$ = 0, len$ = tabs.length; i$ < len$; ++i$) {
      tab = tabs[i$];
      if (tab.id === tab_id) {
        return true;
      }
    }
    return false;
  };
  out$.open_debug_page_for_tab_id = open_debug_page_for_tab_id = async function(tab_id){
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
  out$.send_message_to_tabid = send_message_to_tabid = async function(tabid, type, data){
    return chrome_tabs_sendmessage(tabid, {
      type: type,
      data: data
    });
  };
  out$.disable_interventions_for_tabid = disable_interventions_for_tabid = async function(tabid){
    return (await eval_content_script_for_tabid(tabid, "document.body.dispatchEvent(new CustomEvent('disable_intervention'))"));
  };
  out$.disable_interventions_in_active_tab = disable_interventions_in_active_tab = async function(){
    var tab;
    tab = (await get_active_tab_info());
    return (await disable_interventions_for_tabid(tab.id));
  };
  out$.disable_interventions_in_all_tabs = disable_interventions_in_all_tabs = async function(){
    var tabs, tab;
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({}, it);
    }));
    (await Promise.all((await (async function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = tabs).length; i$ < len$; ++i$) {
        tab = ref$[i$];
        results$.push(disable_interventions_for_tabid(tab.id));
      }
      return results$;
    }()))));
  };
  out$.get_active_tab_info = get_active_tab_info = async function(){
    var tabs, last_focused_window_info;
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, it);
    }));
    if (tabs.length > 0) {
      return tabs[0];
    }
    last_focused_window_info = (await new Promise(function(it){
      return chrome.windows.getLastFocused(it);
    }));
    if ((last_focused_window_info != null ? last_focused_window_info.id : void 8) == null) {
      return;
    }
    tabs = (await new Promise(function(it){
      return chrome.tabs.query({
        active: true,
        windowId: last_focused_window_info.id
      }, it);
    }));
    if (tabs.length > 0) {
      return tabs[0];
    }
  };
  out$.get_active_tab_url = get_active_tab_url = async function(){
    var active_tab_info;
    active_tab_info = (await get_active_tab_info());
    return active_tab_info.url;
  };
  out$.get_active_tab_id = get_active_tab_id = async function(){
    var active_tab_info;
    active_tab_info = (await get_active_tab_info());
    return active_tab_info.id;
  };
  remote_file_exists = async function(remote_file_path){
    var request, contents, e;
    try {
      request = (await fetch(remote_file_path));
      contents = (await request.text());
      return true;
    } catch (e$) {
      e = e$;
      return false;
    }
  };
  extension_url_exists = async function(extension_file_path){
    return (await remote_file_exists(chrome.extension.getURL(extension_file_path)));
  };
  fetch_remote_json_cache = {};
  fetch_remote_json = async function(path){
    var request, tree_text, tree_contents;
    if (fetch_remote_json_cache[path] != null) {
      return fetch_remote_json_cache[path];
    }
    request = (await fetch(path));
    tree_text = (await request.text());
    tree_contents = JSON.parse(tree_text);
    fetch_remote_json_cache[path] = tree_contents;
    return tree_contents;
  };
  list_files_in_path_for_github_repo = async function(path){
    var path_parts, res$, i$, ref$, len$, x, current_path, path_part, tree_contents, matching_parts, j$, len1$;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = path.split('/')).length; i$ < len$; ++i$) {
      x = ref$[i$];
      if (x != null && x.length > 0) {
        res$.push(x);
      }
    }
    path_parts = res$;
    current_path = 'https://api.github.com/repos/habitlab/habitlab/git/trees/master';
    for (i$ = 0, len$ = path_parts.length; i$ < len$; ++i$) {
      path_part = path_parts[i$];
      tree_contents = (await fetch_remote_json(current_path));
      res$ = [];
      for (j$ = 0, len1$ = (ref$ = tree_contents.tree).length; j$ < len1$; ++j$) {
        x = ref$[j$];
        if (x.path === path_part) {
          res$.push(x);
        }
      }
      matching_parts = res$;
      if (matching_parts.length === 0) {
        return [];
      }
      current_path = matching_parts[0].url;
    }
    tree_contents = (await fetch_remote_json(current_path));
    return (await (async function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = tree_contents.tree).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(x.path);
      }
      return results$;
    }()));
  };
  list_files_in_libs_common = async function(){
    return (await list_files_in_path_for_github_repo('src/libs_common'));
  };
  list_files_in_libs_backend = async function(){
    return (await list_files_in_path_for_github_repo('src/libs_backend'));
  };
  list_files_in_libs_frontend = async function(){
    return (await list_files_in_path_for_github_repo('src/libs_frontend'));
  };
  list_jspm_packages = function(){
    var libraries, library_names, output, i$, len$, libname;
    libraries = SystemJS.getConfig().map;
    library_names = Object.keys(libraries);
    library_names.sort();
    output = [];
    for (i$ = 0, len$ = library_names.length; i$ < len$; ++i$) {
      libname = library_names[i$];
      if (libname.indexOf('/') === -1) {
        output.push(libname);
      }
    }
    return output;
  };
  out$.list_jspm_libraries_as_markdown = list_jspm_libraries_as_markdown = async function(){
    var output, libs_common_files, libs_backend_files, libs_frontend_files, jspm_packages, i$, len$, libname, function_signatures, filename, ref$;
    output = [];
    libs_common_files = (await list_files_in_libs_common());
    libs_backend_files = (await list_files_in_libs_backend());
    libs_frontend_files = (await list_files_in_libs_frontend());
    jspm_packages = list_jspm_packages();
    output.push('### NPM Packages');
    for (i$ = 0, len$ = jspm_packages.length; i$ < len$; ++i$) {
      libname = jspm_packages[i$];
      output.push('* [' + libname + '](https://www.npmjs.com/package/' + libname + ')');
    }
    function_signatures = (await SystemJS['import']('libs_common/function_signatures'));
    output.push('');
    output.push('### HabitLab Frontend APIs');
    for (i$ = 0, len$ = libs_common_files.length; i$ < len$; ++i$) {
      filename = libs_common_files[i$];
      if (!(filename.endsWith('.ls') || filename.endsWith('.js'))) {
        continue;
      }
      libname = filename.replace(/.ls$/, '').replace(/.js$/, '');
      output.push('* [libs_common/' + libname + '](https://github.com/habitlab/habitlab/blob/master/src/libs_common/' + filename + ')');
    }
    output.push('');
    output.push('### HabitLab Common APIs');
    for (i$ = 0, len$ = libs_frontend_files.length; i$ < len$; ++i$) {
      filename = libs_frontend_files[i$];
      if (!(filename.endsWith('.ls') || filename.endsWith('.js'))) {
        continue;
      }
      libname = filename.replace(/.ls$/, '').replace(/.js$/, '');
      output.push('* [libs_frontend/' + libname + '](https://github.com/habitlab/habitlab/blob/master/src/libs_frontend/' + filename + ')');
    }
    output.push('');
    output.push('### HabitLab Backend APIs');
    for (i$ = 0, len$ = (ref$ = function_signatures.list_libs()).length; i$ < len$; ++i$) {
      libname = ref$[i$];
      filename = libname + '.ls';
      if (libs_backend_files.indexOf(filename) === -1) {
        filename = libname + '.js';
      }
      output.push('* [libs_common/' + libname + '](https://github.com/habitlab/habitlab/blob/master/src/libs_backend/' + filename + ')');
    }
    return output.join('\n');
  };
  out$.printcb = printcb = function(x){
    return console.log(x);
  };
  out$.printcb_json = printcb_json = function(x){
    return console.log(JSON.stringify(x, 0, 2));
  };
  out$.jspm_eval = jspm_eval = function(x){
    return SystemJS['import']('data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(x))));
  };
  out$.printfunc = printfunc = function(func){
    var args, res$, i$, to$, nargs, len$, x;
    res$ = [];
    for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    args = res$;
    res$ = [];
    for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
      x = args[i$];
      res$.push(x);
    }
    nargs = res$;
    nargs.push(printcb);
    return func.apply({}, nargs);
  };
  gexport_module('background_common', function(it){
    return eval(it);
  });
}).call(this);
