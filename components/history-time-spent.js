(function(){
  var polymer_ext, ref$, get_domain_to_time_spent_days_before_today, get_baseline_time_on_domains, prelude, sorted_by_values_descending;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  ref$ = require('libs_backend/history_utils'), get_domain_to_time_spent_days_before_today = ref$.get_domain_to_time_spent_days_before_today, get_baseline_time_on_domains = ref$.get_baseline_time_on_domains;
  prelude = require('prelude-ls');
  sorted_by_values_descending = function(dict){
    var items, res$, k, v, this$ = this;
    res$ = [];
    for (k in dict) {
      v = dict[k];
      res$.push([k, v]);
    }
    items = res$;
    return prelude.reverse(prelude.sortBy(function(it){
      return it[1];
    }, items));
  };
  polymer_ext({
    is: 'history-time-spent',
    properties: {},
    ready: async function(){
      var i$, days_before_today, time_spent_on_domains, top_domains, j$, ref$, len$, ref1$, domain, time_spent, time_spent_on_facebook, baseline_time_on_domains, results$ = [];
      for (i$ = 0; i$ < 7; ++i$) {
        days_before_today = i$;
        console.log("=========== " + days_before_today + " days ago ============");
        time_spent_on_domains = (await get_domain_to_time_spent_days_before_today(days_before_today));
        top_domains = sorted_by_values_descending(time_spent_on_domains);
        for (j$ = 0, len$ = (ref$ = [top_domains[0], top_domains[1], top_domains[2], top_domains[3], top_domains[4]]).length; j$ < len$; ++j$) {
          ref1$ = ref$[j$], domain = ref1$[0], time_spent = ref1$[1];
          console.log(domain + " " + time_spent / (60 * 1000));
        }
      }
      console.log("============ time spent on Facebook ==============");
      for (i$ = 0; i$ < 7; ++i$) {
        days_before_today = i$;
        time_spent_on_domains = (await get_domain_to_time_spent_days_before_today(days_before_today));
        time_spent_on_facebook = (ref$ = time_spent_on_domains['www.facebook.com']) != null ? ref$ : 0;
        console.log(days_before_today + " days ago: " + time_spent_on_facebook / (60 * 1000));
      }
      console.log('========== baseline time on domains ============');
      baseline_time_on_domains = (await get_baseline_time_on_domains());
      top_domains = sorted_by_values_descending(baseline_time_on_domains);
      for (i$ = 0, len$ = (ref$ = [top_domains[0], top_domains[1], top_domains[2], top_domains[3], top_domains[4]]).length; i$ < len$; ++i$) {
        ref1$ = ref$[i$], domain = ref1$[0], time_spent = ref1$[1];
        results$.push(console.log(domain + " " + time_spent / (60 * 1000)));
      }
      return results$;
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['$$$', 'SM', 'S', 'once_available']
  });
}).call(this);
