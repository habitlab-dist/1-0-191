(function(){
  var swal, $, polymer_ext, load_css_file, ref$, start_syncing_all_data, stop_syncing_all_data, send_logging_enabled, send_logging_disabled, get_user_id, msg, log_pagenav;
  swal = require('sweetalert2');
  $ = require('jquery');
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_backend/log_sync_utils'), start_syncing_all_data = ref$.start_syncing_all_data, stop_syncing_all_data = ref$.stop_syncing_all_data;
  ref$ = require('libs_backend/logging_enabled_utils'), send_logging_enabled = ref$.send_logging_enabled, send_logging_disabled = ref$.send_logging_disabled;
  get_user_id = require('libs_backend/background_common').get_user_id;
  msg = require('libs_common/localization_utils').msg;
  log_pagenav = require('libs_backend/log_utils').log_pagenav;
  polymer_ext({
    is: 'onboarding-view',
    properties: {
      slide_idx: {
        type: Number,
        value: window.hashdata_unparsed === 'last' ? 3 : 0,
        observer: 'slide_changed'
      },
      prev_slide_idx: {
        type: Number,
        value: 0
      },
      allow_logging: {
        type: Boolean,
        value: function(){
          var stored_value;
          stored_value = localStorage.getItem('allow_logging');
          if (stored_value != null) {
            return stored_value === 'true';
          }
          return true;
        }(),
        observer: 'allow_logging_changed'
      },
      geza_meoaddr: {
        type: String,
        value: [['gko', 'vacs'].join(''), ['stan', 'ford', '.', 'edu'].join('')].join('@')
      },
      habitlab_logo_url: {
        type: String,
        value: chrome.extension.getURL('icons/logo_gradient.svg')
      },
      habitlab_logo_white_url: {
        type: String,
        value: chrome.extension.getURL('icons/habitlab_icon_white_gradient.svg')
      }
    },
    see_what_gets_loggged_clicked: function(evt){
      return evt.stopPropagation();
    },
    get_stanford_icon: function(){
      return chrome.extension.getURL('icons/stanford.svg');
    },
    allow_logging_changed: function(allow_logging, prev_value_allow_logging){
      var send_change, prev_allow_logging;
      if (prev_value_allow_logging == null) {
        return;
      }
      if (allow_logging == null) {
        return;
      }
      send_change = true;
      prev_allow_logging = localStorage.getItem('allow_logging');
      if (prev_allow_logging != null) {
        prev_allow_logging = prev_allow_logging === 'true';
        if (prev_allow_logging === allow_logging) {
          send_change = false;
        }
      }
      localStorage.setItem('allow_logging', allow_logging);
      if (allow_logging) {
        if (send_change) {
          send_logging_enabled({
            page: 'onboarding',
            manual: true
          });
        }
        return start_syncing_all_data();
      } else {
        if (send_change) {
          send_logging_disabled({
            page: 'onboarding',
            manual: true
          });
        }
        return stop_syncing_all_data();
      }
    },
    slide_changed: function(evt){
      var self, prev_slide_idx, slide, prev_slide;
      self = this;
      this.SM('.slide').stop();
      prev_slide_idx = this.prev_slide_idx;
      this.prev_slide_idx = this.slide_idx;
      slide = this.SM('.slide').eq(this.slide_idx);
      if (slide.find('.scroll_wrapper').length > 0) {
        slide.find('.scroll_wrapper')[0].scrollTop = 0;
      }
      if (prev_slide_idx === this.slide_idx - 1) {
        prev_slide = this.SM('.slide').eq(prev_slide_idx);
        prev_slide.animate({
          top: '-100vh'
        }, 1000);
        slide.css('top', '100vh');
        slide.show();
        slide.animate({
          top: '0px'
        }, 1000);
        this.animation_inprogress = true;
        setTimeout(function(){
          return self.animation_inprogress = false;
        }, 1000);
      } else if (prev_slide_idx === this.slide_idx + 1) {
        prev_slide = this.SM('.slide').eq(prev_slide_idx);
        prev_slide.animate({
          top: '+100vh'
        }, 1000);
        slide.css('top', '-100vh');
        slide.show();
        slide.animate({
          top: '0px'
        }, 1000);
        this.animation_inprogress = true;
        setTimeout(function(){
          self.animation_inprogress = false;
          return prev_slide.hide();
        }, 1000);
      } else {
        this.SM('.slide').hide();
        slide.show();
        slide.css('top', '0px');
        this.animation_inprogress = false;
      }
      return log_pagenav({
        tab: 'onboarding',
        prev_slide_idx: prev_slide_idx,
        slide_idx: this.slide_idx
      });
    },
    onboarding_complete: function(){
      this.$$('#dialog').open();
      console.log('onboarding_completed dialog opened');
      if (localStorage.getItem('allow_logging') == null) {
        localStorage.setItem('allow_logging_on_default_with_onboarding', true);
        localStorage.setItem('allow_logging', true);
        send_logging_enabled({
          page: 'onboarding',
          manual: false,
          allow_logging_on_default_with_onboarding: true
        });
        start_syncing_all_data();
      }
      localStorage.setItem('onboarding_complete', 'true');
      $('body').css('overflow', 'auto');
      return this.fire('onboarding-complete', {});
    },
    next_button_clicked: async function(){
      var last_slide_idx;
      if (this.animation_inprogress) {
        return;
      }
      last_slide_idx = this.SM('.slide').length - 1;
      if (this.slide_idx === last_slide_idx) {
        this.onboarding_complete();
        return;
      }
      return this.next_slide();
    },
    next_slide: function(evt){
      var last_slide_idx;
      if (this.animation_inprogress) {
        return;
      }
      last_slide_idx = this.SM('.slide').length - 1;
      if (this.slide_idx === last_slide_idx) {
        return;
      }
      this.slide_idx = Math.min(last_slide_idx, this.slide_idx + 1);
      last_slide_idx = this.SM('.slide').length - 1;
      if (this.slide_idx === last_slide_idx - 1) {
        return;
      }
      return this.SM('.onboarding_complete').show();
    },
    prev_slide: function(){
      var last_slide_idx;
      if (this.animation_inprogress) {
        return;
      }
      this.slide_idx = Math.max(0, this.slide_idx - 1);
      last_slide_idx = this.SM('.slide').length - 1;
      if (this.slide_idx === last_slide_idx) {
        return;
      }
      return this.SM('.onboarding_complete').hide();
    },
    rerender_onboarding_badges: function(){
      return this.$$('#badges_received').rerender();
    },
    get_icon: function(img_path){
      return chrome.extension.getURL('icons/' + img_path);
    },
    keydown_listener: function(evt){
      if (evt.which === 39 || evt.which === 40) {
        return this.next_slide();
      } else if (evt.which === 37 || evt.which === 38) {
        return this.prev_slide();
      }
    },
    mousewheel_listener: function(evt){
      var last_slide_idx;
      if (this.animation_inprogress) {
        evt.preventDefault();
        return;
      }
      last_slide_idx = this.SM('.slide').length - 1;
    },
    detached: function(){
      window.removeEventListener('keydown', this.keydown_listener_bound);
      window.removeEventListener('mousewheel', this.mousewheel_listener_bound);
      return window.removeEventListener('resize', this.window_resized_bound);
    },
    window_resized: function(){
      var current_height, target_height, current_width, target_width, scale_height, scale_width, scale;
      if (this.slide_idx === 1) {
        this.$.goal_selector.repaint_due_to_resize();
        return;
      } else if (this.slide_idx === 2) {
        this.$.positive_goal_selector.repaint_due_to_resize();
      }
      current_height = 400;
      target_height = window.innerHeight - 80;
      current_width = 600;
      target_width = window.innerWidth - 20;
      scale_height = target_height / current_height;
      scale_width = target_width / current_width;
      scale = Math.min(scale_height, scale_width);
      return this.SM('.inner_slide').css({
        transform: 'scale(' + scale + ')'
      });
    },
    attached: function(){
      return this.window_resized();
    },
    insert_iframe_for_setting_userid: async function(){
      var userid, userid_setting_iframe;
      userid = (await get_user_id());
      userid_setting_iframe = $('<iframe id="setuseridiframe" src="https://habitlab.stanford.edu/setuserid?userid=' + userid + '" style="width: 0; height: 0; pointer-events: none; opacity: 0; display: none"></iframe>');
      return $('body').append(userid_setting_iframe);
    },
    ready: async function(){
      var self;
      $('body').css('overflow', 'hidden');
      self = this;
      this.$$('#goal_selector').set_sites_and_goals();
      this.$$('#positive_goal_selector').set_sites_and_goals();
      this.last_mousewheel_time = 0;
      this.last_mousewheel_deltaY = 0;
      this.keydown_listener_bound = this.keydown_listener.bind(this);
      this.mousewheel_listener_bound = this.mousewheel_listener.bind(this);
      this.window_resized_bound = this.window_resized.bind(this);
      window.addEventListener('keydown', this.keydown_listener_bound);
      window.addEventListener('mousewheel', this.mousewheel_listener_bound);
      window.addEventListener('resize', this.window_resized_bound);
      (await load_css_file('sweetalert2'));
      /*
      this.$.pagepiling.addEventListener 'mousewheel', (evt) ->
        console.log 'mousewheel on pagepiling'
        evt.preventDefault()
        evt.stopPropagation()
        return
      this.$.pagepiling.addEventListener 'wheel', (evt) ->
        console.log 'wheel on pagepiling'
        evt.preventDefault()
        evt.stopPropagation()
        return
      window.addEventListener 'mousewheel', (evt) ->
        console.log 'mousewheel on window'
        evt.preventDefault()
        evt.stopPropagation()
        return
      window.addEventListener 'wheel', (evt) ->
        console.log 'wheel on window'
        evt.preventDefault()
        evt.stopPropagation()
        return
      */
      if (chrome.runtime.getManifest().update_url == null) {
        if (localStorage.getItem('enable_debug_terminal') == null) {
          localStorage.setItem('enable_debug_terminal', 'true');
        }
      }
      console.log('calling set_sites_and_goals');
      this.$$('#goal_selector').repaint_due_to_resize_once_in_view();
      this.$$('#positive_goal_selector').repaint_due_to_resize_once_in_view();
      return this.insert_iframe_for_setting_userid();
    }
  }, [
    {
      source: require('libs_frontend/polymer_methods'),
      methods: ['S', 'SM', 'is_not_equal_to_any', 'is_equal']
    }, {
      source: require('libs_common/localization_utils'),
      methods: ['msg']
    }
  ]);
}).call(this);
