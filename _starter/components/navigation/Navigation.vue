<template>
    <nav class="c_navigation" :class="currentNav ? 'c_navigation--' + currentNav.replace(/-/g, '_') : false" v-click-outside="childNavNavClose.bind(null, {preventMenuButtonFocus: true})">
        <slot name="navigation" v-if="!navArray.length || (!mobileNav && !desktopNav)">
        </slot>
        <nav-button v-if="navArray.length && navIconMenu && navIconMenu == currentNav"></nav-button>
        <component v-if="navArray.length && mobileNav && (currentNav == mobileNav)"
                   :class="(currentNav == mobileNav) && navOpened ? 'c_navigation__menu--open' : false"
                   :nav-array="navArray"
                   :is="mobileNav"
                   :current-item-id="currentItemId"
                   :current-child-item-id="currentChildItemId"
                   :set-focus-to-item-id="setFocusToItemId"
                   :hidden="showNavIcon && !navOpened">
        </component>
        <component v-if="navArray.length && desktopNav && (currentNav == desktopNav)"
                   :class="(currentNav == desktopNav) && navOpened ? 'c_navigation__menu--open' : false"
                   :nav-array="navArray"
                   :is="desktopNav"
                   :current-item-id="currentItemId"
                   :current-child-item-id="currentChildItemId"
                   :set-focus-to-item-id="setFocusToItemId"
                   :hidden="showNavIcon && !navOpened">
        </component>
    </nav>
</template>

