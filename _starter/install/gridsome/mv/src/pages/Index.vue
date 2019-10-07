<template>
  <Layout class="home">
    <section class="home__example c_box--full">
      <MediaImage background alt="FPO image" :sources="[{ src: `/img/FPO.png` }]" />
    </section>
    <Flex center element-type="section" class="home__example c_box--v">
      <h2 class="c_header c_header--2">Section 2</h2>
    </Flex>
    <Flex center element-type="section" class="home__example c_box--v">
      <h2 class="c_header c_header--3">Section 3</h2>
    </Flex>
    <Flex center element-type="section" class="home__example c_box--v">
      <h2 class="c_header c_header--4">Section 4</h2>
    </Flex>
  </Layout>
</template>

<script>
import Flex from 'Components/flex/Flex';
import MediaImage from 'Components/image/MediaImage';

export default {
  components: {
    Flex,
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
    background-color: colora('black', 0.5);
    color: colora('white', 0.5);

    &:first-child {
      height: calc(100vh - #{$ui_masthead_height});
    }
    &:last-child {
      height: calc(100vh - #{$ui_footer_height});
    }
    &:nth-child(odd) {
      background-color: colora('black', 0.6);
    }
  }
}
</style>
