<template>
  <div>
    <header class="ui__header">
      <strong>
        <g-link to="/"><IconSVG handle="plus" width="40" height="40" /><div class="c_text--hide">{{ $static.metadata.siteName }}</div></g-link>
      </strong>
      <nav class="c-buttons">
        <Button label-text="Home" href="/" />
        <Button label-text="About" href="/about" />
        <Button label-text="Docs" href="/dev/docs/general" />
      </nav>
    </header>
    <transition name="fade" appear>
      <main>
        <slot />
      </main>
    </transition>
    <footer class="ui__footer">
      <span>Color Scheme: </span>
      <ClientOnly>
        <ColorSchemeToggle scheme-id="default" title="Reset to default color scheme">🌎</ColorSchemeToggle>
        <ColorSchemeToggle scheme-id="dark" title="Turn on dark color scheme (override browser setting)">🌒</ColorSchemeToggle>
        <ColorSchemeToggle scheme-id="light" title="Turn on light color scheme (override browser setting)">🌖</ColorSchemeToggle>
      </ClientOnly>
    </footer>
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
import Button from 'Components/button/Button';
import ColorSchemeToggle from 'Components/color_scheme_toggle/ColorSchemeToggle.vue';
import IconSVG from 'Components/icon_svg/IconSVG';

export default {
  components: {
    Button,
    ColorSchemeToggle,
    IconSVG,
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
