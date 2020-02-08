<template>
  <Layout class="home">
    <section class="home__example c_box--full">
      <MediaImage background alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
    </section>
    <section class="home__example flex items-center justify-center h-screen">
      <h2 class="c-header-1">Section 2</h2>
    </section>
    <section class="home__example flex items-center justify-center h-screen">
      <h2 class="c-header-2">Section 3</h2>
    </section>
    <section class="home__example flex items-center justify-center">
      <h2 class="c-header-3">Section 4</h2>
    </section>
  </Layout>
</template>

<script>
import MediaImage from 'Components/image/MediaImage';

export default {
  components: {
    MediaImage,
  },
  metaInfo: {
    title: 'Hello, world!',
  },
};
</script>

<style lang="scss">
.home {
  $self: &;

  @at-root #{$self}__example {
    @apply bg-black-50 text-white-50;

    &:first-child {
      height: calc(100vh - #{$ui_masthead_height});
    }
    &:last-child {
      height: calc(100vh - #{$ui_footer_height});
    }
    &:nth-child(odd) {
      @apply bg-black-60;
    }
  }
}
</style>
