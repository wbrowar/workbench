//  Marketo
//  📈 Helpers for Marketo landing page templates

import { log } from 'JS/global.js';
import { variables } from '~/variables.js';

export function getMarketoDescriptions() {
  let descriptions = {
    body: [],
    meta: [],
  };

  variables.body.forEach((v) => {
    if (v.description) {
      descriptions.body.push({ label: v.label, description: v.description });
    }
  });

  variables.head.forEach((v) => {
    if (v.description) {
      descriptions.meta.push({ label: v.label, description: v.description });
    }
  });

  return descriptions;
}

export function getMarketoVariables() {
  let vars = {};

  // Find all meta Marketo variables that have been parsed and saved into the body
  const varsFromMeta = document.querySelectorAll('.marketo_meta_variable');

  // Add each variable after validating their content
  if (varsFromMeta.length) {
    varsFromMeta.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        const name = el.getAttribute('data-name');
        const settings = variables.head.find((item) => name === item.id);
        let value = null;

        if (name && settings) {
          switch (settings.type) {
            case 'mktoBoolean':
              value = el.innerHTML === 'true';
              break;
            default:
              value = el.innerHTML;
          }
        }

        if (value !== null) {
          log('Adding meta variable', name);
          vars[name] = value;
        }
      }
    });
  }

  // Find all body Marketo variables
  const varsFromBody = document.querySelectorAll('.marketo_body_variable');

  // Add each variable after validating their content
  if (varsFromBody.length) {
    varsFromBody.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        const name = el.getAttribute('data-name');
        const settings = variables.body.find((item) => name === item.id);
        let value = null;

        if (name && settings) {
          switch (settings.type) {
            case 'mktoImg': {
              const mktoImgImage = document.getElementById(name);
              if (mktoImgImage) {
                value = {
                  alt: mktoImgImage.alt || '',
                  src: mktoImgImage.src || '',
                };
              }
              break;
            }
            default:
              value = el.innerHTML;
          }
        }

        if (value !== null) {
          log('Adding meta variable', name);
          vars[name] = value;
        }
      }
    });
  }

  // Fill in any missing variables with default values found in src/variables.js
  variables.head.forEach((v) => {
    if (!Object.keys(vars).includes(v.id)) {
      log('Adding meta variable from fallback', v.id);
      vars[v.id] = v.default || false;
    }
  });
  variables.body.forEach((v) => {
    if (!Object.keys(vars).includes(v.id)) {
      log('Adding meta variable from fallback', v.id);
      vars[v.id] = v.default || false;
    }
  });

  return vars;
}

// INIT FUNCTIONS
log('Marketo');
