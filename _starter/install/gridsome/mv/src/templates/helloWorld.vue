<template>
  <Layout>
    <article class="hello_world">
      <h1 class="c_header c_header--2">{{ entry.title }}</h1>
    </article>
  </Layout>
</template>

<script>
import Layout from '~/layouts/Default.vue';

export default {
  components: {
    Layout,
  },
  metaInfo() {
    return {
      title: this.entry.title,
    };
  },
  data() {
    return {
      entry: false,
    };
  },
  created() {
    this.entry = this.$page.craft.entries[0];
  },
};
</script>

<style lang="scss">
.team_member {
  $self: &;

}
</style>

<page-query>
query($slug: [String]) {
  craft {
    entries(limit: 1, section: "helloWorld", slug: $slug) {
      title
      slug
    }
  }
}
</page-query>
