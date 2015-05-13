requirejs.config({
	baseUrl: './js',
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

if (requireSection === 'home') {
	requirejs(["home"]);
}

requirejs(["modernizr"]);

requirejs(["picturefill"]);