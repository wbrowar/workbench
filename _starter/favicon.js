// import node modules
const favicons = require('favicons'),
      fs = require('fs-extra');

// import global functions
const g = require('./functions.js');

// load config files
let wb = require(`${ process.cwd() }/wb.config.js`);

// set constants
const argv = g.parseArgv(),
      distPath = wb.favicon.distPath || `img/meta/`,
      themeColor = wb.favicon.themeColor || '#fff',
      backgroundColor = wb.favicon.tileColor || '#fff';

// use CLI arguments to set variables
const verbose = argv.options.verbose || false;

async function run() {
  fs.ensureDir(wb.paths.starter.static + distPath, () => {
    const source = `${wb.paths.favicon.src}favicon.png`,                     // Source image(s). `string`, `buffer` or array of `string`
    configuration = {
      path: `/${distPath}`,                           // Path for overriding default icons path. `string`
      appName: null,                            // Your application's name. `string`
      appShortName: null,                       // Your application's short_name. `string`. Optional. If not set, appName will be used
      appDescription: null,                     // Your application's description. `string`
      developerName: null,                      // Your (or your developer's) name. `string`
      developerURL: null,                       // Your (or your developer's) URL. `string`
      dir: "auto",                              // Primary text direction for name, short_name, and description
      lang: "en-US",                            // Primary language for name and short_name
      background: backgroundColor,                       // Background colour for flattened icons. `string`
      theme_color: themeColor,                      // Theme color user for example in Android's task switcher. `string`
      appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
      display: "standalone",                    // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
      orientation: "any",                       // Default orientation: "any", "natural", "portrait" or "landscape". `string`
      scope: "/",                               // set of URLs that the browser considers within your app
      start_url: "/?homescreen=1",              // Start URL when launching the application from a device. `string`
      version: "1.0",                           // Your application's version string. `string`
      logging: verbose,                         // Print logs to console? `boolean`
      pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
      loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
      icons: {
        // Platform Options:
        // - offset - offset in percentage
        // - background:
        //   * false - use default
        //   * true - force use default, e.g. set background for Android icons
        //   * color - set background for the specified icons
        //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
        //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
        //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
        //
        android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        coast: true,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        yandex: true                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
      }
    },
    callback = (error, response) => {
      if (error) {
        g.log('warn', `Favicon failed: ${error.message}`, verbose); // Error description e.g. "An unknown error has occurred"
        return;
      }
      g.log('verbose', `Favicon images: ${response.images}`, verbose); // Array of { name: string, contents: <buffer> }
      g.log('verbose', `Favicon files: ${response.files}`, verbose); // Array of { name: string, contents: <string> }
      g.log('verbose', `Favicon html: ${response.html}`, verbose); // Array of strings (html elements)

      response.images.map (image => {
        fs.writeFileSync (wb.paths.starter.static + distPath + image.name, image.contents);
        g.log('verbose', `Favicon image saved: ${image.name}`, verbose);
      });
      response.files.map (file => {
        fs.writeFileSync (wb.paths.starter.static + distPath + file.name, file.contents);
        g.log('verbose', `Favicon file saved: ${file.name}`, verbose);
      });
      // fs.writeFileSync (wb.paths.favicon.src + 'output.html', response.html.join());
      // g.log('verbose', `Favicon HTML saved to: ${wb.paths.favicon.src}output.html`, verbose);
    };

    favicons(source, configuration, callback);
  });
}

run();