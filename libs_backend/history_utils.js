(function(){
  var url_to_domain, memoizeSingleAsync, ref$, gexport, gexport_module, moment, median, localget, get_seconds_spent_on_domain_all_days, getdict, setdict, prelude, get_pages_visited_today, get_pages_visited_all_time, get_productivity_classifications, get_work_pages_visited_today, get_url_to_visits, get_url_and_visit_time_sorted_for_url_to_visits, get_url_and_visit_time_sorted, get_url_to_time_spent_for_url_and_visit_time, get_url_to_time_spent, get_domain_to_time_spent_for_url_to_visits, get_domain_to_time_spent_for_url_to_time_spent, get_domain_to_time_spent, get_url_to_time_spent_days_before_today, get_url_to_time_spent_today, get_domain_to_time_spent_days_before_today, get_domain_to_time_spent_today, get_domain_to_earliest_visit_for_url_to_visits, get_domain_to_earliest_visit, get_baseline_time_on_domains_real_passing_url_to_visits_and_time, get_baseline_time_on_domains_real, get_baseline_time_on_domains, get_baseline_time_on_domain, get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time, get_baseline_session_time_on_domains_real, get_baseline_session_time_on_domains, get_baseline_session_time_on_domain, ensure_history_utils_data_cached, list_all_domains_in_history, get_average_seconds_spent_on_domain, out$ = typeof exports != 'undefined' && exports || this;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  moment = require('moment');
  median = require('libs_common/math_utils').median;
  localget = require('libs_common/cacheget_utils').localget;
  get_seconds_spent_on_domain_all_days = require('libs_common/time_spent_utils').get_seconds_spent_on_domain_all_days;
  ref$ = require('libs_backend/db_utils'), getdict = ref$.getdict, setdict = ref$.setdict;
  prelude = require('prelude-ls');
  out$.get_pages_visited_today = get_pages_visited_today = async function(){
    var yesterday, pages_list;
    yesterday = Date.now() - 24 * 3600 * 1000;
    pages_list = (await new Promise(function(it){
      return chrome.history.search({
        text: '',
        startTime: yesterday,
        maxResults: Math.pow(2, 31) - 1
      }, it);
    }));
    return pages_list;
  };
  out$.get_pages_visited_all_time = get_pages_visited_all_time = async function(){
    var pages_list;
    pages_list = (await new Promise(function(it){
      return chrome.history.search({
        text: '',
        startTime: 0,
        maxResults: Math.pow(2, 31) - 1
      }, it);
    }));
    return pages_list;
  };
  out$.get_productivity_classifications = get_productivity_classifications = memoizeSingleAsync(async function(){
    var classifications;
    classifications = (await localget('/productivity_classifications.json'));
    return JSON.parse(classifications);
  });
  out$.get_work_pages_visited_today = get_work_pages_visited_today = async function(){
    var yesterday, pages_list, productivity_classifications, productive_pages_list;
    yesterday = Date.now() - 24 * 3600 * 1000;
    pages_list = (await new Promise(function(it){
      return chrome.history.search({
        text: '',
        startTime: yesterday,
        maxResults: Math.pow(2, 31) - 1
      }, it);
    }));
    productivity_classifications = (await get_productivity_classifications());
    productive_pages_list = pages_list.filter(function(page_info){
      var url, domain;
      url = page_info.url;
      domain = url_to_domain(url);
      if (productivity_classifications[domain] === 'work') {
        return true;
      }
      return false;
    });
    return productive_pages_list;
  };
  out$.get_url_to_visits = get_url_to_visits = async function(start_time, end_time){
    var pages_list, url_list, seen_urls, i$, len$, page, url, url_to_visits, visits;
    pages_list = (await new Promise(function(it){
      return chrome.history.search({
        text: '',
        startTime: start_time,
        endTime: end_time,
        maxResults: Math.pow(2, 31) - 1
      }, it);
    }));
    url_list = [];
    seen_urls = {};
    for (i$ = 0, len$ = pages_list.length; i$ < len$; ++i$) {
      page = pages_list[i$];
      url = page.url;
      if (url == null || url === '') {
        continue;
      }
      seen_urls[url] = true;
      url_list.push(url);
    }
    url_to_visits = {};
    for (i$ = 0, len$ = url_list.length; i$ < len$; ++i$) {
      url = url_list[i$];
      visits = (await new Promise(fn$));
      url_to_visits[url] = visits;
    }
    return url_to_visits;
    function fn$(it){
      return chrome.history.getVisits({
        url: url
      }, it);
    }
  };
  out$.get_url_and_visit_time_sorted_for_url_to_visits = get_url_and_visit_time_sorted_for_url_to_visits = function(url_to_visits, start_time, end_time){
    var url_and_visit_time, url, visits, i$, len$, visit, visitTime, this$ = this;
    url_and_visit_time = [];
    for (url in url_to_visits) {
      visits = url_to_visits[url];
      for (i$ = 0, len$ = visits.length; i$ < len$; ++i$) {
        visit = visits[i$];
        visitTime = visit.visitTime;
        if (start_time <= visitTime && visitTime <= end_time) {
          url_and_visit_time.push({
            url: url,
            visitTime: visitTime
          });
        }
      }
    }
    url_and_visit_time = prelude.sortBy(function(it){
      return it.visitTime;
    }, url_and_visit_time);
    return url_and_visit_time;
  };
  out$.get_url_and_visit_time_sorted = get_url_and_visit_time_sorted = async function(start_time, end_time){
    var url_to_visits;
    url_to_visits = (await get_url_to_visits(start_time, end_time));
    return get_url_and_visit_time_sorted_for_url_to_visits(url_to_visits, start_time, end_time);
  };
  out$.get_url_to_time_spent_for_url_and_visit_time = get_url_to_time_spent_for_url_and_visit_time = function(url_and_visit_time, start_time, end_time){
    var url_to_time_spent, i$, len$, idx, item, visitTime, url, nextitem, visit_duration, nextVisitTime;
    url_to_time_spent = {};
    for (i$ = 0, len$ = url_and_visit_time.length; i$ < len$; ++i$) {
      idx = i$;
      item = url_and_visit_time[i$];
      visitTime = item.visitTime, url = item.url;
      nextitem = url_and_visit_time[idx + 1];
      visit_duration = 5 * 60 * 1000;
      if (nextitem != null) {
        nextVisitTime = nextitem.visitTime;
        visit_duration = Math.min(visit_duration, nextVisitTime - visitTime);
      }
      if (visitTime + visit_duration > end_time) {
        visit_duration = end_time - visitTime;
      }
      if (visit_duration < 0) {
        console.log('visit duration negative');
        console.log(item);
        console.log(start_time);
        console.log(end_time);
        console.log(nextitem);
        console.log(visit_duration);
      }
      if (url_to_time_spent[url] == null) {
        url_to_time_spent[url] = visit_duration;
      } else {
        url_to_time_spent[url] += visit_duration;
      }
    }
    return url_to_time_spent;
  };
  out$.get_url_to_time_spent = get_url_to_time_spent = async function(start_time, end_time){
    var url_and_visit_time;
    url_and_visit_time = (await get_url_and_visit_time_sorted(start_time, end_time));
    return get_url_to_time_spent_for_url_and_visit_time(url_and_visit_time, start_time, end_time);
  };
  out$.get_domain_to_time_spent_for_url_to_visits = get_domain_to_time_spent_for_url_to_visits = function(url_to_visits, start_time, end_time){
    var url_and_visit_time, url_to_time_spent;
    url_and_visit_time = get_url_and_visit_time_sorted_for_url_to_visits(url_to_visits, start_time, end_time);
    url_to_time_spent = get_url_to_time_spent_for_url_and_visit_time(url_and_visit_time, start_time, end_time);
    return get_domain_to_time_spent_for_url_to_time_spent(url_to_time_spent);
  };
  out$.get_domain_to_time_spent_for_url_to_time_spent = get_domain_to_time_spent_for_url_to_time_spent = function(url_to_time_spent){
    var domain_to_time_spent, url, time_spent, domain;
    domain_to_time_spent = {};
    for (url in url_to_time_spent) {
      time_spent = url_to_time_spent[url];
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
        continue;
      }
      domain = url_to_domain(url);
      if (domain_to_time_spent[domain] == null) {
        domain_to_time_spent[domain] = time_spent;
      } else {
        domain_to_time_spent[domain] += time_spent;
      }
    }
    return domain_to_time_spent;
  };
  out$.get_domain_to_time_spent = get_domain_to_time_spent = async function(start_time, end_time){
    var url_to_time_spent;
    url_to_time_spent = (await get_url_to_time_spent(start_time, end_time));
    return get_domain_to_time_spent_for_url_to_time_spent(url_to_time_spent);
  };
  out$.get_url_to_time_spent_days_before_today = get_url_to_time_spent_days_before_today = async function(days_before_today){
    var start_time, end_time;
    start_time = moment().subtract(days_before_today, 'days').hour(0).minute(0).second(0).valueOf();
    end_time = moment().subtract(days_before_today, 'days').hour(23).minute(59).second(59).valueOf();
    return (await get_url_to_time_spent(start_time, end_time));
  };
  out$.get_url_to_time_spent_today = get_url_to_time_spent_today = async function(){
    return (await get_url_to_time_spent_days_before_today(0));
  };
  out$.get_domain_to_time_spent_days_before_today = get_domain_to_time_spent_days_before_today = async function(days_before_today){
    var start_time, end_time;
    start_time = moment().subtract(days_before_today, 'days').hour(0).minute(0).second(0).valueOf();
    end_time = moment().subtract(days_before_today, 'days').hour(23).minute(59).second(59).valueOf();
    return (await get_domain_to_time_spent(start_time, end_time));
  };
  out$.get_domain_to_time_spent_today = get_domain_to_time_spent_today = async function(){
    return (await get_domain_to_time_spent_days_before_today(0));
  };
  out$.get_domain_to_earliest_visit_for_url_to_visits = get_domain_to_earliest_visit_for_url_to_visits = function(url_to_visits){
    var domain_to_earliest_visit, url, visits, domain, i$, len$, visit, visitTime;
    domain_to_earliest_visit = {};
    for (url in url_to_visits) {
      visits = url_to_visits[url];
      domain = url_to_domain(url);
      for (i$ = 0, len$ = visits.length; i$ < len$; ++i$) {
        visit = visits[i$];
        visitTime = visit.visitTime;
        if (domain_to_earliest_visit[domain] == null) {
          domain_to_earliest_visit[domain] = visitTime;
        } else {
          domain_to_earliest_visit[domain] = Math.min(visitTime, domain_to_earliest_visit[domain]);
        }
      }
    }
    return domain_to_earliest_visit;
  };
  out$.get_domain_to_earliest_visit = get_domain_to_earliest_visit = async function(){
    var url_to_visits;
    url_to_visits = (await get_url_to_visits(0, Date.now()));
    return get_domain_to_earliest_visit_for_url_to_visits(url_to_visits);
  };
  out$.get_baseline_time_on_domains_real_passing_url_to_visits_and_time = get_baseline_time_on_domains_real_passing_url_to_visits_and_time = function(url_to_visits, date_now){
    var total_time_spent_on_domains, earliest_visit_to_domains, baseline_time_on_domains, current_time, domain, time_spent, earliest_visit, num_days, daily_time_spent;
    total_time_spent_on_domains = get_domain_to_time_spent_for_url_to_visits(url_to_visits, 0, date_now);
    earliest_visit_to_domains = get_domain_to_earliest_visit_for_url_to_visits(url_to_visits);
    baseline_time_on_domains = {};
    current_time = Date.now();
    for (domain in total_time_spent_on_domains) {
      time_spent = total_time_spent_on_domains[domain];
      earliest_visit = earliest_visit_to_domains[domain];
      if (earliest_visit == null) {
        continue;
      }
      num_days = Math.round((current_time - earliest_visit) / (24 * 1000 * 3600));
      if (num_days < 1) {
        continue;
      }
      daily_time_spent = time_spent / num_days;
      baseline_time_on_domains[domain] = daily_time_spent;
    }
    return baseline_time_on_domains;
  };
  out$.get_baseline_time_on_domains_real = get_baseline_time_on_domains_real = async function(){
    var url_to_visits;
    url_to_visits = (await get_url_to_visits(0, Date.now()));
    return get_baseline_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, Date.now());
  };
  out$.get_baseline_time_on_domains = get_baseline_time_on_domains = memoizeSingleAsync(async function(){
    var baseline_time_on_domains;
    baseline_time_on_domains = (await getdict('baseline_time_on_domains'));
    if (baseline_time_on_domains != null && Object.keys(baseline_time_on_domains).length > 0) {
      return baseline_time_on_domains;
    }
    baseline_time_on_domains = (await get_baseline_time_on_domains_real());
    (await setdict('baseline_time_on_domains', baseline_time_on_domains));
    return baseline_time_on_domains;
  });
  out$.get_baseline_time_on_domain = get_baseline_time_on_domain = async function(domain){
    var baseline_time_on_domains;
    baseline_time_on_domains = (await get_baseline_time_on_domains());
    if (baseline_time_on_domains[domain] != null) {
      return baseline_time_on_domains[domain];
    }
    return 0;
  };
  out$.get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time = get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time = function(url_to_visits, date_now){
    var url_and_visit_time_sorted, prev_domain, prev_visit_time_start, prev_visit_time_most_recent, domain_to_visit_lengths, i$, len$, ref$, url, visitTime, domain, prev_visit_end_time, domain_to_average_visit_lengths, visit_lengths;
    url_and_visit_time_sorted = get_url_and_visit_time_sorted_for_url_to_visits(url_to_visits, 0, date_now);
    prev_domain = null;
    prev_visit_time_start = 0;
    prev_visit_time_most_recent = 0;
    domain_to_visit_lengths = {};
    for (i$ = 0, len$ = url_and_visit_time_sorted.length; i$ < len$; ++i$) {
      ref$ = url_and_visit_time_sorted[i$], url = ref$.url, visitTime = ref$.visitTime;
      domain = url_to_domain(url);
      if (domain_to_visit_lengths[domain] == null) {
        domain_to_visit_lengths[domain] = [];
      }
      if (visitTime > prev_visit_time_most_recent + 60 * 60 * 1000) {
        if (prev_domain != null) {
          domain_to_visit_lengths[prev_domain].push(prev_visit_time_most_recent + 60 * 1000 - prev_visit_time_start);
        }
        prev_domain = domain;
        prev_visit_time_start = visitTime;
        prev_visit_time_most_recent = visitTime;
        continue;
      }
      if (domain !== prev_domain) {
        if (prev_domain != null) {
          prev_visit_end_time = Math.min(visitTime, prev_visit_time_most_recent + 60 * 60 * 1000);
          domain_to_visit_lengths[prev_domain].push(prev_visit_end_time - prev_visit_time_start);
        }
        prev_domain = domain;
        prev_visit_time_start = visitTime;
        prev_visit_time_most_recent = visitTime;
        continue;
      }
      prev_visit_time_most_recent = visitTime;
    }
    domain_to_average_visit_lengths = {};
    for (domain in domain_to_visit_lengths) {
      visit_lengths = domain_to_visit_lengths[domain];
      if (visit_lengths.length === 0) {
        continue;
      }
      domain_to_average_visit_lengths[domain] = median(visit_lengths) / 1000;
    }
    return domain_to_average_visit_lengths;
  };
  out$.get_baseline_session_time_on_domains_real = get_baseline_session_time_on_domains_real = async function(){
    var url_to_visits;
    url_to_visits = (await get_url_to_visits(0, Date.now()));
    return get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, Date.now());
  };
  out$.get_baseline_session_time_on_domains = get_baseline_session_time_on_domains = memoizeSingleAsync(async function(){
    var baseline_time_on_domains;
    baseline_time_on_domains = (await getdict('baseline_session_time_on_domains'));
    if (baseline_time_on_domains != null && Object.keys(baseline_time_on_domains).length > 0) {
      return baseline_time_on_domains;
    }
    baseline_time_on_domains = (await get_baseline_session_time_on_domains_real());
    (await setdict('baseline_session_time_on_domains', baseline_time_on_domains));
    return baseline_time_on_domains;
  });
  out$.get_baseline_session_time_on_domain = get_baseline_session_time_on_domain = async function(domain){
    var baseline_time_on_domains;
    baseline_time_on_domains = (await get_baseline_session_time_on_domains());
    if (baseline_time_on_domains[domain] != null) {
      return baseline_time_on_domains[domain];
    }
    return 0;
  };
  out$.ensure_history_utils_data_cached = ensure_history_utils_data_cached = async function(){
    var baseline_session_time_on_domains, baseline_time_on_domains, date_now, url_to_visits;
    baseline_session_time_on_domains = (await getdict('baseline_session_time_on_domains'));
    baseline_time_on_domains = (await getdict('baseline_time_on_domains'));
    if (!(baseline_session_time_on_domains != null && baseline_time_on_domains != null && Object.keys(baseline_session_time_on_domains).length > 0 && Object.keys(baseline_time_on_domains).length > 0)) {
      date_now = Date.now();
      url_to_visits = (await get_url_to_visits(0, date_now));
      baseline_session_time_on_domains = (await get_baseline_session_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, date_now));
      (await setdict('baseline_session_time_on_domains', baseline_session_time_on_domains));
      baseline_time_on_domains = (await get_baseline_time_on_domains_real_passing_url_to_visits_and_time(url_to_visits, date_now));
      return (await setdict('baseline_time_on_domains', baseline_time_on_domains));
    }
  };
  out$.list_all_domains_in_history = list_all_domains_in_history = async function(){
    var start_time, end_time, url_history_info_list, output_set, output, i$, len$, url, domain;
    start_time = 0;
    end_time = Date.now();
    url_history_info_list = (await new Promise(function(it){
      return chrome.history.search({
        text: '',
        startTime: start_time,
        endTime: end_time,
        maxResults: Math.pow(2, 31) - 1
      }, it);
    }));
    output_set = {};
    output = [];
    for (i$ = 0, len$ = url_history_info_list.length; i$ < len$; ++i$) {
      url = url_history_info_list[i$].url;
      domain = url_to_domain(url);
      if (domain.length === 0) {
        continue;
      }
      if (output_set[domain] == null) {
        output_set[domain] = true;
        output.push(domain);
      }
    }
    output.sort();
    return output;
  };
  out$.get_average_seconds_spent_on_domain = get_average_seconds_spent_on_domain = async function(domain){
    var days_before_to_seconds_spent, num_days_of_data;
    days_before_to_seconds_spent = (await get_seconds_spent_on_domain_all_days(domain));
    num_days_of_data = Object.keys(days_before_to_seconds_spent).length;
    if (num_days_of_data < 2) {
      return (await get_baseline_time_on_domain(domain)) / 1000.0;
    }
    return prelude.sum(Object.values(days_before_to_seconds_spent)) / num_days_of_data;
  };
  gexport_module('history_utils', function(it){
    return eval(it);
  });
}).call(this);
