var jsModulePaths = {
    'fitvids': '_lib/jquery.fitvids.min.js?v=' + jsVersion,
    'fontfaceobserver': '_lib/fontfaceobserver.min.js?v=' + jsVersion,
    'idealimageslider': '_lib/idealimageslider.min.js?v=' + jsVersion,
    'jquery': '_lib/jquery.min.js?v=' + jsVersion,
    'scrollmonitor': '_lib/scrollMonitor.min.js?v=' + jsVersion,
    'vue': jsDevMode ? 'https://unpkg.com/vue' : '_lib/vue.min.js?v=' + jsVersion,
    'modernizr': '_lib/modernizr-custom.min.js?v=' + jsVersion,
    'global': 'global.min.js?v=' + jsVersion,
    'home': 'home.min.js?v=' + jsVersion,
    'lazy': 'lazy.min.js?v=' + jsVersion,
    'vuecomponents': 'vue-components.min.js?v=' + jsVersion,
};
SystemJS.config({
    baseURL: jsThemePath+'js/',
    paths: jsModulePaths,
    meta: {
        'fitvids': {
            deps: ['jquery'],
        },
    },
    transpiler: false,
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
        case 'fitvids':
            SystemJS.import('fitvids').then(function(m) {
                var jq = jQuery;

                jq('.video').fitVids();
            });
            break;
        default:
            if (jsModulePaths[moduleName] !== undefined) {
                SystemJS.import(moduleName);
            }
        /*
        // EXAMPLES
        case 'formValidator':
            SystemJS.import('formValidator');
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