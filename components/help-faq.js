(function(){
  var polymer_ext, screenshot_utils;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  screenshot_utils = require('libs_common/screenshot_utils');
  polymer_ext({
    is: 'help-faq',
    properties: {
      mailing_list: {
        type: String,
        value: [['habitlab', 'support'].join('-'), ['cs', 'stanford', 'edu'].join('.')].join('@')
      }
    },
    change_tab: function(evt){
      var newtab;
      evt.preventDefault();
      evt.stopPropagation();
      newtab = evt.target.getAttribute('newtab');
      return this.fire('need_tab_change', {
        newtab: newtab
      });
    },
    get_icon: function(){
      return chrome.extension.getURL('icons/icon_19.png');
    },
    submit_feedback_clicked: async function(){
      var screenshot, data, feedback_form;
      screenshot = (await screenshot_utils.get_screenshot_as_base64());
      data = (await screenshot_utils.get_data_for_feedback());
      feedback_form = document.createElement('feedback-form');
      document.body.appendChild(feedback_form);
      feedback_form.screenshot = screenshot;
      feedback_form.other = data;
      return feedback_form.open();
    }
  });
}).call(this);
