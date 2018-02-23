(function(){
  var get_screenshot_as_base64, $, add_screenshot_overlay, remove_screenshot_overlay, out$ = typeof exports != 'undefined' && exports || this;
  get_screenshot_as_base64 = require('libs_common/screenshot_utils').get_screenshot_as_base64;
  $ = require('jquery');
  out$.add_screenshot_overlay = add_screenshot_overlay = async function(){
    var base64_data, overlay_img;
    base64_data = (await get_screenshot_as_base64());
    overlay_img = $('<img>').attr('src', base64_data).attr('id', 'screenshot_overlay');
    overlay_img.css({
      position: 'fixed',
      width: document.documentElement.clientWidth + 'px',
      height: document.documentElement.clientHeight + 'px',
      top: '0px',
      left: '0px',
      'z-index': 2147483646
    });
    return overlay_img.appendTo($('body'));
  };
  out$.remove_screenshot_overlay = remove_screenshot_overlay = function(){
    return $('#screenshot_overlay').remove();
  };
}).call(this);
