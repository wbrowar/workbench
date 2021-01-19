<template>
    <button class="c-navigation__menu_toggle"
            :class="isNavOpened ? 'c-navigation__menu_toggle--open' : false"
            id="menu_button"
            @click="navButtonClicked()"
            @keydown.down="navButtonKeyboardPressed($event)"
            @keydown.up="navButtonKeyboardPressed($event)"
            @keydown.left="navButtonKeyboardPressed($event)"
            @keydown.right="navButtonKeyboardPressed($event)"
            :aria-expanded="isNavOpened ? 'true' : 'false'">
        <div class="c-navigation__menu_toggle__icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span class="c-navigation__menu_toggle__label">Menu</span>
    </button>
</template>

<script>
    export default {
        data() {
            return {
                isNavOpened: false,
            }
        },
        props: {
           isNavOpen: false,
        },
        methods: {
            navButtonKeyboardPressed(event){
                VueEvent.$emit('nav-button-keyboard-pressed', event);
            },
            navButtonClicked(){
                VueEvent.$emit('nav-button-clicked');
            }
        },
        created() {

        },
        mounted(){
            this.isNavOpened = this.isNavOpen;

            VueEvent.$on('nav-state-changed', (isNavOpen) => {
                this.isNavOpened = isNavOpen;
            });

        }
    }
</script>

<style>
    .c-navigation {
        &__menu_toggle {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            position: relative;
            z-index: 15;
            &:focus{
                outline:1px dashed blue; //Firefox is not setting an outline on button elements so I'm explicitly setting it by default
            }
            &__label {
                padding-left: 5px;
            }

            &__icon {
                width: 30px;
                height: 25px;
                position: relative;
                margin: 10px auto;
                transform: rotate(0deg);
                transition: .5s ease-in-out;
                cursor: pointer;
                display: inline-block;
                span {
                    display: block;
                    position: absolute;
                    height: 5px;
                    width: 100%;
                    background: #000000;
                    border-radius: 6px;
                    opacity: 1;
                    left: 0;
                    transform: rotate(0deg);
                    transition: .25s ease-in-out;
                    &:nth-child(1) {
                        top: 0;
                    }

                    &:nth-child(2), &:nth-child(3) {
                        top: 10px;
                    }

                    &:nth-child(4) {
                        top: 20px;
                    }

                    [aria-expanded="true"] &:nth-child(1) {
                        top: 18px;
                        width: 0;
                        left: 50%;
                    }

                    [aria-expanded="true"] &:nth-child(2) {
                        -webkit-transform: rotate(45deg);
                        -moz-transform: rotate(45deg);
                        -o-transform: rotate(45deg);
                        transform: rotate(45deg);
                    }

                    [aria-expanded="true"] &:nth-child(3) {
                        -webkit-transform: rotate(-45deg);
                        -moz-transform: rotate(-45deg);
                        -o-transform: rotate(-45deg);
                        transform: rotate(-45deg);
                    }

                    [aria-expanded="true"] &:nth-child(4) {
                        top: 18px;
                        width: 0;
                        left: 50%;
                    }
                }
            }
        }
    }
</style>