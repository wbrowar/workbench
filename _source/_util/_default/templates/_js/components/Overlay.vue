<template>
    <div class="vue_overlay" v-show="isActive">
        <div class="vue_overlay__mask" @click="closeOverlay"></div>
        <div class="vue_overlay__content">
            <div class="vue_overlay__content__inner" v-if="isActive">
                <slot></slot>
            </div>
            <div class="vue_overlay__content__close icon_close" @click="closeOverlay">Close</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return { isActive: false };
        },
        created() {
            VueEvent.$on('show-overlay', (id) => this.isActive = (id === this.overlayId));
        },
        mounted() {
            this.isActive = this.active;
        },
        props: {
            active: { default: false },
            overlayId: { type: String, required: true },
        },
        methods: {
            closeOverlay() {
                this.isActive = false;
                VueEvent.$emit('hide-overlay');
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    $_mq_overlay_1: 700px;
    .vue_overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 50000;

        @at-root #{&}__mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparentize($color_black_default, .6);
        }
        @at-root #{&}__content {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: $color_white_default;
            box-sizing: border-box;

            @at-root #{&}__inner {
                max-height: calc(100vh - 40px);
                overflow: auto;
            }
            @at-root #{&}__close {
                @include hide_text;
                display: block;
                position: absolute;
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                background-color: lighten($color_black_default, 90);
                background-size: 20px 20px;

                @include mq($_mq_overlay_1) {
                    top: -10px;
                    right: -10px;
                }
            }

            @include mq($_mq_overlay_1) {
                width: 80%;
                height: auto;
                background-color: transparent;
            }
        }
    }
</style>