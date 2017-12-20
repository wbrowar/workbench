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

<style scoped lang="scss">
    @import "./../../_scss/base/mixins.scss";

    p {
        color: red;
    }
</style>