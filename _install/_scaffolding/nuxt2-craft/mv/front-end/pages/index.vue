<template>
  <div>
    <WelcomeDemo v-if="entry">
      <p class="text-center">Loaded {{ entry.title }} Entry</p>
    </WelcomeDemo>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  useStore,
} from '@nuxtjs/composition-api';
import { articleGql } from 'GQL/pages/articleGql.js';
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
  name: 'PageArticle',
  head: {},
  components: {
    WelcomeDemo,
  },
  setup() {
    const { $craft, payload, $preview } = useContext();
    const route = useRoute();
    const state = reactive({
      entry: null,
      seomatic: null,
    });

    useFetch(async () => {
      let data;
      if (!$preview && payload) {
        data = payload;
      } else {
        const request: CraftRequest = await $craft({
          apiLog: 'PageArticle',
          query: articleGql,
          variables: {
            uri: `segment/${route.value.params.slug}`,
          },
        });

        if (request?.data) {
          data = request.data;
        }
      }

      if (data?.entry) {
        state.entry = data.entry;

        if (data.entry.seomatic) {
          state.seomatic = data.entry.seomatic;
        }
      }
    });

    useMeta(() => {
      return state.seomatic ? { ...gqlToObject(state.seomatic) } : {};
    });

    return { ...toRefs(state) };
  },
  mounted() {
    log('PageArticle loaded');
  },
});
</script>
