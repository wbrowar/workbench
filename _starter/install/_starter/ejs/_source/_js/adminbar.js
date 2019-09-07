//  ADMIN BAR
//  🍸 Class used to add Admin Bar plugin to Craft CMS websites

import { log, error } from './global.js';

export default class AdminBar {
  constructor(args = {}) {
    this.container = args.container ? document.querySelector(args.container) : document.body;
    this.loaded = false;
    this.location = args.location || 'top'; // top, bottom
    this.params = args.params || {};
    this.uri = args.uri || window.location.pathname.substr(1) || '__home__';
    this.wait = args.wait || false;

    // Check to see if functions from `{{ getAdminBarAssets() }}` are on the page
    if (typeof window.adminBarInit === 'function' && window.fetch && !this.wait) {
      if (this.load()) {
        // Call adminBarInit() to add Javascript events via the {{ getAdminBarAssets({ uri: craft.app.request.url }) }} Twig tag
        this.init();
      }
    }
  }
  static init() {
    window.adminBarInit();

    log('Embedded Admin Bar for URI', this.uri);
  }
  load(cb = false) {
    const data = {
      params: this.params, // Params that can be passed into Admin Bar
      uri: this.uri, // Get URI and pass it through. Use `__home__` for your homepage.
    };

    fetch('/actions/admin-bar/bar', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.response === 'success') {
          const div = document.createElement('div');
          div.innerHTML = response.content;

          if (div.children.length > 0) {
            if (this.location === 'top') {
              this.container.prepend(div.children[0]);
            } else {
              this.container.appendChild(div.children[0]);
            }

            this.loaded = true;

            if (typeof cb === 'function') {
              cb();
            }

            return true;
          }
        }

        return false;
      })
      .catch((errorMessage) => error('Error:', errorMessage));
  }
}

// INIT FUNCTIONS
log('Admin Bar');
