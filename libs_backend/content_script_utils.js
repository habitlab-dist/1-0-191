(function(){
  var systemjsget, css_packages, css_files_cached, loaded_css_files, load_css_file, load_css_code, out$ = typeof exports != 'undefined' && exports || this;
  systemjsget = require('libs_common/cacheget_utils').systemjsget;
  css_packages = require('libs_common/css_packages');
  css_files_cached = require('libs_common/css_files_cached');
  loaded_css_files = {};
  /**
   * Loads a css file
   * @param {string} filename - name of css package or path to css file
   */
  out$.load_css_file = load_css_file = async function(filename){
    var css_code;
    if (css_packages[filename] != null) {
      filename = css_packages[filename];
    }
    if (loaded_css_files[filename] != null) {
      return;
    }
    loaded_css_files[filename] = true;
    if (css_files_cached[filename] != null) {
      css_code = css_files_cached[filename];
    } else {
      css_code = (await systemjsget(filename));
    }
    return (await load_css_code(css_code));
  };
  /**
   * Loads some css code
   * @param {string} css_code - the css code to load
   */
  out$.load_css_code = load_css_code = async function(css_code){
    var STYLES;
    STYLES = document.createElement('style');
    if (STYLES.styleSheet) {
      STYLES.styleSheet.cssText = css_code;
    } else {
      STYLES.appendChild(document.createTextNode(css_code));
    }
    document.documentElement.appendChild(STYLES);
  };
}).call(this);
