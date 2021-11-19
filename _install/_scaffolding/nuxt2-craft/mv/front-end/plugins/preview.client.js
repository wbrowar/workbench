import { defineNuxtPlugin } from '@nuxtjs/composition-api';

export default defineNuxtPlugin(async ({ enablePreview, query }) => {
  if (query.CraftPreviewSlug) {
    await enablePreview();
  }
});
