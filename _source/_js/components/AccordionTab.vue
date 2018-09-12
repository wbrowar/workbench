<template>
    <div class="vue_accordion__tab">
        <div class="vue_accordion__tab__title" :class="{ active:isActive }" @click="onTabSelected">{{ title }}</div>
        <div class="vue_accordion__tab__content" :class="{ active:isActive }"><div class="vue_accordion__tab__content__inner"><slot></slot></div></div>
    </div>
</template>

<script>
    import * as g from './../global.js';

    export default {
        data() {
            return { isActive: false };
        },
        mounted() {
            this.isActive = this.selected;
        },
        props: {
            accordionId: { required: true },
            title: false,
            selected: { default: false },
        },
        methods: {
            onTabSelected() {
                if (!this.isActive) {
                    VueEvent.$emit('tab-selected', this.accordionId, this.title);
                    g.gaTrack('accordion', 'clicked', this.title);
                } else {
                    this.isActive = false;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    // COLORS
:root {
  --color-white: rgb(255, 255, 255);
  --color-black: rgb(0, 0, 0);
  --color-alert_success: rgb(45, 176, 51);
  --color-alert_error: rgb(176, 25, 22);
  --color-alert_warning: rgb(238, 199, 0);
}

$color_white: var(--color-white);
$color_black: var(--color-black);
$color_alert_success: var(--color-alert_success);
$color_alert_error: var(--color-alert_error);
$color_alert_warning: var(--color-alert_warning);

$color_white_raw: rgb(255, 255, 255);
$color_black_raw: rgb(0, 0, 0);
$color_alert_success_raw: rgb(45, 176, 51);
$color_alert_error_raw: rgb(176, 25, 22);
$color_alert_warning_raw: rgb(238, 199, 0);

    // CSS CUSTOM PROPERTIES
:root {
  --spacing-box: 50px;
  --spacing-text: 30px;
  --max-width: 1100px;
  --max-width-text: 700px;
}

// SITE VARIABLES
// ANIMATIONS
$anim_duration_default: 0.3s;
$anim_duration_fade: $anim_duration_default;
$anim_duration_slide: $anim_duration_default;

// LAYOUT
$grid_gap_default: 20px;
$spacing_box: var(--spacing-box);
$spacing_text: var(--spacing-text);
$max_width: var(--max-width);
$max_width_text: var(--max-width-text);

// MEDIA QUERIES
$mq_grid_start: 700px;

// SITE MIXINS
// BOX
// Default modifiers that affect spacing and layout of box elements
@mixin box_modifiers($self: &) {
  @at-root #{$self}--center {
    text-align: center;
  }
  @at-root #{$self}--margin {
    margin-top: $spacing_text;
    margin-bottom: $spacing_text;

    @at-root #{&}--auto {
      margin-right: auto;
      margin-left: auto;
    }
    @at-root #{&}--top {
      margin-top: $spacing_text;
    }
    @at-root #{&}--right {
      margin-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      margin-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      margin-left: $spacing_text;
    }
  }
  @at-root #{$self}--padding {
    padding-top: $spacing_text;
    padding-bottom: $spacing_text;

    @at-root #{&}--top {
      padding-top: $spacing_text;
    }
    @at-root #{&}--right {
      padding-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      padding-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      padding-left: $spacing_text;
    }
  }
}

// FONTS
// For the font() mixin, see _source/automated/_fonts
// If this file is empty, run `gulp first` to populate it

// Set scalable font size (in vw units) and set fallback
// @include fz(7, 5rem, 700px);
// $font_vw_unit = value for vw unit
// $font_fallback_size = fallback size used if vw units are not supported by the browser
// $font_fallback_mq = at this width, the texrt will stop scaling up
@mixin fz($font_vw_unit, $font_fallback_size: '', $font_fallback_mq: '') {
  @if $font_fallback_size != '' {
    font-size: $font_fallback_size;
  }
  font-size: $font_vw_unit + vw;

  @if $font_fallback_mq != '' {
    @include mq($font_fallback_mq) {
      font-size: $font_fallback_size;
    }
  }
}

// LAYOUT
// Centers three divs with a background, middle, and foreground layers
@mixin layout_centered_image_text {
  position: relative;

  @at-root #{&}__background, #{&}__middle, #{&}__foreground, #{&}__url_mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  @at-root #{&}__background {
    z-index: 1;
  }
  @at-root #{&}__middle {
    z-index: 2;
  }
  @at-root #{&}__foreground {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }
  @at-root #{&}__url_mask {
    z-index: 4;
  }
}

