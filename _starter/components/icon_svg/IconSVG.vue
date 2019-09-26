<template>
    <div class="c_icon_svg" v-bind="svgAttributes" v-html="svgHtml || null"></div>
</template>

<script>
    import * as svg from 'JS/automated/svg.js';
    import MediaImage from 'Components/image/MediaImage';

    export default {
        data() {
            return {
                svgHtml: false,
            };
        },
        props: {
            background: { type: Boolean, default: false },
            color: String,
            colorVar: String,
            handle: { type: String, required: true },
            image: { type: Boolean, default: false },
            replacements: { type: Object },
        },
        computed: {
            colorVarString: function() {
                return this.colorVar ? `var(--color-${ this.colorVar })` : null;
            },
            svgAttributes: function() {
                let attrs = {};

                if (this.background) {
                    attrs = {
                        style: {
                            backgroundImage: svg.background(this.handle, this.replacements || {}),
                        }
                    }
                } else if (this.image) {
                    attrs = {
                        is: 'img',
                        src: svg.src(this.handle, this.replacements || {}),
                    }
                } else {
                    this.svgHtml = svg.html(this.handle, this.replacements || {});
                    if (this.color || this.colorVar) {
                        attrs = {
                            class: 'c_icon_svg--color',
                            style: {
                                '--color': this.colorVarString || this.color,
                            }
                        }
                    }
                }

                return attrs;
            },
        },
    }
</script>

<style lang="scss">
    .c_icon_svg {
        @at-root #{&}--color {
            @include svg_color(#{ var(--color) });
        }
    }
</style>