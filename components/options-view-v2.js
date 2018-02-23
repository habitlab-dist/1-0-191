(function(){
  var polymer_ext, load_css_file, ref$, is_habitlab_enabled, enable_habitlab, get_goals, get_enabled_goals, list_all_goals, get_favicon_data_for_domain_cached, once_true, promise_all_object, msg, log_pagenav, swal;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  ref$ = require('libs_common/disable_habitlab_utils'), is_habitlab_enabled = ref$.is_habitlab_enabled, enable_habitlab = ref$.enable_habitlab;
  ref$ = require('libs_backend/goal_utils'), get_goals = ref$.get_goals, get_enabled_goals = ref$.get_enabled_goals, list_all_goals = ref$.list_all_goals;
  get_favicon_data_for_domain_cached = require('libs_backend/favicon_utils').get_favicon_data_for_domain_cached;
  once_true = require('libs_common/common_libs').once_true;
  promise_all_object = require('libs_common/promise_utils').promise_all_object;
  msg = require('libs_common/localization_utils').msg;
  log_pagenav = require('libs_backend/log_utils').log_pagenav;
  swal = require('sweetalert2');
  polymer_ext({
    is: 'options-view-v2',
    properties: {
      selected_tab_idx: {
        type: Number,
        observer: 'selected_tab_idx_changed'
      },
      selected_tab_name: {
        type: String,
        computed: 'compute_selected_tab_name(selected_tab_idx, enabled_goal_info_list)',
        observer: 'selected_tab_name_changed'
      },
      is_habitlab_disabled: {
        type: Boolean
      },
      sidebar_items: {
        type: Array,
        computed: 'compute_sidebar_items(enabled_goal_info_list, goal_name_to_icon)'
      },
      enabled_goal_info_list: {
        type: Array
      },
      have_options_page_hash: {
        type: Boolean
      },
      goal_name_to_icon: {
        type: Object,
        value: {}
      }
    },
    listeners: {
      goal_changed: 'on_goal_changed',
      need_rerender: 'rerender',
      need_tab_change: 'on_need_tab_change'
    },
    compute_sidebar_items: function(enabled_goal_info_list, goal_name_to_icon){
      var default_icon, output, i$, len$, x, ref$;
      default_icon = chrome.extension.getURL('icons/loading.gif');
      output = [
        {
          name: msg('Overview'),
          icon: chrome.extension.getURL('icons/results.svg')
        }, {
          name: msg('Settings'),
          icon: chrome.extension.getURL('icons/configure_black.svg')
        }
      ];
      for (i$ = 0, len$ = enabled_goal_info_list.length; i$ < len$; ++i$) {
        x = enabled_goal_info_list[i$];
        output.push({
          name: x.sitename_printable,
          icon: (ref$ = x.icon) != null
            ? ref$
            : (ref$ = goal_name_to_icon[x.name]) != null ? ref$ : default_icon
        });
      }
      output.push({
        name: msg('Help / FAQ'),
        icon: chrome.extension.getURL('icons/help.svg')
      });
      return output;
    },
    enable_habitlab_button_clicked: function(){
      this.is_habitlab_disabled = false;
      return enable_habitlab();
    },
    get_power_icon_src: function(){
      return chrome.extension.getURL('icons/power_button.svg');
    },
    on_need_tab_change: function(evt){
      var ref$;
      if ((evt != null ? (ref$ = evt.detail) != null ? ref$.newtab : void 8 : void 8) != null) {
        return this.set_selected_tab_by_name(evt.detail.newtab);
      }
    },
    set_selected_tab_by_name: async function(selected_tab_name){
      var self, aliases, ref$, name_to_idx_map, selected_tab_idx, goals_list, selected_goal_idx, this$ = this;
      self = this;
      aliases = {
        faq: 'help'
      };
      selected_tab_name = (ref$ = aliases[selected_tab_name]) != null ? ref$ : selected_tab_name;
      name_to_idx_map = {
        'progress': 0,
        'results': 0,
        'dashboard': 0,
        'overview': 0,
        'goals': 1,
        'nudges': 1,
        'configure': 1,
        'config': 1,
        'manage': 1,
        'options': 1,
        'settings': 1,
        'introduction': 1,
        'onboarding': 1
      };
      selected_tab_idx = name_to_idx_map[selected_tab_name];
      if (selected_tab_idx != null) {
        self.selected_tab_idx = selected_tab_idx;
        window.scrollTo(0, 0);
        return;
      }
      (await once_true(function(){
        var ref$;
        return ((ref$ = self.enabled_goal_info_list) != null ? ref$.length : void 8) != null;
      }));
      goals_list = self.enabled_goal_info_list.map(function(it){
        return it.sitename_printable;
      }).map(function(it){
        return it.toLowerCase();
      });
      goals_list.push('help');
      selected_goal_idx = goals_list.indexOf(selected_tab_name);
      if (selected_goal_idx != null) {
        self.selected_tab_idx = selected_goal_idx + 2;
      }
      return window.scrollTo(0, 0);
    },
    compute_selected_tab_name: function(selected_tab_idx, enabled_goal_info_list){
      var goals_list, this$ = this;
      goals_list = enabled_goal_info_list.map(function(it){
        return it.sitename_printable;
      }).map(function(it){
        return it.toLowerCase();
      });
      return ['overview', 'settings'].concat(goals_list).concat(['help'])[selected_tab_idx];
    },
    selected_tab_name_changed: function(selected_tab_name){
      this.fire('options_selected_tab_changed', {
        selected_tab_name: selected_tab_name
      });
      return log_pagenav({
        tab: selected_tab_name
      });
    },
    string_to_id: function(sitename){
      var output, i$, len$, c;
      output = '';
      for (i$ = 0, len$ = sitename.length; i$ < len$; ++i$) {
        c = sitename[i$];
        if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) !== -1) {
          output += c;
        }
      }
      return output.toLowerCase();
    },
    selected_tab_idx_changed: async function(selected_tab_idx){
      var self, overview_tab, goal_idx, goal_sitename_list, goal_sitename, this$ = this;
      self = this;
      if (selected_tab_idx == null || selected_tab_idx === 1) {
        return;
      }
      if (selected_tab_idx === 0) {
        overview_tab = (await self.once_available('#overview_tab'));
        overview_tab.rerender();
        return;
      }
      goal_idx = selected_tab_idx - 2;
      (await once_true(function(){
        var ref$;
        return ((ref$ = self.enabled_goal_info_list) != null ? ref$.length : void 8) != null;
      }));
      goal_sitename_list = self.enabled_goal_info_list.map(function(it){
        return it.sitename_printable;
      }).map(function(it){
        return self.string_to_id(it);
      });
      if (goal_idx < 0 || goal_idx >= goal_sitename_list.length) {
        return;
      }
      goal_sitename = goal_sitename_list[goal_idx];
      once_true(function(){
        var ref$;
        return ((ref$ = self.$$('#siteview_' + goal_sitename)) != null ? ref$.rerender : void 8) != null;
      }, function(){
        return self.$$('#siteview_' + goal_sitename).rerender();
      });
    },
    onboarding_completed: function(){
      return swal({
        title: "Onboarding Complete!",
        text: "Habitlab has directed you to the Settings page. You will be able to manage your Nudges and track your progress here.",
        confirmButtonColor: "#3C5A96"
      });
    },
    on_goal_changed: function(evt){
      console.log('goal changed');
      return this.rerender();
    },
    rerender: async function(){
      var self, ref$, goals, enabled_goals, goals_list, enabled_goal_info_list, i$, len$, goal_name, goal_info, is_enabled;
      self = this;
      is_habitlab_enabled().then(function(is_enabled){
        return self.is_habitlab_disabled = !is_enabled;
      });
      ref$ = [(await get_goals()), (await get_enabled_goals()), (await list_all_goals())], goals = ref$[0], enabled_goals = ref$[1], goals_list = ref$[2];
      enabled_goal_info_list = [];
      for (i$ = 0, len$ = goals_list.length; i$ < len$; ++i$) {
        goal_name = goals_list[i$];
        goal_info = goals[goal_name];
        is_enabled = enabled_goals[goal_name];
        if (!is_enabled) {
          continue;
        }
        enabled_goal_info_list.push(goal_info);
      }
      enabled_goal_info_list.sort(function(a, b){
        if (a.is_positive && !b.is_positive) {
          return 1;
        }
        if (b.is_positive && !a.is_positive) {
          return -1;
        }
        if (a.custom && !b.custom) {
          return 1;
        }
        if (b.custom && !a.custom) {
          return -1;
        }
        if (a.sitename_printable > b.sitename_printable) {
          return 1;
        } else if (a.sitename_printable < b.sitename_printable) {
          return -1;
        }
        return 0;
      });
      self.enabled_goal_info_list = enabled_goal_info_list;
      once_true(function(){
        var ref$;
        return ((ref$ = self.$$('#settings_tab')) != null ? ref$.rerender_privacy_options : void 8) != null;
      }, function(){
        return self.$$('#settings_tab').rerender_privacy_options();
      });
      return async function(){
        var goal_name_to_icon_changed, goal_name_to_new_icon_promises, i$, ref$, len$, goal_info, goal_name_to_new_icons, goal_name, icon;
        goal_name_to_icon_changed = false;
        goal_name_to_new_icon_promises = {};
        for (i$ = 0, len$ = (ref$ = enabled_goal_info_list).length; i$ < len$; ++i$) {
          goal_info = ref$[i$];
          if (goal_info.icon == null) {
            goal_name_to_new_icon_promises[goal_info.name] = get_favicon_data_for_domain_cached(goal_info.domain);
            goal_name_to_icon_changed = true;
          }
        }
        if (goal_name_to_icon_changed) {
          goal_name_to_new_icons = (await promise_all_object(goal_name_to_new_icon_promises));
          for (goal_name in goal_name_to_new_icons) {
            icon = goal_name_to_new_icons[goal_name];
            if (icon == null) {
              icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
            }
            self.goal_name_to_icon[goal_name] = icon;
          }
          self.goal_name_to_icon = JSON.parse(JSON.stringify(self.goal_name_to_icon));
        }
      }();
    },
    ready: async function(){
      (await this.rerender());
      if (!this.have_options_page_hash && this.selected_tab_idx == null) {
        this.selected_tab_idx = 0;
      }
      require('components/sidebar-tabs.deps');
      if (this.selected_tab_idx === 0) {
        require('components/dashboard-view-v2.deps');
      } else if (this.selected_tab_idx === 1) {
        require('components/options-interventions.deps');
      } else if (window.location.hash === '#help' || window.location.hash === '#faq') {
        require('components/help-faq.deps');
      } else {
        require('components/site-view.deps');
      }
      return setTimeout(async function(){
        require('components/options-interventions.deps');
        require('components/site-view.deps');
        require('components/dashboard-view-v2.deps');
        require('components/habitlab-logo-v2.deps');
        require('components/help-faq.deps');
        return (await SystemJS['import']('cheerio'));
      }, 1000);
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['S', 'once_available']
  });
}).call(this);
