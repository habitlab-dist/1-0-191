(function(){
  var open_debug_page_for_tab_id, get_tab_id, open_debug_page;
  open_debug_page_for_tab_id = require('libs_frontend/debug_console_utils').open_debug_page_for_tab_id;
  get_tab_id = require('libs_common/intervention_info').get_tab_id;
  open_debug_page = async function(){
    var tab_id;
    tab_id = get_tab_id();
    return (await open_debug_page_for_tab_id(tab_id));
  };
  module.exports.open_debug_page = open_debug_page;
}).call(this);
