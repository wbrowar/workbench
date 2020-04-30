<template>
  <Layout class="home">
    <div class="text-black bg-white">
      <div class="c-wrapper py-12 min-h-screen flex flex-col items-center justify-center">
        <h1 class="c-header-1">Hello, 🌎</h1>
        <div class="c-text text-2xl">This app has been installed and is ready for programming.</div>
      </div>
    </div>
  </Layout>
</template>

<script>
import MediaImage from 'Components/image/MediaImage.vue';

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
