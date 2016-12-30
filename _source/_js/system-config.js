SystemJS.config({
  baseURL: jsThemePath+'js/',
  paths: {
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

// Load fonts locally and avoid FOIT
// Setup font events (don't forget to change variable in package.json)
(function(w) {
  if (w.document.documentElement.className.indexOf("fonts_loaded") > -1){
    return;
  } else if (enableFontEvents === true) {
    SystemJS.import('fontfaceobserver').then(function(m) {
      // change fonts 
      var font = new w.FontFaceObserver("MrEavesXLSanRRegular");
      var fontBold = new w.FontFaceObserver("MrEavesXLModBkIRegular");
      var fontItalic = new w.FontFaceObserver("MrEavesXLModBkIRegular");
      
      w.Promise.all([font.check(), fontBold.check(), fontItalic.check()]).then(function(){
        w.document.documentElement.className += " fonts_loaded";
      });
    });
  }
}(this));

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