// MARKETO
// Remove Marketo's default styles on embedded forms
@mixin marketo_reset {
  &.mktoForm {
    padding: 0 !important;
    width: 100% !important;

    div {
      float: none !important;
      min-height: 0 !important;
    }
    .mktoFormCol {
      margin: 0 !important;
      padding: 0 !important;
    }
    .mktoFormRow {
      margin-bottom: 14px;
    }
    .mktoOffset, .mktoGutter, .mktoClear {
      display: none !important;
    }
    .mktoTextField, .mktoTelField, .mktoEmailField, textarea, select {
      float: none !important;
      width: 100% !important;
      box-sizing: border-box;
    }
    .mktoButtonWrap {
      margin-left: 0 !important;
    }
    .mktoLabel {
      display: block !important;
      float: none !important;
      width: 100% !important;
    }
    .mktoAsterix {
      display: none !important;
    }
  }
}

// MEDIA QUERIES
// Quickly write simple media queries
// @include mq(600px) {  }
@mixin _mq_handler($mq_min_max, $mq_direction, $breakpoint, $additional_media: '') {
  @if $additional_media != '' {
    @media (#{$mq_min_max}-#{$mq_direction}: $breakpoint, $additional_media) {
      @content;
    }
  } @else {
    @media (#{$mq_min_max}-#{$mq_direction}: $breakpoint) {
      @content;
    }
  }
}

@mixin mq($breakpoint, $additional_media: '') {
  @include _mq_handler('min', 'width', $breakpoint, $additional_media) {
    @content;
  }
}

@mixin mq_max($breakpoint, $additional_media: '') {
  @include _mq_handler('max', 'width', ($breakpoint - 1px), $additional_media) {
    @content;
  }
}

@mixin mq_v($breakpoint, $additional_media: '') {
  @include _mq_handler('min', 'height', $breakpoint, $additional_media) {
    @content;
  }
}

@mixin mq_vmax($breakpoint, $additional_media: '') {
  @include _mq_handler('max', 'height', ($breakpoint - 1px), $additional_media) {
    @content;
  }
}

@mixin bg_2x {
  @media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-resolution: 192dpi) {
    @content;
  }
}

// PLACEHOLDER
// Style placeholder
@mixin placeholder {
  ::-webkit-input-placeholder {
    @content;
  }
  :-moz-placeholder {
    @content;
  }
  ::-moz-placeholder {
    @content;
  }
}

// SVG
// Turn SVG fill to color
@mixin svg_color($color: $color_white, $color_paths: true, $color_polygons: true, $color_rects: true, $color_circles: true) {
  @if $color_paths == true {
    path {
      fill: $color;
    }
  }
  @if $color_polygons == true {
    polygon {
      fill: $color;
    }
  }
  @if $color_rects == true {
    rect {
      fill: $color;
    }
  }
  @if $color_circles == true {
    circle {
      fill: $color;
    }
  }
}

// TEXT
// Default modifiers that affect spacing and layout of text
@mixin text_modifiers($self: &) {
  @at-root #{$self}--center {
    text-align: center;
  }
  @at-root #{$self}--margin {
    margin-top: $spacing_text;
    margin-bottom: $spacing_text;

    @at-root #{&}--auto {
      margin-right: auto;
      margin-left: auto;
    }
    @at-root #{&}--top {
      margin-top: $spacing_text;
    }
    @at-root #{&}--right {
      margin-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      margin-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      margin-left: $spacing_text;
    }
  }
  @at-root #{$self}--padding {
    padding-top: $spacing_text;
    padding-bottom: $spacing_text;

    @at-root #{&}--top {
      padding-top: $spacing_text;
    }
    @at-root #{&}--right {
      padding-right: $spacing_text;
    }
    @at-root #{&}--bottom {
      padding-bottom: $spacing_text;
    }
    @at-root #{&}--left {
      padding-left: $spacing_text;
    }
  }
}
// Hide text for things like buttons or links that are replaced with a background image
@mixin hide_text {
  text-indent: -99999px;
}
// Add ellipsis to a single line of text when the amount of text no longer fits
@mixin truncate {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

    .vue_accordion__tab {
        margin-bottom: 20px;
        border: 1px solid lighten($color_black, 90);
        border-radius: 2px;

        @at-root #{&}__title {
            padding: 10px 10px 8px;
            //@extend .icon_plus;
            background-position: calc(100% - 10px) 50% !important;
            background-size: 15px 15px !important;
            cursor: pointer;

            &.active {
                // @TODO figure out a new way to do this
                //@extend .icon_minus;
            }
        }
        @at-root #{&}__content {
            height: 0;
            border-top: 1px solid transparent;
            overflow: hidden;
            transform: translateY(-10px);
            opacity: 0;
            transition: opacity .3s ease-out, transform .3s ease-out;

            &.active {
                height: auto;
                border-top-color: lighten($color_black, 90);
                opacity: 1;
                transform: translateY(0);
            }
            @at-root #{&}__inner {
                padding: 10px 10px 8px;
                box-sizing: border-box;
            }
        }
    }
</style>