<template>
  <div>
    <transition name="fade" appear>
      <main>
        <slot />
      </main>
    </transition>

    <DevBar v-if="devMode || showDocsLink" />
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import wb from 'JS/automated/wb.js';
import Button from 'Components/button/Button';
import ColorSchemeToggle from 'Components/color_scheme_toggle/ColorSchemeToggle.vue';
import IconSVG from 'Components/icon_svg/IconSVG';

export default {
  components: {
    Button,
    ColorSchemeToggle,
    DevBar: () => import('Components/dev_bar/DevBar.vue'),
    IconSVG,
  },
  data() {
    return {
      devMode: wb.devMode,
      showDocsLink: wb.enableDocs,
    };
  },
};
</script>

<style lang="scss">
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
</style>
