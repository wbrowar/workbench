//  HOME
//  🏡 Scripts specific to the home page of the website

//import jq from 'jquery';
import * as g from 'global';

// CUSTOM FUNCTIONS


// BROWSER EVENTS


// INIT FUNCTIONS
if (jsDevMode) {
  console.log('Home');
}

<% if (styleTemplateConfig.sections.animations.modules.scroll_slide_in || styleTemplateConfig.sections.images.modules.lazy_load_srcset) { %>g.setupEnhancments();<% } %>