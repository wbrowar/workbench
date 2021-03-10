<template>
  <div>
    <WelcomeDemo>
      <p class="text-center" v-if="entry.title">Loaded {{ entry.title }} Entry</p>
    </WelcomeDemo>
  </div>
</template>

<script>
import { defineComponent, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api';
import WelcomeDemo from 'Components/welcome_demo/WelcomeDemo.vue';
import { homeGql } from 'GQL/homeGql.js';
import { log } from 'JS/global';

export default defineComponent({
  head: {},
  components: {
    WelcomeDemo,
  },
  setup() {
    const { $craft } = useContext();
    const entry = ref({});

    useFetch(async () => {
      const request = await $craft({
        query: homeGql,
      });

      if (request?.data?.entry) {
        log('Entry', request.data.entry);
        entry.value = request.data.entry;
      }
    });

    useMeta(() => ({ title: entry.value?.title || null }));

    return { entry };
  },
});
</script>