<script>
    import NavButton from './NavButton.vue';
    import NavDropdown from './NavDropdown.vue';
    import NavSlideOut from './NavSlideOut.vue';
    import NavStackedDropdown from './NavStackedDropdown.vue';
    import NavOverlay from './NavOverlay.vue';
    import {snake} from '../global.js';

    export default {
        components: {
            NavButton,
            NavDropdown,
            NavStackedDropdown,
            NavSlideOut,
            NavOverlay
        },
        data() {
            return {
                navArray: [],
                wndwWidth: false,
                wndwHeight: false,
                currentNav: false,
                showNavIcon: false,
                currentItemId: false,
                currentChildItemId: false,
                setFocusToItemId: false,
                navOpened: false,
            }
        },
        props: {
            mobileNav: false,
            desktopNav: false,
            breakpoint: false,
            navIconMenu: false,
            openedItemId: false,
            openedChildItemId: false,
            isNavOpen: false
        },
        directives:{
            clickOutside: {
                // Directive to listen for clicks outside of the the navigation(s)
                bind: function(el, binding, vNode) {

                    // Provided expression must evaluate to a function.
                    if (typeof binding.value !== 'function') {
                        const compName = vNode.context.name;
                        let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                        if (compName) { warn += `Found in component '${compName}'` }


                    }
                    // Define Handler and cache it on the element
                    //console.log(binding);
                    const bubble = binding.modifiers.bubble;
                    const handler = (e) => {
                        if (bubble || (!el.contains(e.target) && el !== e.target)) {

                            binding.value(e);
                        }
                    };
                    el.__vueClickOutside__ = handler;

                    // add Event Listeners
                    document.addEventListener('click', handler);
                },

                unbind: function(el) {
                    // Remove Event Listeners
                    document.removeEventListener('click', el.__vueClickOutside__);
                    el.__vueClickOutside__ = null;
                }
            },
        },
        methods: {
            navigationToArray(navigation){
                navigation.childNodes.forEach((menuItem) => {
                    if(menuItem.nodeName != '#text'){
                        let menuItemObject = {};
                        let firstLvlArray = [];
                        if (menuItem.children[0].tagName.toLowerCase() == 'a' || menuItem.children[0].tagName.toLowerCase() == 'p') {
                            let firstLvlMenuItemSelected = menuItem.children[0];
                            menuItemObject = {
                                label: firstLvlMenuItemSelected.innerText,
                                target: firstLvlMenuItemSelected.target || false,
                                href: firstLvlMenuItemSelected.href || false,
                                classes: firstLvlMenuItemSelected.className || false,
                                itemId: firstLvlMenuItemSelected.getAttribute('data-item-id') ? snake(firstLvlMenuItemSelected.getAttribute('data-item-id')) : snake(firstLvlMenuItemSelected.innerText),
                                setFocus: false,
                            }
                        }
                        if(menuItem.querySelectorAll('ul').length){
                            let secondLvlArray = [];
                            menuItem.querySelectorAll('ul')[0].childNodes.forEach((secondLvlMenuItem) => {
                                let secondLvlMenuItemObject = {};
                                if(secondLvlMenuItem.nodeName != '#text') {
                                    if (secondLvlMenuItem.children[0].tagName.toLowerCase() == 'a' || secondLvlMenuItem.children[0].tagName.toLowerCase() == 'p') {
                                        let secondLvlMenuItemSelected = secondLvlMenuItem.children[0];

                                        secondLvlMenuItemObject = {
                                            label: secondLvlMenuItemSelected.innerText,
                                            target: secondLvlMenuItemSelected.target || false,
                                            href: secondLvlMenuItemSelected.href || false,
                                            classes: secondLvlMenuItemSelected.className || false,
                                            itemId: secondLvlMenuItemSelected.getAttribute('data-item-id') ? menuItemObject.itemId + '/' + snake(secondLvlMenuItemSelected.getAttribute('data-item-id')) : snake(secondLvlMenuItemSelected.innerText),
                                            setFocus: false,
                                        }
                                    }
                                    if (secondLvlMenuItem.querySelectorAll('ul').length) {
                                        let thirdLvlArray = [];
                                        secondLvlMenuItem.querySelectorAll('ul')[0].childNodes.forEach((thirdLvlMenuItem) => {
                                            let thirdLvlMenuItemObject = {};
                                            if(thirdLvlMenuItem.nodeName != '#text') {
                                                if (thirdLvlMenuItem.children[0].tagName.toLowerCase() == 'a' || thirdLvlMenuItem.children[0].tagName.toLowerCase() == 'p') {
                                                    let thirdLvlMenuItemSelected = thirdLvlMenuItem.children[0];

                                                    thirdLvlMenuItemObject = {
                                                        label: thirdLvlMenuItemSelected.innerText,
                                                        target: thirdLvlMenuItemSelected.target || false,
                                                        href: thirdLvlMenuItemSelected.href || false,
                                                        classes: thirdLvlMenuItemSelected.className || false,
                                                        itemId: thirdLvlMenuItemSelected.getAttribute('data-item-id') ? secondLvlMenuItemObject.itemId + '/' + snake(thirdLvlMenuItemSelected.getAttribute('data-item-id')) : snake(thirdLvlMenuItemSelected.innerText),
                                                        setFocus: false,
                                                    }
                                                }
                                                if(thirdLvlMenuItemObject['href'] || thirdLvlMenuItemObject ['children']) {
                                                    thirdLvlArray.push(thirdLvlMenuItemObject);
                                                }
                                            }
                                        });
                                        secondLvlMenuItemObject['children'] = thirdLvlArray;
                                    }
                                    if(secondLvlMenuItemObject['href'] || secondLvlMenuItemObject['children']) {
                                        secondLvlArray.push(secondLvlMenuItemObject);
                                    }
                                }
                            });
                            menuItemObject['children'] = secondLvlArray;
                        }
                        if(menuItemObject['href'] || menuItemObject['children']) {
                            this.navArray.push(menuItemObject);
                        }
                    }
                });
            },
            toggleSubNav(options){

                //console.log("Toggle Sub Nav Fired");
                if(options.itemId && options.childItemId){
                    if(this.currentChildItemId === options.childItemId){
                        this.currentChildItemId = false;
                    } else{
                        this.currentChildItemId = options.childItemId;
                    }
                } else if(options.itemId){
                    if(this.currentItemId === options.itemId){
                        this.currentItemId = false;
                    } else{
                        this.currentItemId = options.itemId;
                    }
                }

                //console.dir(options);

                if(options.event && options.setFocusToFirstChild){
                    VueEvent.$emit('set-focus-to-item-id', {itemId: options.itemId, childItemId: options.childItemId})
                }

                this.setViewportClasses();
            },
            openSubNav(options){
                if(options.itemId && options.childItemId){
                    if(this.currentChildItemId !== options.childItemId){
                        this.currentChildItemId = options.childItemId;
                    }
                } else if(options.itemId){
                    if(this.currentItemId !== options.itemId){
                        this.currentItemId = options.itemId
                    }
                }

                this.setViewportClasses();
            },
            closeSubNav(options){
                if(options.itemId && options.childItemId){
                    if(this.currentChildItemId === options.childItemId){
                        this.currentChildItemId = false;
                    }
                } else if(options.itemId){
                    this.currentItemId = false;
                } else{
                    this.currentItemId = false;
                    this.currentChildItemId = false;
                }

                if(options.event){
                    if(options.event.keyCode == 27/*Esc Key*/ || options.setFocusToParentItem){
                        if(options.itemId && options.childItemId){
                            this.setFocusToItemId = options.childItemId;
                        } else if(options.itemId){
                            this.setFocusToItemId = options.itemId;
                        }
                    }
                }
            },
            navigateDirectionForward(options){
                if(options.nextItemId) {
                    //console.log(options.nextItemId);
                    this.setFocusToItemId = options.nextItemId;
                }

            },
            navigateDirectionBackward(options){
                if(options.prevItemId) {
                    //console.log(options.prevItemId);
                    this.setFocusToItemId = options.prevItemId;
                }
            },
            navToggle(){
                if(this.navOpened) {
                    this.navOpened = false;
                    VueEvent.$emit('nav-state-changed', false);
                } else {
                    this.navOpened = true;
                    VueEvent.$emit('nav-state-changed', true);
                }
            },
            navOpen(){
                this.navOpened = false;
                VueEvent.$emit('nav-state-changed', true);
            },
            navClose(options){

                let navCloseOptions = {
                    // Prevent focus of the menu button - for example when you resize the page and the menu closes we do not want the focus to move to the menu button because the user may be at a different point on the page.
                    preventMenuButtonFocus: options && options.preventMenuButtonFocus || false
                }
                this.navOpened = false;
                VueEvent.$emit('nav-state-changed', false);
                if(document.getElementById('menu_button') && !navCloseOptions.preventMenuButtonFocus){
                    document.getElementById('menu_button').focus();
                }

            },
            isOutOfViewport(element){
                /*!
                 * Check if an element is out of the viewport
                 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
                 * @param  {Node}  elem The element to check
                 * @return {Object}     A set of booleans for each side of the element
                 */
                var bounding = element.getBoundingClientRect();

                // Check if it's out of the viewport on each side
                var out = {};
                out.top = bounding.top < 0;
                out.left = bounding.left < 0;
                out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
                out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
                out.any = out.top || out.left || out.bottom || out.right;
                out.all = out.top && out.left && out.bottom && out.right;

                return out;
            },
            setViewportClasses(){
                this.$nextTick(function(){
                    let openSubMenus = document.querySelectorAll('.c_navigation__menu button[aria-expanded="true"]');

                    for(let i = 0;i < openSubMenus.length;i++){
                        openSubMenus[i].classList.remove('c_navigation__menu__menu_item--out-of-viewport-top','c_navigation__menu__menu_item--out-of-viewport-bottom','c_navigation__menu__menu_item--out-of-viewport-left','c_navigation__menu__menu_item--out-of-viewport-right');
                        if(openSubMenus[i].nextElementSibling){
                            let outOfViewport = this.isOutOfViewport(openSubMenus[i].nextElementSibling);
                            if(outOfViewport.top){
                                openSubMenus[i].classList.add('c_navigation__menu__menu_item--out-of-viewport-top');
                            }
                            if(outOfViewport.bottom){
                                openSubMenus[i].classList.add('c_navigation__menu__menu_item--out-of-viewport-bottom');
                            }
                            if(outOfViewport.left){
                                openSubMenus[i].classList.add('c_navigation__menu__menu_item--out-of-viewport-left');
                            }
                            if(outOfViewport.right){
                                openSubMenus[i].classList.add('c_navigation__menu__menu_item--out-of-viewport-right');
                            }
                        }
                    }
                });
            },
            setNavItemFocus(options){
                if(options && options.itemId){
                    //console.log(options.itemId);
                    this.setFocusToItemId = options.itemId;
                }
                //console.log("Set Nav Item Focus Fired");
                //console.log(document.querySelector('[set-focus="true"]'));
                this.$nextTick(() => {
                    document.querySelector('[set-focus]').focus();
                    this.setFocusToItemId = false;
                });
            },
            removeNavItemFocusId(){
                //console.log("Remove Focus Set");
                document.activeElement.blur();
            },

            // All "childNav" methods are meant to only be referenced by a child component.
            childNavToggleSubNav(options){
                let navOptions = {
                    itemId: options.itemId || false,
                    childItemId: options.childItemId || false,
                    event: options.event || false,
                }

                VueEvent.$emit('toggle-sub-nav', navOptions);
            },
            childNavOpenSubNav(options){
                let navOptions = {
                    itemId: options.itemId || false,
                    childItemId: options.childItemId || false,
                    event: options.event || false,
                }

                VueEvent.$emit('open-sub-nav', navOptions);
            },
            childNavCloseSubNav(options){
                let navOptions = {
                    itemId: options.itemId ||  false,
                    childItemId: options.childItemId || false,
                    event: options.event || false,
                    setFocusToParentItem: options.setFocusToParentItem || false,
                }

                VueEvent.$emit('close-sub-nav', navOptions);
            },
            childNavSetNavItemFocus(options){
                VueEvent.$emit('set-focus-to-item-id', options);
            },
            childNavNavigateDirectionForward(options){
                let navOptions = {
                    nextItemId: options.nextItemId || false
                }

                VueEvent.$emit('navigate-direction-forward', navOptions);
            },
            childNavNavigateDirectionBackward(options){
                let navOptions = {
                    prevItemId: options.prevItemId || false
                }

                VueEvent.$emit('navigate-direction-backward', navOptions);
            },
            childNavNavOpen(){
                this.navOpen();
            },
            childNavNavClose(options){
                let childNavNavCloseOptions = {
                    preventMenuButtonFocus: options && options.preventMenuButtonFocus || false,
                }

                VueEvent.$emit('close-sub-nav',{itemId: false, childItemId: false});
                this.navClose(childNavNavCloseOptions);
            },
            childNavRemoveNavItemFocusId(){
                VueEvent.$emit('remove-nav-item-focus-id');
            }
        },
        created() {
            VueEvent.$on('window-resized', (windowWidth, windowHeight) => {
                //console.log("Window resized fired");
                this.wndwWidth = windowWidth;
                this.wndwHeight = windowHeight;

                //Switch navs based on breakpoint
                if(this.breakpoint < this.wndwWidth){
                    this.currentNav = this.desktopNav;
                }
                else{
                    this.currentNav = this.mobileNav;
                }

                if((this.navIconMenu == this.currentNav) || (this.navIconMenu == this.currentNav)){
                    this.showNavIcon = true;
                } else{
                    this.showNavIcon = false;
                }

            });

            VueEvent.$on('nav-button-clicked', () => {
                this.navToggle();
            });

            VueEvent.$on('toggle-sub-nav', (options) => {
                this.toggleSubNav(options);
            });

            VueEvent.$on('open-sub-nav', (options) => {
                this.openSubNav(options);
            });

            VueEvent.$on('close-sub-nav', (options) => {
                this.closeSubNav(options);
            });

            VueEvent.$on('set-focus-to-item-id', (options) => {
                this.setNavItemFocus(options);
            });

            VueEvent.$on('remove-nav-item-focus-id', () => {
                this.removeNavItemFocusId();
            });

            VueEvent.$on('navigate-direction-forward', (options) => {
                this.navigateDirectionForward(options);
            });

            VueEvent.$on('navigate-direction-backward', (options) => {
                this.navigateDirectionBackward(options);
            });

        },
        mounted() {
            this.navigationToArray(this.$slots.navigation[0].elm);

            this.currentItemId = this.openedItemId;
            this.currentChildItemId = this.openedChildItemId;
            this.navOpened = this.isNavOpen;

            console.log("Nav Open is: " + this.navOpened);
            console.log("Nav icon: " + this.showNavIcon);



            //console.log(this.navArray.length);
        }
    }
</script>

<style lang="scss">
    // include variables and mixins if needed
    <%- include(paths.css.src + 'automated/_colors.scss') %>
    <%- include(paths.css.src + '_mixins.scss') %>

    .c_navigation {
        $self: &;

        & {
             background: gray;
        }

        button{
            @include button_reset;
        }
        button.c_navigation__menu_toggle{
            margin:0 auto;
        }

        ul{
            padding:0;
        }

         @at-root #{$self}__menu{
             list-style-type:none;
             margin-top:0;
             &[hidden], [hidden]{
                 display:none;
             }
             a, button{
                box-sizing: border-box;
                 &:hover, &:focus{
                     outline:1px dashed blue; //Firefox is not setting an outline on button elements so I'm explicitly setting it by default
                 }
                 &:hover, &:focus, &[aria-expanded="true"]{
                     //Set z-index to be higher to fix outline from falling behind other elements.
                     position:relative;
                     z-index:5;
                 }
             }
            [aria-expanded="true"] + ul{
                display:block;
                position:relative;
                z-index:5;
            }
             ul{
                 list-style-type:none;
             }
        }


    }
</style>