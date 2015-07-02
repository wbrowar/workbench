requirejs.config({
	baseUrl: requireThemePath+'js',
	paths: {
		'jquery': 'lib/jquery/jquery.min',
		'modernizr': 'lib/modernizr-custom.min',
		'picturefill': 'lib/picturefill/picturefill.min',
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
loadCSS(requireThemePath+'css/all.css?v='+requireVersion);

// setup font events
if (requireFontEvents === true) {
	new w.FontFaceObserver("eaves").check().then( function(){
		w.document.documentElement.className += " fonts-loaded";
	});
}

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

for (var i = 0; i < requireModules.length; i++) {
	requirePageSpecificModule(requireModules[i]);
}

requirejs(["modernizr"]);

requirejs(["picturefill"]);