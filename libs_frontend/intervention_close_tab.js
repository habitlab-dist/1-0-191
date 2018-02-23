(function(){
  var get_tab_id, close_tab_with_id, close_current_tab;
  get_tab_id = require('libs_common/intervention_info').get_tab_id;
  close_tab_with_id = require('libs_frontend/tab_utils').close_tab_with_id;
  /*
  * Close the current tab in Chrome
  */
  close_current_tab = async function(){
    var tab_id;
    tab_id = get_tab_id();
    return (await close_tab_with_id(tab_id));
  };
  module.exports = {
    close_current_tab: close_current_tab
  };
}).call(this);
