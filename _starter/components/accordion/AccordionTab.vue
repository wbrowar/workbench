<template>
    <div class="vue_accordion__tab">
        <div class="vue_accordion__tab__title" :class="{ active:isActive }" @click="onTabSelected">{{ title }}</div>
        <div class="vue_accordion__tab__content" :class="{ active:isActive }"><div class="vue_accordion__tab__content__inner"><slot></slot></div></div>
    </div>
</template>

<script>
    import * as g from 'starter/_js/global.js';

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
    @import "starter/_css/automated/_colors.scss";
    @import "starter/_css/base/_functions.scss";
    @import "starter/_css/base/_variables.scss";
    @import 'starter/_css/base/_mixins.scss";

    .vue_accordion__tab {
        margin-bottom: 20px;
        border: 1px solid lighten($color_black_raw, 90);
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
                border-top-color: lighten($color_black_raw, 90);
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