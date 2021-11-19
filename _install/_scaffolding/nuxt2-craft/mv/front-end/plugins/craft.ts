import { defineNuxtPlugin } from '@nuxtjs/composition-api';

interface CraftParams {
  apiLog?: string;
  responseLog?: Function;
}
interface CraftFetchReturn {
  data?: any;
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $craft(params: object): CraftFetchReturn;
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$craft inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $craft(params: object): CraftFetchReturn;
  }
  // nuxtContext.$craft
  interface Context {
    $craft(params: object): CraftFetchReturn;
  }
}

// declare module 'vuex/types/index' {
//   // this.$craft inside Vuex stores
//   interface Store<S> {
//     $craft(message: string): void;
//   }
// }

export default defineNuxtPlugin((ctx, inject) => {
  // Create $craft and inject it into Vue components
  // Usage: `this.$craft({ query: gqlQuery, variables: { uri: `code/${this.$route.params.slug}` } })`

  async function requestDataFromApi(apiPath: string, params: object): Promise<string> {
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ctx.$config.craftAuthToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return await response.json();
  }

  inject('craft', async (params: CraftParams) => {
    // eslint-disable-next-line no-console
    console.log(
      `🗄 API call${params.apiLog ? ': ' + params.apiLog : ''} | Live Preview: ${ctx.$preview ? 'true' : 'false'}`
    );

    if (ctx.$config.craftApiUrl && ctx.$config.craftAuthToken) {
      try {
        const previewToken = ctx.$preview && ctx.query?.token ? `?token=${ctx.query.token}` : '';
        return await requestDataFromApi(ctx.$config.craftApiUrl + previewToken, params).then((response) => {
          if (params.responseLog) {
            params.responseLog(
              typeof response === 'string' ? JSON.parse(response)?.data : (response as Record<string, any>).data
            );
          }

          return response;
        });
      } catch (error) {
        return {
          error: { error: error.message },
        };
      }
    }
    return {
      error: { error: `No connection information set.` },
    };
  });
});
