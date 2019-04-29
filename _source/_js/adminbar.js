//  ADMIN BAR
//  🍸 Class used to add Admin Bar plugin to Craft CMS websites

import { log, error } from './global.js';

export default class AdminBar {
    constructor(args = {}) {
        // Check to see if functions from `{{ getAdminBarAssets() }}` are on the page
        // Also, doesn't render in IE to avoid JS errors
        if (typeof window.adminBarInit === "function" && !(/MSIE \d|Trident.*rv:/.test(navigator.userAgent))) {
            const container = args.container ? document.querySelector(args.container) : document.body;
            const init = args.init || true;
            const location = args.location || 'top'; // top, bottom
            const uri = args.uri || window.location.pathname.substr(1) || '__home__';

            const data = {
                params: {},
                uri: uri, // Get URI and pass it through. Use `__home__` for your homepage.
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
                        if (location === 'top') {
                            container.prepend(div.children[0]);
                        } else {
                            container.appendChild(div.children[0]);
                        }

                        if (init) {
                            // Call adminBarInit() to add Javascript events via the {{ getAdminBarAssets({ uri: craft.app.request.url }) }} Twig tag
                            this.init();

                            log('Embedded Admin Bar for URI', uri);
                        }
                    }
                })
                .catch(errorMessage => error('Error:', errorMessage));
        }
    }
    init() {
        window.adminBarInit();
    }
}

// INIT FUNCTIONS
log('Admin Bar');
