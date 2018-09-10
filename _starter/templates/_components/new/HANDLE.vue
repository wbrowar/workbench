<template>
    <div class="c_<%- handle %>">
        <p>{{ greeting }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                greeting: false,
            }
        },
        props: {
            newGreeting: { default: 'Hello' },
        },
        mounted() {
            if (this.newGreeting) {
                this.greeting = this.newGreeting;
            }
        }
    }
</script>

<style lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    .c_<%- handle %> {
        $self: &;

        font-size: 2rem;
        color: #bdc7ff;
    }
</style>