(function(){
  var ref$, getkey_dictdict, setkey_dictdict, addtokey_dictdict, get_days_since_epoch, gexport, gexport_module, set_measurement, set_measurement_for_days_before_today, increment_measurement, add_to_measurement, add_to_measurement_days_before_today, get_measurement, get_measurement_for_days_before_today, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/db_utils'), getkey_dictdict = ref$.getkey_dictdict, setkey_dictdict = ref$.setkey_dictdict, addtokey_dictdict = ref$.addtokey_dictdict;
  get_days_since_epoch = require('libs_common/time_utils').get_days_since_epoch;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.set_measurement = set_measurement = async function(measurement_name, new_value){
    return (await set_measurement_for_days_before_today(measurement_name, 0, new_value));
  };
  out$.set_measurement_for_days_before_today = set_measurement_for_days_before_today = async function(measurement_name, days_ago, new_value){
    var current_day;
    current_day = get_days_since_epoch();
    return (await setkey_dictdict('custom_measurements_each_day', measurement_name, current_day - days_ago, new_value));
  };
  out$.increment_measurement = increment_measurement = async function(measurement_name){
    return (await add_to_measurement(measurement_name, 1));
  };
  out$.add_to_measurement = add_to_measurement = async function(measurement_name, amount_to_add){
    var current_day;
    current_day = get_days_since_epoch();
    return (await addtokey_dictdict('custom_measurements_each_day', measurement_name, current_day, amount_to_add));
  };
  out$.add_to_measurement_days_before_today = add_to_measurement_days_before_today = async function(measurement_name, days_ago, amount_to_add){
    var current_day;
    current_day = get_days_since_epoch();
    return (await addtokey_dictdict('custom_measurements_each_day', measurement_name, current_day - days_ago, amount_to_add));
  };
  out$.get_measurement = get_measurement = async function(measurement_name){
    return (await get_measurement_for_days_before_today(measurement_name, 0));
  };
  out$.get_measurement_for_days_before_today = get_measurement_for_days_before_today = async function(measurement_name, days_ago){
    var current_day, result;
    current_day = get_days_since_epoch();
    result = (await getkey_dictdict('custom_measurements_each_day', measurement_name, current_day - days_ago));
    return result != null ? result : 0;
  };
  gexport_module('measurement_utils', function(it){
    return eval(it);
  });
}).call(this);
