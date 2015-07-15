requirejs.config({
	baseUrl: requireThemePath+'js',
	paths: {
		'jquery': 'lib/jquery/jquery.min',
		'modernizr': 'lib/modernizr-custom.min',
		'picturefill': 'lib/picturefill/picturefill.min',
		'fontfaceobserver': 'lib/fontfaceobserver.min',
		'home': 'home.min',
	},
	shim: {
		'home': {
			deps: ['jquery'],
		},
	},
	urlArgs: "v=" + ((requireDevMode) ? (new Date()).getTime() : requireVersion),
});

// Global functions and scripts

// setup font events
(function(w) {
	if (w.document.documentElement.className.indexOf("fonts_loaded") > -1){
		return;
	} else if (requireFontEvents === true) {
		requirejs(['fontfaceobserver'], function() {
			var eaves = new w.FontFaceObserver("MrEavesXLSanRRegular");
			var eaves_italic = new w.FontFaceObserver("MrEavesXLModBkIRegular");
			
			w.Promise.all([museo.check(), eaves_italic.check()]).then(function(){
				w.document.documentElement.className += " fonts-loaded";
			});
		});
	}
}(this));

if (requireSection === 'home') {
	requirejs(["home"]);
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

requirejs(["modernizr"]);

requirejs(["picturefill"]);