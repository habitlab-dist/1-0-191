(function(){
  var $, sleep, get_news_feed, inject_into_feed, out$ = typeof exports != 'undefined' && exports || this;
  $ = require('jquery');
  require('jquery.isinview')($);
  require('jquery-inview')($);
  sleep = async function(time){
    return new Promise(function(it){
      return setTimeout(it, time);
    });
  };
  /**
   * Inject an HTMLElement into facebook news feeds
   * @return {jQuery object} facebook's news feeds
   */
  out$.get_news_feed = get_news_feed = function(){
    return $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');
  };
  /**
   * Inject an HTMLElement into facebook news feeds. 
   * Which spot it goes in the feed is calculated using position + n * spacing for n >= 0.
   * Eg. if position = 4 and spacing = 8, it's injected as the 4th, 12th, and 20th post and so on.
   * @param {HTMLElement} component_generator - the created div in the shadow dom
   * @param {HTMLElement} position - an optional parameter of where to insert it (default 4)
   * @param {HTMLElement} position - an optional parameter for how many posts to have between them (default 8)
   */
  out$.inject_into_feed = inject_into_feed = function(component_generator, position, spacing){
    var randstr, insertBeforeItem, insertIfMissing, idArraysEqual, keysInFirstButNotSecond, updateVisibleIds, initialize, preinitialize, loadfirststart;
    position == null && (position = 0);
    spacing == null && (spacing = 8);
    window.numitems = 0;
    window.mostrecentmousemove = Date.now();
    window.timeopened = Date.now();
    window.prev_visible_quiz_ids = [];
    window.all_shown_times = {};
    window.itemsseen = 0;
    window.feed_injection_active = true;
    randstr = function(){
      var chars, output, i$, i;
      chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
      output = '';
      for (i$ = 0; i$ < 24; ++i$) {
        i = i$;
        output += chars.charAt(Math.random() * chars.length);
      }
      return output;
    };
    insertBeforeItem = function(jfeeditem){
      var quizid;
      quizid = randstr();
      jfeeditem.before(component_generator(window.numitems));
    };
    insertIfMissing = function(){
      var i$, ref$, len$, $feeditem, is_valid;
      for (i$ = 0, len$ = (ref$ = $('.mbm')).length; i$ < len$; ++i$) {
        $feeditem = ref$[i$];
        is_valid = false;
        if ($($feeditem).parent().attr('data-testid') === 'fbfeed_story') {
          is_valid = true;
        }
        if ($($feeditem).parent().parent().attr('data-pnref') === 'story') {
          is_valid = true;
        }
        if ($($feeditem).hasClass('uiSideNav') || $($feeditem).hasClass('pbm')) {
          is_valid = false;
        }
        if (!is_valid) {
          continue;
        }
        if (!$feeditem.feedlearninserted) {
          $feeditem.feedlearninserted = true;
          if (window.numitems % spacing === position) {
            if (window.feed_injection_active) {
              insertBeforeItem($($feeditem));
            }
          }
          window.numitems += 1;
        }
      }
    };
    idArraysEqual = function(a1, a2){
      var i$, to$, i;
      if (a1.length !== a2.length) {
        return false;
      }
      for (i$ = 0, to$ = a1.length; i$ < to$; ++i$) {
        i = i$;
        if (a1[i] !== a2[i]) {
          return false;
        }
      }
      return true;
    };
    keysInFirstButNotSecond = function(m1, m2){
      var output, i$, ref$, len$, k;
      output = [];
      for (i$ = 0, len$ = (ref$ = Object.keys(m1)).length; i$ < len$; ++i$) {
        k = ref$[i$];
        if (m2[k] == null) {
          output.push(k);
        }
      }
      return output;
    };
    updateVisibleIds = function(){
      var visible_quiz_ids, res$, i$, ref$, len$, quiz, visible_quiz_ids_map, id, prev_visible_quiz_ids_map, shown_ids, curtime, showntimes, newid, hidden_ids, changed_info, fburl, fbname;
      res$ = [];
      for (i$ = 0, len$ = (ref$ = $('.feedlearnquiz').inViewport()).length; i$ < len$; ++i$) {
        quiz = ref$[i$];
        res$.push(quiz.id);
      }
      visible_quiz_ids = res$;
      if (!idArraysEqual(visible_quiz_ids, window.prev_visible_quiz_ids)) {
        res$ = {};
        for (i$ = 0, len$ = visible_quiz_ids.length; i$ < len$; ++i$) {
          id = visible_quiz_ids[i$];
          res$[id] = true;
        }
        visible_quiz_ids_map = res$;
        res$ = {};
        for (i$ = 0, len$ = (ref$ = window.prev_visible_quiz_ids).length; i$ < len$; ++i$) {
          id = ref$[i$];
          res$[id] = true;
        }
        prev_visible_quiz_ids_map = res$;
        shown_ids = keysInFirstButNotSecond(visible_quiz_ids_map, window.prev_visible_quiz_ids_map);
        curtime = Date.now();
        showntimes = {};
        for (i$ = 0, len$ = shown_ids.length; i$ < len$; ++i$) {
          newid = shown_ids[i$];
          window.all_shown_times[newid] = curtime;
          showntimes[newid] = curtime;
        }
        hidden_ids = keysInFirstButNotSecond(prev_visible_quiz_ids_map, visible_quiz_ids);
        for (i$ = 0, len$ = hidden_ids.length; i$ < len$; ++i$) {
          newid = hidden_ids[i$];
          showntimes[newid] = window.all_shown_times[newid];
        }
        changed_info = {};
        if (shown_ids.length > 0 || hidden_ids.length > 0) {
          fburl = $('.fbxWelcomeBoxName').attr('href');
          fbname = $('.fbxWelcomeBoxName').text();
          chrome.runtime.sendMessage({
            feedlearn: 'shownquizzeschanged',
            'visibleids': visible_quiz_ids,
            'shownids': shown_ids,
            'hiddenids': hidden_ids,
            'showntimes': showntimes,
            fburl: fburl,
            fbname: fbname
          });
        }
        window.prev_visible_quiz_ids = visible_quiz_ids;
      }
    };
    initialize = function(format){
      var fburl, fbname;
      if (!(format === 'link' || format === 'interactive' || format === 'none')) {
        fburl = $('.fbxWelcomeBoxName').attr('href');
        fbname = $('.fbxWelcomeBoxName').text();
        chrome.runtime.sendMessage({
          feedlearn: 'missingformat',
          fburl: fburl,
          fbname: fbname
        });
      }
      if (format !== 'none') {
        (async function(){
          for (;;) {
            updateVisibleIds();
            insertIfMissing();
            (await sleep(100));
          }
        })();
      }
      return $(document).mousemove(function(){
        window.mostrecentmousemove = Date.now();
      });
    };
    preinitialize = function(format){
      if ($('#feedlearn').length === 0) {
        clearInterval(window.firststartprocess);
        $('html').append($('<div>').attr('id', 'feedlearn').css({
          position: 'absolute',
          display: 'none',
          top: '0px',
          left: '0px',
          zIndex: 1000
        }));
        return initialize(format);
      }
    };
    loadfirststart = function(){
      var fburl, fbname;
      if ($('#feedlearn').length === 0) {
        fburl = $('.fbxWelcomeBoxName').attr('href');
        fbname = $('.fbxWelcomeBoxName').text();
        return preinitialize('interactive');
      }
    };
    loadfirststart();
    return window.firststartprocess = setInterval(loadfirststart, 100);
  };
}).call(this);
