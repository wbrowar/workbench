<template>
    <div class="c-slider__slide" :class="['c-slider__slide--' + currentStatus, 'c-slider__slide--' + previousStatus + '-to-' + currentStatus]">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentStatus: 'after',
                previousStatus: 'after',
            }
        },
    }
</script>

<style>
    @keyframes slider_slide--left-to-center {
        0% { transform: translateX(-100%) }
        100% { transform: translateX(0) }
    }
    @keyframes slider_slide--center-to-left {
        0% { transform: translateX(0) }
        100% { transform: translateX(-100%) }
    }
    @keyframes slider_slide--center-to-right {
        0% { transform: translateX(0) }
        100% { transform: translateX(100%) }
    }
    @keyframes slider_slide--right-to-center {
        0% { transform: translateX(100%) }
        100% { transform: translateX(0) }
    }

    .c-slider__slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        opacity: 0;
        transition: opacity $anim_duration_fade ease-out;

        &--before {
            transform: translateX(-100%);

            &--current-to-after {
                animation: slider_slide--center-to-left $anim_duration_slide ease-out;
            }
        }
        &--prev {
            transform: translateX(-100%);

            &--current-to-prev {
                animation: slider_slide--center-to-left $anim_duration_slide ease-out;
            }
        }
        &--current {
            opacity: 1;
            transform: translateX(0);

            &--prev-to-current {
                animation: slider_slide--left-to-center $anim_duration_slide ease-out;
            }
            &--next-to-current {
                animation: slider_slide--right-to-center $anim_duration_slide ease-out;
            }
        }
        &--next {
            transform: translateX(100%);

            &--current-to-next {
                animation: slider_slide--center-to-right $anim_duration_slide ease-out;
            }
        }
        &--after {
            transform: translateX(100%);

            &--after-to-current {
                animation: slider_slide--left-to-center $anim_duration_slide ease-out;
            }
            &--current-to-after {
                animation: slider_slide--center-to-left $anim_duration_slide ease-out;
            }
        }
    }
</style>