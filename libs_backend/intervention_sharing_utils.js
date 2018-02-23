(function(){
  var upload_intervention, list_interventions_for_author, out$ = typeof exports != 'undefined' && exports || this;
  out$.upload_intervention = upload_intervention = async function(intervention_info, author_info){
    return {
      status: 'success',
      url: 'https://habitlab.stanford.edu'
    };
  };
  out$.list_interventions_for_author = list_interventions_for_author = async function(author_info){
    return [];
  };
}).call(this);
