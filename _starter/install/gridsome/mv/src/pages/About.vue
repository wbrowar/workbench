<template>
  <Layout class="page--about">
    <article class="about__example">
      <h1 class="c_header c_header--1">About</h1>
    </article>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'About us'
  }
}
</script>

<style lang="scss">
  @import "~starter/_css/automated/_colors.scss";
  @import "~starter/_css/base/_functions.scss";
  @import "~starter/_css/base/_variables.scss";

  .about {
    $self: &;

    @at-root #{$self}__example {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: colora('white', .5);
      height: calc(100vh - #{ $ui_masthead_height });
      color: colora('black', .5);
    }
  }
</style>