//  API
//  📬 Interact with external apis

import axios from 'axios';
import { log } from 'JS/global.js';
import { apiDefaultHeaders, apiDefaultUrl } from 'JS/settings.js';

export default class Api {
  constructor(args = {}) {
    this.headers = args.headers || apiDefaultHeaders;
    this.callback = args.callback;
    this.data = args.data || null;
    this.query = args.query || null;
    this.status = 'idle';
    this.type = args.type || 'graphql';
    this.url = args.url || apiDefaultUrl;
    this.variables = args.variables || null;

    if (this.query) {
      this.request(this.query, this.variables);
    }
  }

  // Make a GraphQL request
  // Usage:

  // You can create an API and query it later:
  // const api = new Api();
  // const query = `{
  //   ping
  // }`;
  // log(api.request(query));

  // Or perform a query right away
  //   const query = `{
  //   ping
  // }`;
  // const api = new Api({
  //   callback: (response) => {
  //     log(api.request(response.data));
  //   },
  //   query: query,
  //   variables: {
  //     slug: this.$route.params.slug,
  //   },
  // });

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
        if (typeof this.callback === 'function') {
          this.callback(result);
        }
        log('GraphQL Request', result);
        this.status = 'idle';
      });
    }
  }

  // Make a request based on the request types above (currently only graphqlRequest)
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