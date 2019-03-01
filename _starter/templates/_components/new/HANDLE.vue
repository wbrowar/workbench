<template>
    <div class="c_<%- handle %>">

    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
        },
        methods: {
        },
        created() {
        },
        mounted() {
        }
    }
</script>

<style lang="scss">
    // include variables and mixins if needed
    <%- ('< %-').replace(' ', '') + ' include(paths.css.src + \'automated/_colors.scss\') ' + ('% >').replace(' ', '') %>
    <%- ('< %-').replace(' ', '') + ' include(paths.css.src + \'_mixins.scss\') ' + ('% >').replace(' ', '') %>

    .c_<%- handle %> {
        $self: &;

    }
</style>