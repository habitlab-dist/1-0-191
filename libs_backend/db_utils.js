(function(){
  var ref$, memoize, memoizeSingleAsync, dexie, gexport, gexport_module, get_db_major_version_db, get_db_minor_version_db, get_current_schema_db, get_current_dbver_db, delete_db_if_outdated_db, current_schema_for_collections, get_current_collections, list_collections_to_sync, is_collection_synced, sleep, local_cache_db, getdb_running, getDb, deleteDbCollection, deleteDb, getCollection, addtovar, setvar, getvar, clearvar, printvar, remove_key_from_var_dict, remove_item_from_var_list, addtolist, getlist, clearlist, addtolist_for_key, getlist_for_key, clearlist_for_key, setkey_dict, addtokey_dict, getkey_dict, delkey_dict, getdict, setdict, cleardict, getdictdict, getdict_for_key_dictdict, getdict_for_key2_dictdict, getkey_dictdict, setdict_for_key2_dictdict, setdict_for_key_dictdict, setkey_dictdict, addtokey_dictdict, clear_dictdict, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/memoize'), memoize = ref$.memoize, memoizeSingleAsync = ref$.memoizeSingleAsync;
  dexie = require('dexie');
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.get_db_major_version_db = get_db_major_version_db = function(){
    return '5';
  };
  out$.get_db_minor_version_db = get_db_minor_version_db = function(){
    return '1';
  };
  out$.get_current_schema_db = get_current_schema_db = function(){
    var result;
    result = localStorage.getItem('current_schema_db');
    if (result == null) {
      return {};
    }
    return JSON.parse(result);
  };
  out$.get_current_dbver_db = get_current_dbver_db = function(){
    var result;
    result = localStorage.getItem('current_dbver_db');
    if (result == null) {
      return 0;
    }
    return parseInt(result);
  };
  out$.delete_db_if_outdated_db = delete_db_if_outdated_db = async function(){
    if (localStorage.getItem('db_minor_version_db') !== get_db_minor_version_db()) {
      localStorage.setItem('db_minor_version_db', get_db_minor_version_db());
    }
    if (localStorage.getItem('db_major_version_db') !== get_db_major_version_db()) {
      (await deleteDb());
      localStorage.removeItem('current_schema_db');
      localStorage.setItem('db_major_version_db', get_db_major_version_db());
    }
  };
  current_schema_for_collections = {
    vars: 'key,synced',
    intervention_vars_synced: '[key+key2],key,key2,synced',
    intervention_vars_unsynced: '[key+key2],key,key2',
    goal_vars_synced: '[key+key2],key,key2,synced',
    goal_vars_unsynced: '[key+key2],key,key2',
    interventions_enabled_each_day: '[key+key2],key,key2,synced',
    interventions_manually_managed_each_day: '[key+key2],key,key2,synced',
    seconds_on_domain_per_day: '[key+key2],key,key2,synced',
    visits_to_domain_per_day: '[key+key2],key,key2,synced',
    intervention_to_parameters: '[key+key2],key,key2,synced',
    custom_measurements_each_day: '[key+key2],key,key2,synced',
    seconds_on_domain_per_session: '[key+key2],key,key2,synced',
    interventions_active_for_domain_and_session: '[key+key2],key,key2,synced',
    domain_to_last_session_id: 'key,synced',
    interventions_currently_disabled: 'key,synced',
    goal_targets: 'key,synced',
    seconds_saved_for_intervention: 'key,synced',
    seconds_saved_for_domain: 'key,synced',
    seconds_saved_for_intervention_on_domain: '[key+key2],key,key2,synced',
    baseline_session_time_on_domains: 'key,synced',
    baseline_time_on_domains: 'key,synced',
    times_intervention_used: 'key,synced',
    intervention_downvote_timestamps: '++,key,synced',
    intervention_upvote_timestamps: '++,key,synced',
    intervention_feedback: '++,key,synced'
  };
  out$.get_current_collections = get_current_collections = function(){
    return current_schema_for_collections;
  };
  out$.list_collections_to_sync = list_collections_to_sync = function(){
    var output, k, ref$, v;
    output = [];
    for (k in ref$ = current_schema_for_collections) {
      v = ref$[k];
      if (v.endsWith(',synced')) {
        output.push(k);
      }
    }
    return output;
  };
  out$.is_collection_synced = is_collection_synced = function(collection_name){
    if (current_schema_for_collections[collection_name] != null && current_schema_for_collections[collection_name].endsWith(',synced')) {
      return true;
    }
    return false;
  };
  sleep = async function(time){
    return new Promise(function(it){
      return setTimeout(it, time);
    });
  };
  local_cache_db = null;
  getdb_running = false;
  out$.getDb = getDb = async function(){
    var db, dbver, prev_schema, stores_to_create, current_collections, k, v, new_schema, res$;
    if (local_cache_db != null && local_cache_db.isOpen()) {
      return local_cache_db;
    }
    if (getdb_running) {
      while (getdb_running) {
        (await sleep(1));
      }
      while (getdb_running || local_cache_db === null) {
        (await sleep(1));
      }
      return local_cache_db;
    }
    getdb_running = true;
    (await delete_db_if_outdated_db());
    db = new dexie('habitlab', {
      autoOpen: false
    });
    dbver = get_current_dbver_db();
    prev_schema = get_current_schema_db();
    stores_to_create = {};
    current_collections = get_current_collections();
    for (k in current_collections) {
      v = current_collections[k];
      if (prev_schema[k] == null) {
        stores_to_create[k] = v;
      }
    }
    res$ = {};
    for (k in prev_schema) {
      v = prev_schema[k];
      res$[k] = v;
    }
    new_schema = res$;
    if (Object.keys(stores_to_create).length > 0) {
      db.version(dbver).stores(prev_schema);
      dbver += 1;
      for (k in stores_to_create) {
        v = stores_to_create[k];
        new_schema[k] = v;
      }
      localStorage.setItem('current_schema_db', JSON.stringify(new_schema));
      localStorage.setItem('current_dbver_db', dbver);
    }
    db.version(dbver).stores(new_schema);
    db.on('versionchange', function(){
      var prev_schema;
      db.close();
      prev_schema = get_current_schema_db();
      dbver = parseInt(localStorage.getItem('current_dbver_db'));
      db.version(dbver).stores(prev_schema);
      db.open().then(function(new_db){
        return local_cache_db = new_db;
      });
      return false;
    });
    local_cache_db = (await db.open());
    getdb_running = false;
    return local_cache_db;
  };
  out$.deleteDbCollection = deleteDbCollection = async function(collection_name){
    var db, dbver, schema;
    db = (await getDb());
    db.close();
    dbver = get_current_dbver_db();
    dbver += 1;
    schema = get_current_schema_db();
    schema[collection_name] = null;
    db.version(dbver).stores(schema);
    localStorage.setItem('current_schema_db', JSON.stringify(schema));
    localStorage.setItem('current_dbver_db', dbver);
    return local_cache_db = (await db.open());
  };
  out$.deleteDb = deleteDb = async function(){
    var db;
    console.log('deleteDb called');
    localStorage.removeItem('current_schema_db');
    localStorage.removeItem('current_dbver_db');
    db = new dexie('habitlab');
    (await db['delete']());
  };
  out$.getCollection = getCollection = async function(collection_name){
    var db;
    db = (await getDb());
    return db[collection_name];
  };
  out$.addtovar = addtovar = async function(key, val){
    var data, new_val, num_modified;
    data = (await getCollection('vars'));
    new_val = val;
    num_modified = (await data.where('key').equals(key).modify(function(x){
      x.synced = 0;
      x.val += val;
      return new_val = x.val;
    }));
    if (num_modified === 1) {
      return new_val;
    }
    if (num_modified > 1) {
      console.log("addtovar " + key + " matched more than 1");
      return new_val;
    }
    return (await setvar(key, val));
  };
  out$.setvar = setvar = async function(key, val){
    var data;
    data = (await getCollection('vars'));
    (await data.put({
      key: key,
      val: val,
      synced: 0,
      timestamp: Date.now()
    }));
    return val;
  };
  out$.getvar = getvar = async function(key){
    var data, result;
    data = (await getCollection('vars'));
    result = (await data.get(key));
    if (result != null) {
      return result.val;
    } else {
      return null;
    }
  };
  out$.clearvar = clearvar = async function(key){
    var data, num_deleted;
    data = (await getCollection('vars'));
    num_deleted = (await data.where('key').equals(key)['delete']());
  };
  out$.printvar = printvar = async function(key){
    var result;
    result = (await getvar(key));
    console.log(result);
    return result;
  };
  out$.remove_key_from_var_dict = remove_key_from_var_dict = async function(dictname, key){
    var dict_text, dict;
    dict_text = (await getvar(dictname));
    if (dict_text != null) {
      dict = JSON.parse(dict_text);
    } else {
      dict = {};
    }
    if (dict[key] != null) {
      delete dict[key];
    }
    (await setvar(dictname, JSON.stringify(dict)));
  };
  out$.remove_item_from_var_list = remove_item_from_var_list = async function(listname, item){
    var list_text, list;
    list_text = (await getvar(listname));
    if (list_text != null) {
      list = JSON.parse(list_text);
    } else {
      list = [];
    }
    list = list.filter(function(it){
      return it !== item;
    });
    return (await setvar(listname, JSON.stringify(list)));
  };
  out$.addtolist = addtolist = async function(name, val){
    var data, result;
    data = (await getCollection(name));
    result = (await data.add(val));
    return val;
  };
  out$.getlist = getlist = async function(name){
    var data, result;
    data = (await getCollection(name));
    result = (await data.toArray());
    return result;
  };
  out$.clearlist = clearlist = async function(name){
    var data, num_deleted;
    data = (await getCollection(name));
    num_deleted = (await data['delete']());
  };
  out$.addtolist_for_key = addtolist_for_key = async function(name, key, val){
    var data, newval, result;
    data = (await getCollection(name));
    newval = {
      key: key,
      val: val
    };
    result = (await data.add(newval));
    return newval;
  };
  out$.getlist_for_key = getlist_for_key = async function(name, key){
    var data, result, this$ = this;
    data = (await getCollection(name));
    result = (await data.where('key').equals(key).toArray());
    return result.map(function(it){
      return it.val;
    });
  };
  out$.clearlist_for_key = clearlist_for_key = async function(name, key){
    var data, num_deleted;
    data = (await getCollection(name));
    num_deleted = (await data.where('key').equals(key)['delete']());
  };
  out$.setkey_dict = setkey_dict = async function(name, key, val){
    var data, result;
    data = (await getCollection(name));
    result = (await data.put({
      key: key,
      val: val,
      synced: 0,
      timestamp: Date.now()
    }));
    return val;
  };
  out$.addtokey_dict = addtokey_dict = async function(name, key, val){
    var data, new_val, num_modified;
    data = (await getCollection(name));
    new_val = val;
    num_modified = (await data.where('key').equals(key).modify(function(x){
      x.synced = 0;
      x.val += val;
      return new_val = x.val;
    }));
    if (num_modified === 1) {
      return new_val;
    }
    if (num_modified > 1) {
      console.log("addtokey_dict " + name + " " + key + " matched more than 1");
      return new_val;
    }
    return (await setkey_dict(name, key, val));
  };
  out$.getkey_dict = getkey_dict = async function(name, key){
    var data, result;
    data = (await getCollection(name));
    result = (await data.where('key').equals(key).toArray());
    if (result.length > 0) {
      return result[0].val;
    }
  };
  out$.delkey_dict = delkey_dict = async function(name, key){
    var data, num_deleted;
    data = (await getCollection(name));
    num_deleted = (await data.where('key').equals(key)['delete']());
  };
  out$.getdict = getdict = async function(name){
    var data, result, key, val;
    data = (await getCollection(name));
    result = (await data.toArray());
    return (await (async function(){
      var i$, ref$, len$, ref1$, resultObj$ = {};
      for (i$ = 0, len$ = (ref$ = result).length; i$ < len$; ++i$) {
        ref1$ = ref$[i$], key = ref1$.key, val = ref1$.val;
        resultObj$[key] = val;
      }
      return resultObj$;
    }()));
  };
  out$.setdict = setdict = async function(name, dict){
    var data, items_to_add, res$, key, val, result;
    data = (await getCollection(name));
    res$ = [];
    for (key in dict) {
      val = dict[key];
      res$.push({
        key: key,
        val: val,
        synced: 0,
        timestamp: Date.now()
      });
    }
    items_to_add = res$;
    result = (await data.bulkPut(items_to_add));
    return dict;
  };
  out$.cleardict = cleardict = async function(name){
    var data, num_deleted;
    data = (await getCollection(name));
    num_deleted = (await data.filter(function(){
      return true;
    })['delete']());
  };
  out$.getdictdict = getdictdict = async function(name){
    var data, result, key, key2, val;
    data = (await getCollection(name));
    result = (await data.toArray());
    return (await (async function(){
      var i$, ref$, len$, ref1$, resultObj$ = {};
      for (i$ = 0, len$ = (ref$ = result).length; i$ < len$; ++i$) {
        ref1$ = ref$[i$], key = ref1$.key, key2 = ref1$.key2, val = ref1$.val;
        resultObj$[key] = key2;
      }
      return resultObj$;
    }()));
  };
  out$.getdict_for_key_dictdict = getdict_for_key_dictdict = async function(name, key){
    var data, result, output, i$, len$, ref$, key2, val;
    data = (await getCollection(name));
    result = (await data.where('key').equals(key).toArray());
    if (result.length > 0) {
      output = {};
      for (i$ = 0, len$ = result.length; i$ < len$; ++i$) {
        ref$ = result[i$], key2 = ref$.key2, val = ref$.val;
        output[key2] = val;
      }
      return output;
    }
    return {};
  };
  out$.getdict_for_key2_dictdict = getdict_for_key2_dictdict = async function(name, key2){
    var data, result, output, i$, len$, ref$, key, val;
    data = (await getCollection(name));
    result = (await data.where('key2').equals(key2).toArray());
    if (result.length > 0) {
      output = {};
      for (i$ = 0, len$ = result.length; i$ < len$; ++i$) {
        ref$ = result[i$], key = ref$.key, val = ref$.val;
        output[key] = val;
      }
      return output;
    }
    return {};
  };
  out$.getkey_dictdict = getkey_dictdict = async function(name, key, key2){
    var data, result;
    data = (await getCollection(name));
    result = (await data.where('[key+key2]').equals([key, key2]).toArray());
    if (result.length > 0) {
      return result[0].val;
    }
  };
  out$.setdict_for_key2_dictdict = setdict_for_key2_dictdict = async function(name, key2, dict){
    var data, items_to_add, res$, key, val, result;
    data = (await getCollection(name));
    res$ = [];
    for (key in dict) {
      val = dict[key];
      res$.push({
        key: key,
        key2: key2,
        val: val,
        synced: 0,
        timestamp: Date.now()
      });
    }
    items_to_add = res$;
    result = (await data.bulkPut(items_to_add));
    return dict;
  };
  out$.setdict_for_key_dictdict = setdict_for_key_dictdict = async function(name, key, dict){
    var data, items_to_add, res$, key2, val, result;
    data = (await getCollection(name));
    res$ = [];
    for (key2 in dict) {
      val = dict[key2];
      res$.push({
        key: key,
        key2: key2,
        val: val,
        synced: 0,
        timestamp: Date.now()
      });
    }
    items_to_add = res$;
    result = (await data.bulkPut(items_to_add));
    return dict;
  };
  out$.setkey_dictdict = setkey_dictdict = async function(name, key, key2, val){
    var data, result;
    data = (await getCollection(name));
    result = (await data.put({
      key: key,
      key2: key2,
      val: val,
      synced: 0,
      timestamp: Date.now()
    }));
    return val;
  };
  out$.addtokey_dictdict = addtokey_dictdict = async function(name, key, key2, val){
    var data, new_val, num_modified;
    data = (await getCollection(name));
    new_val = val;
    num_modified = (await data.where('[key+key2]').equals([key, key2]).modify(function(x){
      x.synced = 0;
      x.val += val;
      return new_val = x.val;
    }));
    if (num_modified === 1) {
      return new_val;
    }
    if (num_modified > 1) {
      console.log("addtokey_dictdict " + name + " " + key + " " + key2 + " matched more than 1");
      return new_val;
    }
    return (await setkey_dictdict(name, key, key2, val));
  };
  out$.clear_dictdict = clear_dictdict = async function(name){
    var data, num_deleted;
    data = (await getCollection(name));
    num_deleted = (await data.filter(function(){
      return true;
    })['delete']());
  };
  gexport_module('db_utils_backend', function(it){
    return eval(it);
  });
}).call(this);
