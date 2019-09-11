<template>
  <Layout class="page--home">
    <section class="home__example">
      <h1 class="c_header c_header--1">Home</h1>
    </section>
    <section element-type="section" class="home__example">
      <h2 class="c_header c_header--2">Section 2</h2>
    </section>
    <section element-type="section" class="home__example">
      <h2 class="c_header c_header--3">Section 3</h2>
    </section>
    <section element-type="section" class="home__example">
      <h2 class="c_header c_header--4">Section 4</h2>
    </section>
  </Layout>
</template>

<script>
export default {
  components: {
    LazyLoad: () => import('@/components/LazyLoad.vue'),
  },
  metaInfo: {
    title: 'Hello, world!'
  }
}
</script>

<style lang="scss">
@import "~starter/_css/automated/_colors.scss";
@import "~starter/_css/base/_functions.scss";
@import "~starter/_css/base/_variables.scss";

.home {
  $self: &;

  @at-root #{$self}__example {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: colora('black', .5);
    color: colora('white', .5);

    &:first-child {
      height: calc(100vh - #{ $ui_masthead_height });
    }
    &:last-child {
      height: calc(100vh - #{ $ui_footer_height });
    }
    &:nth-child(odd) {
      background-color: colora('black', .6);
    }
  }
}
</style>
