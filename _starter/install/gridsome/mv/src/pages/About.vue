<template>
  <Layout>
    <h1>About us</h1>
    <MediaImage :sources="[
      { src: '/img/FPO.png' }
    ]" />
    <p>But yeah, hey!</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error doloremque omnis animi, eligendi magni a voluptatum, vitae, consequuntur rerum illum odit fugit assumenda rem dolores inventore iste reprehenderit maxime! Iusto.</p>
  </Layout>
</template>

<script>

export default {
  components: {
    MediaImage: () => import('@/components/MediaImage.vue'),
  },
  metaInfo: {
    title: 'About us'
  }
}
</script>
