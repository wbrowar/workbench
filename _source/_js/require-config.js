requirejs.config({
	baseUrl: requireThemePath+'js',
	paths: {
		'jquery': 'lib/jquery/jquery.min',
		'modernizr': 'lib/modernizr-custom.min',
		'picturefill': 'lib/picturefill/picturefill.min',
		'fontfaceobserver': 'lib/fontfaceobserver.min',
		'global': 'global.min',
		'home': 'home.min',
	},
	shim: {
		'global': {
			deps: ['jquery'],
		},
		'home': {
			deps: ['global', 'jquery'],
		},
	},
	urlArgs: "v=" + ((requireDevMode) ? (new Date()).getTime() : requireVersion),
});

// Global functions and scripts

// setup font events (don't forget to change variable in package.json)
(function(w) {
	if (w.document.documentElement.className.indexOf("fonts_loaded") > -1){
		return;
	} else if (requireFontEvents === true) {
		requirejs(['fontfaceobserver'], function() {
			// examples:
			var eaves = new w.FontFaceObserver("MrEavesXLSanRRegular");
			var eaves_italic = new w.FontFaceObserver("MrEavesXLModBkIRegular");
			
			w.Promise.all([eaves.check(), eaves_italic.check()]).then(function(){
				w.document.documentElement.className += " fonts_loaded";
			});
		});
	}
}(this));

if (requireSection === 'home') {
	requirejs(['home']);
} else {
	requirejs(['global']);
}

// Get page-specific modules
function requirePageSpecificModule(moduleName) {
	switch(moduleName) {
		/*
		// EXAMPLES
		case 'idealSlider':
			requirejs(['idealSlider'], function() {
				var idealSlider = new IdealImageSlider.Slider({
					selector: '.body_gallery_wrapper',
					interval: 4000,
					transitionDuration: 1000,
					effect: 'fade',
				});
				idealSlider.start();
			});
			break;
		case 'formValidator':
			requirejs(['formValidator']);
			break;
		*/
	}
}

//requirejs(["modernizr"]);

//requirejs(["picturefill"]);

/*
// check if element has class
function hasClass(element, class) {
	return (' '+element.className+' ').indexOf(' '+class+' ') > -1;
}
*/

// remove no-js class for when Javascript is enabled
document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, '') + ' js ';