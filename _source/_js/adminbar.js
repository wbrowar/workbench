//  ADMIN BAR
//  🍸 Class used to add Admin Bar plugin to Craft CMS websites

import { log, error } from './global.js';

export default class AdminBar {
    constructor(args = {}) {
        this.container = args.container ? document.querySelector(args.container) : document.body;
        this.initOnLoad = args.initOnLoad || true;
        this.location = args.location || 'top'; // top, bottom
        this.params = args.params || {};
        this.uri = args.uri || window.location.pathname.substr(1) || '__home__';

        // Check to see if functions from `{{ getAdminBarAssets() }}` are on the page
        // Also, doesn't render in IE to avoid JS errors
        if (typeof window.adminBarInit === "function" && !(/MSIE \d|Trident.*rv:/.test(navigator.userAgent))) {

            const data = {
                params: this.params, // Params that can be passed into Admin Bar
                uri: this.uri, // Get URI and pass it through. Use `__home__` for your homepage.
            };

            fetch('/actions/admin-bar/bar', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then((response) => {
                    const div = document.createElement('div');
                    div.innerHTML = response.content;

                    if (div.children.length > 0) {
                        if (this.location === 'top') {
                            this.container.prepend(div.children[0]);
                        } else {
                            this.container.appendChild(div.children[0]);
                        }

                        if (this.initOnLoad) {
                            // Call adminBarInit() to add Javascript events via the {{ getAdminBarAssets({ uri: craft.app.request.url }) }} Twig tag
                            this.init();
                        }
                    }
                })
                .catch(errorMessage => error('Error:', errorMessage));
        }
    }
    init() {
        window.adminBarInit();

        log('Embedded Admin Bar for URI', this.uri);
    }
}

// INIT FUNCTIONS
log('Admin Bar');