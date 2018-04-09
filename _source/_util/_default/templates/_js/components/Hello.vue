<template>
    <div>
        <p>{{ greeting }}, World.</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                greeting: 'Hello'
            }
        },
        props: {
            newGreeting: false
        },
        mounted() {
            this.greeting = this.newGreeting;
        }
    }
</script>

<style lang="scss">
    @import "./../../_scss/base/_mixins.scss";

    p {
        color: red;
    }
</style>