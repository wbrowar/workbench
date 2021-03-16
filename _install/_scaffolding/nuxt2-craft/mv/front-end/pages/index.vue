<template>
  <div>
    <WelcomeDemo>
      <p class="text-center" v-if="entry.title">Loaded {{ entry.title }} Entry</p>
    </WelcomeDemo>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api';
import { homeGql } from 'GQL/homeGql.js';
import { log } from 'JS/global';
import { gqlToObject } from 'JS/seomatic';
import WelcomeDemo from 'Components/welcome_demo/WelcomeDemo.vue';

interface CraftDataEntry {
  seomatic?: object;
}
interface CraftRequestData {
  entry?: CraftDataEntry;
}
interface CraftRequest {
  data: CraftRequestData;
}

export default defineComponent({
  name: 'PageHome',
  head: {},
  components: {
    WelcomeDemo,
  },
  setup() {
    const { $craft } = useContext();
    const entry = ref();
    const seomatic = ref({});

    useFetch(async () => {
      const request = await $craft({
        query: homeGql,
      });

      if (request?.data?.entry) {
        log('Entry', request.data.entry);
        entry.value = request.data.entry;

        if (request.data.entry?.seomatic) {
          seomatic.value = request.data.entry.seomatic;
        }
      }
    });

    useMeta(() => {
      return Object.keys(seomatic.value).length ? { ...gqlToObject(seomatic.value) } : {};
    });

    return { entry, seomatic };
  },
});
</script>
