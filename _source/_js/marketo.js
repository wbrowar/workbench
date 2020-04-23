//  Marketo
//  📈 Helpers for Marketo landing page templates

import { log } from 'JS/global.js';
import wb from 'JS/automated/wb.js';

export function getMarketoVariables() {
  let variables = {};

  const metaVars = document.querySelectorAll('.marketo_meta_variable');

  if (metaVars.length) {
    metaVars.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        log('Adding meta variable', el.getAttribute('data-name'));
        variables[el.getAttribute('data-name')] = el.getAttribute('data-type') === 'mktoBoolean' ? el.innerHTML === 'true' : el.innerHTML;
      }
    });
  } else {
    wb.marketo.variables.head.forEach((v) => {
      log('Adding meta variable from fallback', v.id);
      variables[v.id] = v.default || '';
    });
  }

  const bodyVars = document.querySelectorAll('.marketo_body_variable');

  if (bodyVars.length) {
    bodyVars.forEach((el) => {
      if (el.hasAttribute('data-type')) {
        switch (el.getAttribute('data-type')) {
          case 'mktoText':
            log('Adding body variable', el.id);
            variables[el.id] = el.innerHTML;
            break;
        }
      }
    });
  } else {
    wb.marketo.variables.body.forEach((v) => {
      log('Adding body variable from fallback', v.id);
      variables[v.id] = v.default || '';
    });
  }

  return variables;
}

// INIT FUNCTIONS
log('Marketo');