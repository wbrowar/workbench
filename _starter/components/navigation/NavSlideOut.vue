<template>
    <ul class="c_navigation__menu c_navigation__menu__level_1" :class="'c_navigation__menu--' + openDirection">
        <li v-for="(firstLvlItem, firstLvlIndex) in navArray">
            <component :is="firstLvlItem.href && !firstLvlItem.children ? 'a' : 'button'"
                       @click="$parent.childNavToggleSubNav({itemId: firstLvlItem.itemId, event: $event}); focusToId('back_to_' + firstLvlItem.itemId);"
                       @keydown.up="navKeyboardPressed({firstLvlItem: firstLvlItem, loopIndex: firstLvlIndex, loopArray: navArray, openDirection: openDirection, event: $event})"
                       @keydown.down="navKeyboardPressed({firstLvlItem: firstLvlItem, loopIndex: firstLvlIndex, loopArray: navArray, openDirection: openDirection, event: $event})"
                       @keydown.left="navKeyboardPressed({firstLvlItem: firstLvlItem, loopIndex: firstLvlIndex, loopArray: navArray, openDirection: openDirection, event: $event})"
                       @keydown.right="navKeyboardPressed({firstLvlItem: firstLvlItem, loopIndex: firstLvlIndex, loopArray: navArray, openDirection: openDirection, event: $event})"
                       @keydown.esc="$parent.childNavNavClose()"
                       @mouseover="$parent.childNavRemoveNavItemFocusId"
                       :href="firstLvlItem.href && !firstLvlItem.children ? firstLvlItem.href : false"
                       class="c_navigation__menu__menu_item"
                       :class="firstLvlItem.classes"
                       :hidden="hidden"
                       :aria-live="firstLvlItem.children ? 'aggresive' : false"
                       :aria-expanded="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? 'true' : 'false') : false"
                       :target="firstLvlItem.target"
                       :set-focus="firstLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false">
                <span v-if="firstLvlItem.children && openDirection == 'left'" aria-hidden="true">&#x276E;</span>
                {{ firstLvlItem.label }}
                <span v-if="firstLvlItem.children && openDirection == 'right'" aria-hidden="true">&#x276F;</span>
            </component>
            <ul :hidden="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? false : true) : true" v-if="firstLvlItem.children" v-show="firstLvlItem.children" class="c_navigation__menu__level_2" :class="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? 'c_navigation__menu__level_2--open' : false) : 'c_navigation__menu__level_2--open'">
                <li><button
                        :id="'back_to_' + firstLvlItem.itemId"
                        @click="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, event: $event, loopArray: firstLvlItem.children, setFocusToParentItem: true})"
                        @keydown.up="navKeyboardPressed({firstLvlItem: firstLvlItem, isBackButton: true, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                        @keydown.down="navKeyboardPressed({firstLvlItem: firstLvlItem, isBackButton: true, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                        @keydown.left="navKeyboardPressed({firstLvlItem: firstLvlItem, isBackButton: true, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                        @keydown.right="navKeyboardPressed({firstLvlItem: firstLvlItem, isBackButton: true, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                        @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, event: $event})"
                        @mouseover="$parent.childNavRemoveNavItemFocusId">
                        <span v-if="openDirection == 'right'" aria-hidden="true">&#x276E;</span>
                        Back
                        <span v-if="openDirection == 'left'" aria-hidden="true">&#x276F;</span>
                    </button>
                </li>
                <li v-for="(secondLvlItem, secondLvlIndex) in firstLvlItem.children">
                    <component :is="secondLvlItem.href && !secondLvlItem.children ? 'a' : 'button'"
                               @click="$parent.childNavToggleSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId}); focusToId('back_to_' + secondLvlItem.itemId);"
                               @keydown.up="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, loopIndex: secondLvlIndex, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                               @keydown.down="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, loopIndex: secondLvlIndex, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                               @keydown.left="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, loopIndex: secondLvlIndex, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                               @keydown.right="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, loopIndex: secondLvlIndex, loopArray: firstLvlItem.children, openDirection: openDirection, event: $event})"
                               @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, event: $event})"
                               :href="secondLvlItem.href && !secondLvlItem.children ? secondLvlItem.href : false"
                               class="c_navigation__menu__menu_item"
                               :class="secondLvlItem.classes"
                               :aria-live="secondLvlItem.children ? 'aggresive' : false"
                               :aria-expanded="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? 'true' : 'false') : false"
                               :target="secondLvlItem.target"
                               :set-focus="secondLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false"
                               @mouseover="$parent.childNavRemoveNavItemFocusId">
                        <span v-if="secondLvlItem.children && openDirection == 'left'" aria-hidden="true">&#x276E;</span>
                        {{ secondLvlItem.label }}
                        <span v-if="secondLvlItem.children && openDirection == 'right'" aria-hidden="true">&#x276F;</span>
                    </component>
                    <ul :hidden="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? false : true) : true" v-if="secondLvlItem.children" v-show="secondLvlItem.children" class="c_navigation__menu__level_3" :class="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? 'c_navigation__menu__level_3--open' : false) : 'c_navigation__menu__level_3--open'">
                        <li><button
                                :id="'back_to_' + secondLvlItem.itemId"
                                @click="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event, loopArray: secondLvlItem.children, setFocusToParentItem: true})"
                                @keydown.up="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, isBackButton: true, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                @keydown.down="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, isBackButton: true, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                @keydown.left="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, isBackButton: true, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                @keydown.right="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, isBackButton: true, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})"
                                @mouseover="$parent.childNavRemoveNavItemFocusId">
                                <span v-if="openDirection == 'right'" aria-hidden="true">&#x276E;</span>
                                Back
                                <span v-if="openDirection == 'left'" aria-hidden="true">&#x276F;</span>
                            </button>
                        </li>
                        <li v-for="(thirdLvlItem, thirdLvlIndex) in secondLvlItem.children">
                            <component :is="thirdLvlItem.href && !thirdLvlItem.children ? 'a' : 'button'"
                                       :href="thirdLvlItem.href && !thirdLvlItem.children ? thirdLvlItem.href : false"
                                       @keydown.up="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, thirdLvlItem: thirdLvlItem, loopIndex: thirdLvlIndex, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                       @keydown.down="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, thirdLvlItem: thirdLvlItem, loopIndex: thirdLvlIndex, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                       @keydown.right="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, thirdLvlItem: thirdLvlItem, loopIndex: thirdLvlIndex, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                       @keydown.left="navKeyboardPressed({firstLvlItem: firstLvlItem, secondLvlItem: secondLvlItem, thirdLvlItem: thirdLvlItem, loopIndex: thirdLvlIndex, loopArray: secondLvlItem.children, openDirection: openDirection, event: $event})"
                                       @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})"
                                       @mouseover="$parent.childNavRemoveNavItemFocusId"
                                       class="c_navigation__menu__menu_item"
                                       :class="thirdLvlItem.classes"
                                       :set-focus="thirdLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false">
                                {{ thirdLvlItem.label }}
                            </component>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                openDirection: 'right'
            }
        },
        props: {
            navArray: false,
            currentItemId: '',
            currentChildItemId: '',
            setFocusToItemId: false,
            hidden: false,
        },
        methods: {
            leftRightNavigateDirectionForward(navOptions){
                if(navOptions.isBackButton){
                    this.$parent.childNavNavigateDirectionForward({nextItemId: navOptions.loopArray ? navOptions.loopArray[0].itemId : false });
                } else {
                    if(document.getElementById('back_to_' + navOptions.secondLvlItem.itemId) && this.currentChildItemId && !navOptions.loopArray[navOptions.loopIndex + 1]){
                        this.focusToId('back_to_' + navOptions.secondLvlItem.itemId);
                    } else if(document.getElementById('back_to_' + navOptions.firstLvlItem.itemId) && this.currentItemId && !navOptions.loopArray[navOptions.loopIndex + 1]){
                        this.focusToId('back_to_' + navOptions.firstLvlItem.itemId);
                    } else{
                        this.$parent.childNavNavigateDirectionForward({nextItemId: navOptions.loopArray[navOptions.loopIndex + 1] ? navOptions.loopArray[navOptions.loopIndex + 1].itemId : navOptions.loopArray[0].itemId});
                    }
                }
            },
            leftRightNavigateDirectionBackward(navOptions){
                if(navOptions.isBackButton){
                    this.$parent.childNavNavigateDirectionBackward({prevItemId: navOptions.loopArray ? navOptions.loopArray[navOptions.loopArray.length - 1].itemId : false});
                } else {
                    if(document.getElementById('back_to_' + navOptions.secondLvlItem.itemId) && this.currentChildItemId && !navOptions.loopArray[navOptions.loopIndex - 1]){
                        this.focusToId('back_to_' + navOptions.secondLvlItem.itemId);
                    } else if(document.getElementById('back_to_' + navOptions.firstLvlItem.itemId) && this.currentItemId && !navOptions.loopArray[navOptions.loopIndex - 1]){
                        this.focusToId('back_to_' + navOptions.firstLvlItem.itemId);
                    } else {
                        this.$parent.childNavNavigateDirectionBackward({prevItemId: navOptions.loopArray[navOptions.loopIndex - 1] ? navOptions.loopArray[navOptions.loopIndex - 1].itemId : navOptions.loopArray[navOptions.loopArray.length - 1].itemId});
                    }
                }
            },
            leftRightOpenSubNav(navOptions){
                //This function also will navigate forward in some instances.
                if(navOptions.firstLvlItem && navOptions.secondLvlItem && !navOptions.thirdLvlItem){
                    this.$parent.childNavOpenSubNav({itemId: navOptions.firstLvlItem.itemId, childItemId: navOptions.secondLvlItem.itemId, event: navOptions.event});
                    if(document.getElementById('back_to_' + navOptions.secondLvlItem.itemId)){
                        this.$nextTick(() => {
                            this.focusToId('back_to_' + navOptions.secondLvlItem.itemId);
                        });
                    } else {
                        this.$parent.childNavNavigateDirectionForward({nextItemId: navOptions.secondLvlItem.children ? navOptions.secondLvlItem.children[0].itemId : false});
                    }

                } else if(navOptions.firstLvlItem && !navOptions.thirdLvlItem){
                    this.$parent.childNavOpenSubNav({itemId: navOptions.firstLvlItem.itemId, event: navOptions.event});
                    if(document.getElementById('back_to_' + navOptions.firstLvlItem.itemId) && !navOptions.secondLvlItem){
                        this.focusToId('back_to_' + navOptions.firstLvlItem.itemId);
                    } else{
                        this.$parent.childNavNavigateDirectionForward({nextItemId: navOptions.firstLvlItem.children ? navOptions.firstLvlItem.children[0].itemId : false});
                    }
                }
            },
            leftRightCloseSubNav(navOptions){
                if((navOptions.firstLvlItem && navOptions.secondLvlItem && navOptions.thirdLvlItem) || (navOptions.isBackButton && navOptions.firstLvlItem && navOptions.secondLvlItem)){
                    this.$parent.childNavCloseSubNav({itemId: navOptions.firstLvlItem.itemId, childItemId: navOptions.secondLvlItem.itemId, event: navOptions.event});
                    this.$parent.childNavSetNavItemFocus({itemId: navOptions.secondLvlItem.itemId});
                } else if((navOptions.firstLvlItem && navOptions.secondLvlItem && !navOptions.thirdLvlItem) || (navOptions.isBackButton && navOptions.firstLvlItem && !navOptions.secondLvlItem)){
                    this.$parent.childNavCloseSubNav({itemId: navOptions.firstLvlItem.itemId, event: navOptions.event});
                    this.$parent.childNavSetNavItemFocus({itemId: navOptions.firstLvlItem.itemId});
                } else if(navOptions.firstLvlItem && !navOptions.thirdLvlItem){
                    this.$parent.childNavCloseSubNav({itemId: navOptions.firstLvlItem.itemId, event: navOptions.event});
                    this.$parent.childNavNavClose();
                }
            },
            navKeyboardPressed(options){
                console.dir(options.loopArray);
                let navOptions = {
                    firstLvlItem: options.firstLvlItem || false,
                    secondLvlItem: options.secondLvlItem || false,
                    thirdLvlItem: options.thirdLvlItem || false,
                    loopIndex: options.loopIndex || false,
                    loopArray: options.loopArray || false,
                    isBackButton: options.isBackButton || false,
                    openDirection: options.openDirection || false,
                    event: options.event || false
                }

                //Slide Down from Top
                if(navOptions.openDirection == 'top'){

                }

                //Slide Up from Bottom
                if(navOptions.openDirection == 'bottom'){

                }

                //Slide Out from Left
                if(navOptions.openDirection == 'left'){
                    if(navOptions.event.keyCode == 38){ // Up Arrow
                        this.leftRightNavigateDirectionBackward(navOptions);
                    }

                    if(navOptions.event.keyCode == 40){ //Down Arrow
                        this.leftRightNavigateDirectionForward(navOptions);
                    }

                    if(navOptions.event.keyCode == 37){  // Left Arrow
                        this.leftRightOpenSubNav(navOptions);
                    }

                    if(navOptions.event.keyCode == 39){ // Right Arrow
                        this.leftRightCloseSubNav(navOptions);
                    }
                }

                //Slide Out from Right
                if(navOptions.openDirection == 'right'){
                    if(navOptions.event.keyCode == 38){ // Up Arrow
                        this.leftRightNavigateDirectionBackward(navOptions);
                    }

                    if(navOptions.event.keyCode == 40){ //Down Arrow
                        this.leftRightNavigateDirectionForward(navOptions);
                    }

                    if(navOptions.event.keyCode == 37){  // Left Arrow
                        this.leftRightCloseSubNav(navOptions);
                    }

                    if(navOptions.event.keyCode == 39){ // Right Arrow
                        this.leftRightOpenSubNav(navOptions);
                    }

                }
            },
            focusToId(id, event){
                this.$nextTick(() => {
                    document.getElementById(id).focus();
                });
            }
        },
        created() {
            VueEvent.$on('nav-button-keyboard-pressed', (event) => {
                if(this.openDirection == 'left' && !this.hidden){
                    if(event.keyCode == 39){ // Right Arrow
                        this.$parent.childNavSetNavItemFocus({itemId: this.navArray[0].itemId});
                    }
                }
                if(this.openDirection == 'right' && !this.hidden){
                    if(event.keyCode == 37){ // Left Arrow
                        this.$parent.childNavSetNavItemFocus({itemId: this.navArray[0].itemId});
                    }
                }
            });
        },
        mounted() {
            this.$parent.childNavNavClose({preventMenuButtonFocus: true}); // Close menu when rendered.
        }
    }
