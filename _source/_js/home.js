//  HOME
//  🏡 Scripts specific to the home page of the website

import jq from 'jquery';
import * as g from 'global';
import emergence from 'emergence';

// CUSTOM FUNCTIONS
function setupEnhancments() {
  emergence.init({
  reset: false,
  callback: function(element, state) {
      if (state === 'visible' && g.hasClass(element, 'animate')) {
        g.addClass(element, 'animated');
        g.removeClass(element, 'animate');
        element.removeAttribute('data-emergence');
      }

      // lazy load images
      if (state === 'visible' && element.hasAttribute('data-srcset')) {
        const srcset = element.getAttribute('data-srcset');
        element.setAttribute('srcset', srcset);
        element.removeAttribute('data-srcset');
        element.removeAttribute('data-emergence');
        g.addClass(element, 'animated');
      }

      // lazy load videos and audio files
      if (state === 'visible' && element.hasAttribute('data-src')) {
        const src = element.getAttribute('data-src');
        element.setAttribute('src', src);
        element.removeAttribute('data-src');
        element.removeAttribute('data-emergence');
        g.addClass(element, 'animated');
      }

      // lazy load Marketo Forms
      if (state === 'visible' && g.hasClass(element, 'marketoform')) {
        const formId = element.getAttribute('data-form-id');
        const formElementId = parseFloat(element.getAttribute('id').substr(9));

        MktoForms2.loadForm("//app-sj19.marketo.com", formId, formElementId);
        element.removeAttribute('data-emergence');
      }
    }
  });
}

// BROWSER EVENTS


// INIT FUNCTIONS
if (jsDevMode) {
  console.log('Home');
}

setupEnhancments();