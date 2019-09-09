<template>
  <div class="layout">
    <header class="header">
      <strong>
        <g-link to="/">{{ $static.metaData.siteName }}</g-link>
      </strong>
      <nav class="nav">
        <g-link class="nav__link" to="/">Home</g-link>
        <g-link class="nav__link" to="/about">About</g-link>
      </nav>
    </header>
    <slot/>
  </div>
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<style lang="scss">
  @import "~starter/_css/automated/_colors.scss";
  @import "~starter/_css/automated/_fonts.scss";
  @import "~starter/_css/lib/_reset.scss";
  @import "~starter/_css/base/_animations.scss";
  @import "~starter/_css/base/_custom_properties.scss";
  @import "~starter/_css/base/_global.scss";
</style>
