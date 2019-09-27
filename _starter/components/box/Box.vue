<template>
    <div :is="elementType" :style="boxStyles">
        <slot />
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
            elementType: { type: String, default: 'div' },
        },
        computed: {
            boxStyles: function() {
                let styles = { };

                return styles;
            },
        },
        methods: {
        },
        created() {
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .c_box {
        $self: &;

        background: red;
    }
</style>