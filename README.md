WB-Starter
==========

My personal framework for very simple sites includes a configuration from Initilizr and some SASS, HTML, and JS snippits that I use on a regular basis. This framework is built using Bower, NPM, and Grunt and it is meant to be pulled apart or modified for the project at hand.

This is here for my own storage, but please let me know if you have any feedback or suggestions.

You can make your own by doing the following:

1. Configuring your build, [http://www.initializr.com](http://www.initializr.com)
2. Install needed libraries onto your computer.
3. Write some sweet SASS Mixins and figure out a file structure that works best for you.

---
## Installation
1. Clone the repo into your site's root folder
2. Install [Node](http://nodejs.org/)
3. Make sure Ruby is installed, then install [SASS](http://sass-lang.com/) by running the command `gem install sass`
4. In terminal, go to your site's root folder and run the command: `npm install`
5. Run `npm update`
6. Run `npm install -g bower`
7. Run `bower update`
8. Run `npm install -g grunt-cli`
9. Run `grunt` to perform the default task, then you may use `grunt watch` going forward

---
## CSS framework
- In `_source/sass` there are a few files with underscores in front. These all get compiled into both `all.css` and `ie8.css`. A lot of this is pulled right out of HTML5 Boilerplate. Custom styles should go in `_style.scss`.
- The CSS setup is configured to output a normal CSS file (`all.css`) and an IE9-specific CSS file (`ie9.css`). If you are working in a mobile-first pattern, the IE9 stylesheet should dump out all off the CSS in your normal stylesheet, but without the media queries. This setup is based on the idea of serving up a static layout for IE9 and below.

---
## Javascript
- I've heard that Modernizr should be included in the `<head>`, while your custom scripts should be included just before the closing `<body>` tag. A customized dev version of Modernizr is compiled into `/js/head.min.js` and everything else should be compiled into `/js/main.min.js`.
- JQuery is included into `main.min.js` by default, but they can be removed if it isn't needed for the project.
