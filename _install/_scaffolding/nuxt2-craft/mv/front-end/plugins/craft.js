export default function(context, inject) {
  // Create $craft and inject it into Vue components
  // Usage: `this.$craft({ query: gqlQuery, variables: { uri: `code/${this.$route.params.slug}` } })`

  inject('craft', async (params) => {
    /*
     * Serverless Method
     * Use serverless functions, like Lambda or Netlify functions
     */
    if (context.$preview && context.query?.token && context.$config.serverlessDirectory) {
      const previewPayload = {
        request: params,
        token: context.query.token,
      };

      try {
        const response = await fetch(`${context.$config.serverlessDirectory}/craft`, {
          method: 'POST',
          body: JSON.stringify(previewPayload),
        });

        return response.json();
      } catch (error) {
        return {
          error: { error: error.message },
        };
      }
    }

    if (context.$config.craftApiUrl && context.$config.craftAuthToken) {
      try {
        const previewToken = context.$preview && context.query?.token ? `?token=${context.query.token}` : '';
        const response = await fetch(context.$config.craftApiUrl + previewToken, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${context.$config.craftAuthToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        return response.json();
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
}
