<template>
  <div class="c-<%- handleKebab %>"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { log } from 'JS/global';

export default defineComponent({
  name: <%- `'${condensedName}'` %>,
  components: {},
  data() {
    return {};
  },
  props: {},
  computed: {},
  methods: {},
  setup() {},
  created() {},
  mounted() {},
});
</script>

<style>
.c-<%- handleKebab %> {
}
</style>
