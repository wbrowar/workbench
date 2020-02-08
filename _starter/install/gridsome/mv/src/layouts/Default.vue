<template>
  <div>
    <header class="ui__header sticky">
      <div class="c-wrapper flex flex-row items-center h-full">
        <strong>
          <Button unstyle href="/" /><IconSVG handle="plus" width="40" height="40" /><div class="sr-only">{{ $static.metadata.siteName }}</div></Button>
        </strong>
        <nav class="c-buttons justify-end flex-grow">
          <Button unstyle label-text="Home" href="/" />
          <Button unstyle label-text="About" href="/about" />
          <Button unstyle label-text="Docs" href="/dev/docs/general" />
        </nav>
      </div>
    </header>
    <transition name="fade" appear>
      <main>
        <slot />
      </main>
    </transition>
    <footer class="ui__footer">
      <div class="c-wrapper py-1">
        <span>Color Scheme: </span>
        <ClientOnly>
          <ColorSchemeToggle class="mx-2" remember scheme-id="default" title="Reset to default color scheme">❌</ColorSchemeToggle>
          <ColorSchemeToggle class="mx-2" remember scheme-id="dark" title="Turn on dark color scheme (override browser setting)">🌑</ColorSchemeToggle>
          <ColorSchemeToggle class="mx-2" remember scheme-id="light" title="Turn on light color scheme (override browser setting)">🌕</ColorSchemeToggle>
        </ClientOnly>
      </div>
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

    height: $ui_masthead_height;
  }
  @at-root #{$self}__footer {
    $header: &;

    height: $ui_footer_height;
  }
}
</style>
