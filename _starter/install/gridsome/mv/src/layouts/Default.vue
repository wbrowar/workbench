<template>
  <div>
    <header class="ui__header">
      <strong>
        <g-link to="/">{{ $static.metaData.siteName }}</g-link>
      </strong>
      <nav class="ui__nav">
        <g-link class="ui__nav__link" to="/">Home</g-link>
        <g-link class="ui__nav__link" to="/about">About</g-link>
      </nav>
    </header>
    <transition name="fade" appear>
      <main>
        <slot />
      </main>
    </transition>
    <footer class="ui__footer">
      <ClientOnly>
        <ColorSchemeToggle scheme-id="default" :all-schemes="['default', 'dark']" />
        <ColorSchemeToggle scheme-id="dark" :all-schemes="['default', 'dark']" />
      </ClientOnly>
    </footer>
  </div>
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<script>
import ColorSchemeToggle from 'Components/color_scheme_toggle/ColorSchemeToggle.vue';

export default {
  components: {
    ColorSchemeToggle,
  },
};
</script>

<style lang="scss">
@import 'CSS/automated/_colors.scss';
@import 'CSS/automated/_fonts.scss';
@import 'CSS/lib/_reset.scss';
@import 'CSS/base/_animations.scss';
@import 'CSS/base/_custom_properties.scss';
@import 'CSS/base/_global.scss';
@import 'CSS/automated/_components.scss';

.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}

.ui {
  $self: &;

  @at-root #{$self}__header {
    $header: &;

    position: sticky;
    height: $ui_masthead_height;
  }
  @at-root #{$self}__footer {
    $header: &;

    height: $ui_footer_height;
  }
}
</style>
