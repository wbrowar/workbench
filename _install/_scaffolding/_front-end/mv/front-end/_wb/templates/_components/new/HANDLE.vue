<template>
  <div class="c-<%- handleKebab %>"></div>
</template>

<script lang="ts">
import { defineComponent } from '<%- ["nuxt2", "nuxt2-craft"].includes(settings.projectType) ? "@nuxtjs/composition-api" : "vue" %>';
import { log } from 'JS/global';

export default defineComponent({
  name: <%- `'${condensedName}'` %>,
  components: {},
  props: {},
  setup() {
    // const state = reactive({});

    // return {
    //   ...toRefs(state),
    // };
  },
  computed: {},
  methods: {},
  mounted() {
    log(`Loaded <%- condensedName %>`);
  },
});
</script>

<style scoped>
.c-<%- handleKebab %> {
}
</style>
