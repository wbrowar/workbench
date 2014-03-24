WB-Starter
==========

My personal framework for very simple sites includes a configuration from Initilizr, a CodeKit (v2) config file and some SASS, HTML and JS snippits that I use on a regular basis. Meant to be pulled apart or modified for the project at hand.

This is here for my own storage, but please let me know if you have any feedback or suggestions.

You can make your own by doing the following:

1. Configuring your build, [http://www.initializr.com](http://www.initializr.com)
2. Buy CodeKit, [http://incident57.com/codekit/](http://incident57.com/codekit/)
3. Write some sweet SASS Mixins and figure out a file structure that works best for you.

---
## Installation
1. Clone the repo into your site's root folder
2. Drag root folder into Codekit 2
3. Rename site name in Codekit

---
## CSS framework
- In `_source/sass` there are a few files with underscores in front. These all get compiled into both `all.css` and `ie8.css`. A lot of this is pulled right out of HTML5 Boilerplate. Custom styles should go in `_style.scss`.
- The CSS setup is configured to output a normal CSS file (`all.css`) and an IE8-specific CSS file (`ie8.css`). If you are working in a mobile-first pattern, the IE8 stylesheet should dump out all off the CSS in your normal stylesheet, but without the media queries. This setup is based on the idea of serving up a static layout for IE8 and below.

---
## Javascript
- I've heard that Modernizr should be included in the `<head>`, while your custom scripts should be included just before the closing `<body>` tag. The dev version of Modernizr is compiled into `/js/head.min.js` and this should be swapped out in Codekit with a production version when the time comes. Everything else should be compiled into `main.min.js`.
- JQuery and Retina.js are included into `main.min.js` by default, but they can be removed if they aren't needed for the project.
