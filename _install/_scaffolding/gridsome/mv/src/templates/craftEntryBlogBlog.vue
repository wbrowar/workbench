<template>
  <Layout>
    <article class="hello_world">
      <h1 class="c_header c_header--2">{{ entry.title }}</h1>
    </article>
  </Layout>
</template>

<page-query>
  query CraftEntry ($slug: [String] ) {
    craft {
      entry(slug: $slug)  {
        id
        title
      }
    }
  }
</page-query>

<script>
export default {
  components: {
  },
  metaInfo() {
    return {
      title: this.entry.title || '',
    };
  },
  data() {
    return {
    };
  },
  computed: {
    entry: function() {
      return this.$page.craft.entry || {};
    },
  },
};
</script>

<style lang="scss">
.team_member {
  $self: &;

}
</style>