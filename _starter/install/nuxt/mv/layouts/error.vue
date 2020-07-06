<template>
  <div class="flex flex-col items-center justify-center min-h-screen-no-nav sm:min-h-screen-no-nav-desktop bg-blue-900">
    <div class="mb-3 font-apple font-hairline text-5xl text-blue">
      <h1 v-if="error.statusCode === 404">Page not found</h1>
      <h1 v-else>An error occurred</h1>
    </div>
    <Button class="bg-white text-blue" href="/" label-text="Go Back Home" />
  </div>
</template>

<script>
// import { log } from 'JS/global.js';
import Button from 'Components/button/Button.vue';

export default {
  components: {
    Button,
  },
  data() {
    return {};
  },
  // Let Retour handle the 404 error
  //   async fetch({ redirect }) {
  //     const request = await this.$craft({
  //       query: `query retourGql($uri: String) {
  //   retour(uri: $uri) {
  //     redirectDestUrl
  //   }
  // }`,
  //       variables: {
  //         uri: `/${this.$route.params.path}`,
  //       },
  //     });
  //
  //     if (request.data.retour) {
  //       if (request.data.retour.redirectDestUrl) {
  //         log('Redirecting', request.data.retour.redirectDestUrl);
  //         redirect(request.data.retour.redirectDestUrl);
  //       }
  //     }
  //   },
  head() {
    return { title: 'Page not found!' };
  },
  props: {
    error: String,
  },
};
</script>
