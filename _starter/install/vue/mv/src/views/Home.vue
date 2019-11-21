<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Button label="Google" href="http://google.com" />
    Hello!
  </div>
</template>

<script>
// @ is an alias to /src
import Button from 'Components/button/Button.vue';

export default {
  name: 'home',
  components: {
    Button,
  },
};
</script>
