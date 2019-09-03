//  API
//  📬 Interact with external apis

import axios from 'axios';
import { log } from './global.js';

const defaultHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
};
const defaultUrl = 'REPLACE_URL';

export default class Api {
    constructor(args = {}) {
        this.headers = args.headers || defaultHeaders;
        this.callback = args.callback;
        this.data = args.data || null;
        this.query = args.query || null;
        this.status = 'idle';
        this.type = args.type || 'graphql';
        this.url = args.url || defaultUrl;
        this.variables = args.variables || null;

        if (this.query) {
            this.request(this.query, this.variables);
        }
    }

    graphqlRequest(query, variables = null) {
        if (this.status === 'idle') {
            this.status = 'loading';
            axios({
                url: this.url,
                method: 'post',
                data: this.data || {
                    query: query,
                    variables: variables,
                },
                headers: this.headers,
            }).then((result) => {
                this.callback(result);
                this.status = 'idle';
            });
        }
    }

    request(query, variables = null) {
        switch (this.type) {
            case 'graphql':
                this.graphqlRequest(query, variables || null);
                break;
        }
    }
}

// INIT FUNCTIONS
log('API');
