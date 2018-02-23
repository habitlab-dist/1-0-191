(function(){
  var get_intervention, log_utils, log_impression, log_disable, log_action, log_upvote, log_downvote, log_feedback, out$ = typeof exports != 'undefined' && exports || this;
  get_intervention = require('libs_common/intervention_info').get_intervention;
  log_utils = require('libs_frontend/log_utils');
  out$.log_impression = log_impression = async function(data){
    if (data == null) {
      data = {};
    }
    data.url = window.location.href;
    return (await log_utils.log_impression_internal(get_intervention().name, data));
  };
  out$.log_disable = log_disable = async function(data){
    if (data == null) {
      data = {};
    }
    data = {};
    data.url = window.location.href;
    return (await log_utils.log_disable_internal(get_intervention().name, data));
  };
  out$.log_action = log_action = async function(data){
    if (data == null) {
      data = {};
    }
    data = {};
    data.url = window.location.href;
    return (await log_utils.log_action_internal(get_intervention().name, data));
  };
  out$.log_upvote = log_upvote = async function(data){
    if (data == null) {
      data = {};
    }
    data = {};
    data.url = window.location.href;
    return (await log_utils.log_upvote_internal(get_intervention().name, data));
  };
  out$.log_downvote = log_downvote = async function(data){
    if (data == null) {
      data = {};
    }
    data = {};
    data.url = window.location.href;
    return (await log_utils.log_downvote_internal(get_intervention().name, data));
  };
  out$.log_feedback = log_feedback = async function(data){
    if (data == null) {
      data = {};
    }
    data = {};
    data.url = window.location.href;
    return (await log_utils.log_feedback_internal(get_intervention().name, data));
  };
}).call(this);
