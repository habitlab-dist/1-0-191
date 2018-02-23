(function(){
  var memoizeSingleAsync, fetch_page_text, out$ = typeof exports != 'undefined' && exports || this;
  memoizeSingleAsync = require('libs_common/memoize').memoizeSingleAsync;
  out$.fetch_page_text = fetch_page_text = async function(url){
    var page_request, page_text;
    page_request = (await fetch(url, {
      credentials: 'include'
    }));
    page_text = (await page_request.text());
    return page_text;
  };
  /*
  export fetch_and_parse_page = (url) ->>
    page_text = await fetch_page_text(url)
    cheerio = await get_cheerio()
    $ = cheerio.load(page_text)
    return $
  */
}).call(this);
