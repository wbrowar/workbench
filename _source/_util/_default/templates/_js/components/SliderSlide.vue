<template>
    <div class="c_slider__slide" :class="'c_slider__slide--' + currentStatus">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentStatus: 'after'
            }
        },
        props: {
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<style lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    .c_slider__slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        transition: transform $anim_duration_slide ease-out;

        &:first-child {
            //position: relative;
        }
        &.active {
            color: lighten($color_black_default, 50);
        }

        @at-root #{&}--before {
            transform: translateX(-100%);
            visibility: hidden;
        }
        @at-root #{&}--prev {
            transform: translateX(-100%);
        }
        @at-root #{&}--next {
            transform: translateX(100%);
        }
        @at-root #{&}--after {
            transform: translateX(100%);
            visibility: hidden;
        }
    }
</style>