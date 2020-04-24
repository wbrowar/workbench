//  Marketo
//  📈 Helpers for Marketo landing page templates

import { log } from 'JS/global.js';
import wb from 'JS/automated/wb.js';

export function getMarketoDescriptions() {
  let descriptions = {
    body: [],
    meta: [],
  };

  wb.marketo.variables.body.forEach((v) => {
    if (v.description) {
      descriptions.body.push({ label: v.label, description: v.description });
    }
  });

  wb.marketo.variables.head.forEach((v) => {
    if (v.description) {
      descriptions.meta.push({ label: v.label, description: v.description });
    }
  });

  return descriptions;
}

export function getMarketoVariables() {
  let variables = {};

  // Find all meta Marketo variables that have been parsed and saved into the body
  const metaVars = document.querySelectorAll('.marketo_meta_variable');

  // Add each variable after validating their content
  if (metaVars.length) {
    metaVars.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        const name = el.getAttribute('data-name');
        const settings = wb.marketo.variables.head.find((item) => name === item.id);
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
          variables[name] = value;
        }
      }
    });
  }

  // Find all body Marketo variables
  const bodyVars = document.querySelectorAll('.marketo_body_variable');

  // Add each variable after validating their content
  if (bodyVars.length) {
    bodyVars.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        const name = el.getAttribute('data-name');
        const settings = wb.marketo.variables.body.find((item) => name === item.id);
        let value = null;

        if (name && settings) {
          switch (settings.type) {
            case 'mktoImg':
              const mktoImgImage = document.getElementById(name);
              if (mktoImgImage) {
                value = {
                  alt: mktoImgImage.alt || '',
                  src: mktoImgImage.src || '',
                };
              }
              break;
            default:
              value = el.innerHTML;
          }
        }

        if (value !== null) {
          log('Adding meta variable', name);
          variables[name] = value;
        }
      }
    });
  }

  // Fill in any missing variables with default values found in wb.config.js
  wb.marketo.variables.head.forEach((v) => {
    if (!Object.keys(variables).includes(v.id)) {
      log('Adding meta variable from fallback', v.id);
      variables[v.id] = v.default || false;
    }
  });
  wb.marketo.variables.body.forEach((v) => {
    if (!Object.keys(variables).includes(v.id)) {
      log('Adding meta variable from fallback', v.id);
      variables[v.id] = v.default || false;
    }
  });

  return variables;
}

// INIT FUNCTIONS
log('Marketo');