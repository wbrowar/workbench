<template>
  <div class="c-<%- handleKebab %>"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { log } from 'JS/global';

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
  created() {},
  mounted() {},
});
</script>

<style scoped>
.c-<%- handleKebab %> {
}
</style>
