<template>
  <div>
    <WelcomeDemo>
      <p class="text-center" v-if="entry.title">Loaded {{ entry.title }} Entry</p>
    </WelcomeDemo>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
  useMeta,
} from '@nuxtjs/composition-api';
import WelcomeDemo from 'Components/welcome_demo/WelcomeDemo.vue';
import { homeGql } from 'GQL/pages/homeGql.js';
import { log } from 'JS/global';
import { gqlToObject } from 'JS/seomatic';

export default defineComponent({
  name: 'PageHome',
  head: {},
  components: {
    WelcomeDemo,
  },
  setup() {
    const { $craft, $craftGlobals, payload, $preview } = useContext();
    const state = reactive({
      animatedElements: [],
      articles: [] as CraftArticleThumb[],
      entry: null as Home_Home_Entry | null,
      pageIsDark: false,
      seomatic: null as SeomaticInterface | null,
    });

    useFetch(async () => {
      let data;
      if (!$preview && payload?.entry) {
        data = payload;
      } else {
        const request = await $craft({
          apiLog: 'PageHome',
          query: homeGql,
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

    return {
      ...toRefs(state),
    };
  },
  mounted() {
    log('PageHome loaded');
  },
});
</script>
