(function(){
  var ref$, get_log_names, getInterventionLogCollection, get_current_collections, list_collections_to_sync, getCollection, get_user_id, post_json, sleep, gexport, gexport_module, chrome_manifest, habitlab_version, developer_mode, unofficial_version, start_syncing_all_data, stop_syncing_all_data, upload_log_item_to_server, sync_unsynced_logs, log_syncing_active, start_syncing_all_logs, stop_syncing_all_logs, make_item_synced_in_collection, upload_collection_item_to_server, sync_unsynced_items_in_db_collection, db_syncing_active, start_syncing_all_db_collections, stop_syncing_all_db_collections, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_backend/log_utils'), get_log_names = ref$.get_log_names, getInterventionLogCollection = ref$.getInterventionLogCollection;
  ref$ = require('libs_backend/db_utils'), get_current_collections = ref$.get_current_collections, list_collections_to_sync = ref$.list_collections_to_sync, getCollection = ref$.getCollection;
  get_user_id = require('libs_backend/background_common').get_user_id;
  post_json = require('libs_backend/ajax_utils').post_json;
  sleep = require('libs_common/common_libs').sleep;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  chrome_manifest = chrome.runtime.getManifest();
  habitlab_version = chrome_manifest.version;
  developer_mode = chrome_manifest.update_url == null;
  unofficial_version = chrome.runtime.id !== 'obghclocpdgcekcognpkblghkedcpdgd';
  out$.start_syncing_all_data = start_syncing_all_data = function(){
    if (localStorage.getItem('allow_logging') !== 'true') {
      dlog('logging disabled, not syncing data');
      return;
    }
    start_syncing_all_logs();
    return start_syncing_all_db_collections();
  };
  out$.stop_syncing_all_data = stop_syncing_all_data = function(){
    stop_syncing_all_db_collections();
    return stop_syncing_all_logs();
  };
  upload_log_item_to_server = async function(name, data){
    var logging_server_url, collection, upload_successful, response, e;
    if (localStorage.getItem('local_logging_server') === 'true') {
      logging_server_url = 'http://localhost:5000/';
    } else {
      logging_server_url = 'https://habitlab.herokuapp.com/';
    }
    collection = (await getInterventionLogCollection(name));
    data = import$({}, data);
    data.logname = name;
    upload_successful = true;
    try {
      response = (await post_json(logging_server_url + 'addtolog', data));
      if (response.success) {
        (await collection.where('id').equals(data.id).modify({
          synced: 1
        }));
      } else {
        upload_successful = false;
        dlog('response from server was not successful in upload_log_item_to_server');
        dlog(response);
        dlog(data);
      }
    } catch (e$) {
      e = e$;
      upload_successful = false;
      dlog('error thrown in upload_log_item_to_server');
      dlog(e);
      dlog(data);
      dlog(name);
    }
    return upload_successful;
  };
  out$.sync_unsynced_logs = sync_unsynced_logs = async function(name){
    var collection, num_unsynced, unsynced_items, all_successful, i$, len$, x, item_upload_success;
    collection = (await getInterventionLogCollection(name));
    num_unsynced = (await collection.where('synced').equals(0).count());
    if (num_unsynced === 0) {
      return true;
    }
    dlog('syncing logs ' + name + ' num_unsynced is: ' + num_unsynced);
    unsynced_items = (await collection.where('synced').equals(0).toArray());
    all_successful = true;
    for (i$ = 0, len$ = unsynced_items.length; i$ < len$; ++i$) {
      x = unsynced_items[i$];
      item_upload_success = (await upload_log_item_to_server(name, x));
      if (!item_upload_success) {
        all_successful = false;
        return false;
      }
    }
    return all_successful;
  };
  log_syncing_active = false;
  out$.start_syncing_all_logs = start_syncing_all_logs = async function(){
    var log_names, i$, len$, logname, all_successful;
    if (log_syncing_active) {
      dlog('log_syncing already active');
      return;
    }
    log_syncing_active = true;
    while (log_syncing_active) {
      log_names = (await get_log_names());
      for (i$ = 0, len$ = log_names.length; i$ < len$; ++i$) {
        logname = log_names[i$];
        if (!log_syncing_active) {
          return;
        }
        all_successful = (await sync_unsynced_logs(logname));
        if (!all_successful) {
          dlog('error during logs syncing, pausing 120 seconds: ' + logname);
          (await sleep(120000));
        }
      }
      (await sleep(1000));
    }
  };
  out$.stop_syncing_all_logs = stop_syncing_all_logs = function(){
    return log_syncing_active = false;
  };
  make_item_synced_in_collection = async function(collection_name, item){
    var collection, schema, primary_key, query;
    collection = (await getCollection(collection_name));
    schema = get_current_collections()[collection_name];
    primary_key = schema.split(',')[0];
    if (primary_key === 'key') {
      query = item.key;
    } else if (primary_key === '[key+key2]') {
      query = [item.key, item.key2];
    } else {
      throw new Error('collection has primary key that we do not handle: ' + collection_name);
    }
    return (await collection.where(primary_key).equals(query).and(function(x){
      return x.timestamp === item.timestamp;
    }).modify({
      synced: 1
    }));
  };
  upload_collection_item_to_server = async function(name, data){
    var logging_server_url, collection, upload_successful, response, e;
    if (localStorage.getItem('local_logging_server') === 'true') {
      logging_server_url = 'http://localhost:5000/';
    } else {
      logging_server_url = 'https://habitlab.herokuapp.com/';
    }
    collection = (await getCollection(name));
    data = import$({}, data);
    data.userid = (await get_user_id());
    data.collection = name;
    data.habitlab_version = habitlab_version;
    if (developer_mode) {
      data.developer_mode = true;
    }
    if (unofficial_version) {
      data.unofficial_version = chrome.runtime.id;
    }
    upload_successful = true;
    try {
      response = (await post_json(logging_server_url + 'sync_collection_item', data));
      if (response.success) {
        (await make_item_synced_in_collection(name, data));
      } else {
        upload_successful = false;
        dlog('response from server was not successful in upload_collection_item_to_server');
        dlog(response);
        dlog(data);
      }
    } catch (e$) {
      e = e$;
      dlog('error thrown in upload_collection_item_to_server');
      dlog(e);
      upload_successful = false;
    }
    return upload_successful;
  };
  out$.sync_unsynced_items_in_db_collection = sync_unsynced_items_in_db_collection = async function(name){
    var collection, num_unsynced, unsynced_items, all_successful, i$, len$, x, item_upload_success;
    collection = (await getCollection(name));
    num_unsynced = (await collection.where('synced').equals(0).count());
    if (num_unsynced === 0) {
      return true;
    }
    dlog('syncing db items ' + name + ' num_unsynced is: ' + num_unsynced);
    unsynced_items = (await collection.where('synced').equals(0).toArray());
    all_successful = true;
    for (i$ = 0, len$ = unsynced_items.length; i$ < len$; ++i$) {
      x = unsynced_items[i$];
      item_upload_success = (await upload_collection_item_to_server(name, x));
      if (!item_upload_success) {
        all_successful = false;
        return false;
      }
    }
    return all_successful;
  };
  db_syncing_active = false;
  out$.start_syncing_all_db_collections = start_syncing_all_db_collections = async function(){
    var collection_names, infrequently_synced, sync_nums, i$, len$, collection_name, all_successful;
    if (db_syncing_active) {
      dlog('db_syncing already active');
      return;
    }
    db_syncing_active = true;
    collection_names = list_collections_to_sync();
    infrequently_synced = ['seconds_on_domain_per_day', 'seconds_on_domain_per_session', 'custom_measurements_each_day', 'visits_to_domain_per_day'];
    sync_nums = {};
    for (i$ = 0, len$ = infrequently_synced.length; i$ < len$; ++i$) {
      collection_name = infrequently_synced[i$];
      sync_nums[collection_name] = 120;
    }
    while (db_syncing_active) {
      for (i$ = 0, len$ = collection_names.length; i$ < len$; ++i$) {
        collection_name = collection_names[i$];
        if (!db_syncing_active) {
          return;
        }
        if (infrequently_synced.includes(collection_name)) {
          sync_nums[collection_name] += 1;
          if (sync_nums[collection_name] < 120) {
            continue;
          } else {
            sync_nums[collection_name] = 0;
          }
        }
        all_successful = (await sync_unsynced_items_in_db_collection(collection_name));
        if (!all_successful) {
          dlog('error during collection syncing, pausing 1200 seconds: ' + collection_name);
          (await sleep(1200000));
        }
      }
      (await sleep(1000));
    }
  };
  out$.stop_syncing_all_db_collections = stop_syncing_all_db_collections = function(){
    return db_syncing_active = false;
  };
  gexport_module('log_sync_utils', function(it){
    return eval(it);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
