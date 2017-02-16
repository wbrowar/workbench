SystemJS.config({
  baseURL: jsThemePath+'js/',
  paths: {
    'emergence': '_lib/emergence.min.js',
    'fitvids': '_lib/jquery.fitvids.min.js',
    'fontfaceobserver': '_lib/fontfaceobserver.min.js',
    'idealimageslider': '_lib/idealimageslider.min.js',
    'jquery': '_lib/jquery.min.js',
    'modernizr': '_lib/modernizr-custom.min.js',
    'global': 'global.min.js',
    'home': 'home.min.js',
  },
  meta: {
    'fitvids': {
      deps: ['jquery'],
    },
  },
  urlArgs: "v=" + ((jsDevMode) ? (new Date()).getTime() : jsVersion),
});

if (jsSection === 'home') {
  SystemJS.import('home');
} else if (jsSection === 'inside') {
  SystemJS.import('inside');
} else {
  SystemJS.import('global');
}

// Get page-specific modules
function importPageSpecificModule(moduleName) {
  switch(moduleName) {
    /*
    // EXAMPLES
    case 'formValidator':
      SystemJS.import('formValidator');
      break;
    case 'fitvids':
      SystemJS.import('fitvids').then(function(m) {
        var jq = jQuery;
        
        jq('.video').fitVids();
      });
      break;
    case 'idealSlider':
      SystemJS.import('idealSlider').then(function(m) {
        var idealSlider = new IdealImageSlider.Slider({
          selector: '.body_gallery_wrapper',
          interval: 4000,
          transitionDuration: 1000,
          effect: 'fade',
        });
        idealSlider.start();
      });
      break;
    */
  }
}

//SystemJS.import('modernizr');

/*
// check if element has class
function hasClass(element, class) {
  return (' '+element.className+' ').indexOf(' '+class+' ') > -1;
}
*/

// remove no-js class for when Javascript is enabled
document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, '') + ' js ';