</script>

<style lang="scss">
    // include variables and mixins if needed
    <%- include(paths.css.src + 'automated/_colors.scss') %>
    <%- include(paths.css.src + '_mixins.scss') %>

     .c_navigation {
         $self: &;
         position:relative;
         height:4rem;
         & {
             background: gray;
         }
         &--nav_slide_out {
             & .c_navigation__menu {
                 height:100vh;
                 position:fixed;
                 top:0;
                 transition: transform .5s ease;
                 a, button{
                     visibility: visible;
                     transition:transform .5s ease;
                     &[hidden]{
                         transition: visibility 0s ease-out .5s;
                         visibility:hidden;
                     }
                 }
                 &[hidden], [hidden]{
                     display:block;
                     transition:transform .5s ease;
                     a, button{
                         visibility:hidden;
                         transition: visibility 0s ease-out .5s;
                     }
                 }
                 & > li {
                     a, button {
                         padding: 10px;
                         display: inline-block;
                         text-decoration: none;
                         width: 100%;
                     }
                     button {
                         display: flex;
                         flex-flow: row nowrap;
                         align-items: center;
                         span {
                             font-size: 50%;
                             padding: 0 5px;
                         }
                     }
                     ul{
                         position:fixed;
                         right:0;
                         top:0;
                         width:100%;
                         height:100%;
                         transform:translateX(100%);
                         transition: transform .5s ease;
                         background:#333333;
                         a, button{
                             color:#FFFFFF;
                         }
                         ul{
                             background:#EEEEEE;
                             a, button{
                                 color:#333333;
                             }
                         }
                     }
                     [aria-expanded="true"] + ul{
                         transform:translateX(0);
                     }
                 }
                 &--right{
                     text-align:left;
                     left:0;
                     transform: translateX(-100%);
                     .c_navigation__menu__level_2, .c_navigation__menu__level_3{
                         transform: translateX(-100%);
                         [aria-expanded="true"] + &{
                             transform: translateX(0);
                         }
                     }
                 }
                 &--left{
                     text-align:right;
                     right:0;
                     transform: translateX(100%);
                     .c_navigation__menu__level_2, .c_navigation__menu__level_3{
                         transform: translateX(100%);
                         [aria-expanded="true"] + &{
                             transform: translateX(0);
                         }
                     }
                 }
                 &--open{
                     transform: translateX(0);
                 }
             }

         }

     }
</style>