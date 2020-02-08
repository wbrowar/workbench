<template>
  <Layout class="about">
    <article class="about__example flex items-center justify-center bg-gray-700-30 text-black-50">
      <h1 class="c-header-1">About</h1>
    </article>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'About us',
  },
};
</script>

<style lang="scss">
.about {
  $self: &;

  @at-root #{$self}__example {
    height: calc(100vh - #{$ui_masthead_height} - #{$ui_footer_height});
  }
}
</style>
