<template>
    <div class="c_scroll_updater" :style="scrollStyles"><slot></slot></div>
</template>

<script>
    import { log } from 'JS/global.js';

    export default {
        data() {
            return {
                scrollStyles: {},
            }
        },
        props: {
            detectionOffsetX: { default: 0 },
            detectionOffsetY: { default: 100 },
            keyframes: false,
            scrollY: false,
        },
        methods: {
            inViewport: function () {
                if (this.$el) {
                    const rect = this.$el.getBoundingClientRect();

                    return (
                        (rect.top + this.detectionOffsetY) >= 0 &&
                        (rect.left + this.detectionOffsetX) >= 0 &&
                        (rect.bottom - this.detectionOffsetY) <= (window.innerHeight || document.documentElement.clientHeight) &&
                        (rect.right - this.detectionOffsetX) <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                }
            },
            setPropertiesFromKeyframes: function (percent) {
                this.keyframes.forEach((item) => {

                    if (item.frames[percent]) {
                        log(item.handle, item.frames[percent]);
                        this.scrollStyles['--' + item.handle] = item.frames[percent];
                    }
                });
            }
        },
        watch: {
            scrollY: function () {
                if (this.inViewport()) {
                    // get scroll y
                    const rect = this.$el.getBoundingClientRect(),
                          percent = Math.floor(rect.top / window.innerHeight * 100);

                    // log('scrollY', this.scrollY);
                    // log('rect.top', rect.top);
                    // log('window.innerHeight', window.innerHeight);

                    this.scrollStyles['--scroll-y'] = rect.top;
                    this.scrollStyles['--scroll-y-offset'] = window.innerHeight - rect.top;
                    this.scrollStyles['--scroll-percent'] = percent;

                    if (this.keyframes) {
                        this.setPropertiesFromKeyframes(percent);
                    }
                } else {
                    // log('Element not in viewport');

                    // this.scrollStyles = {
                    //     '--scroll-y': 0,
                    //     '--scroll-y-offset': 0,
                    // };
                }
            }
        },
    }
</script>