<template>
  <div>
    <p class="bg-black text-white p-6">Test!</p>
    <p class="bg-black text-white p-6">Dev Mode is on!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'App',
  components: {},
  computed: {
    ...mapState(['devMode']),
  },
  mounted() {
    console.log(this.devMode);
  },
});
</script>
