<template>
    <ul class="c_navigation__menu c_navigation__menu--nav_stacked_dropdown">
        <li v-for="(firstLvlItem, firstLvlIndex) in navArray">
            <component :is="firstLvlItem.href && !firstLvlItem.children ? 'a' : 'button'"
                       @click="$parent.childNavToggleSubNav({itemId: firstLvlItem.itemId, event: $event})"
                       @keydown.down="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? $parent.childNavNavigateDirectionForward({nextItemId: firstLvlItem.children[0] ? firstLvlItem.children[0].itemId : false}) : $parent.childNavOpenSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event})) : $parent.childNavNavigateDirectionForward({nextItemId: navArray[firstLvlIndex + 1] ? navArray[firstLvlIndex + 1].itemId : navArray[0].itemId});"
                       @keydown.up="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? $parent.childNavCloseSubNav(firstLvlItem.itemId, false, $event) : $parent.childNavNavigateDirectionBackward({prevItemId: navArray[firstLvlIndex - 1] ? navArray[firstLvlIndex - 1].itemId : navArray[navArray.length - 1].itemId})) : $parent.childNavNavigateDirectionBackward({prevItemId: navArray[firstLvlIndex - 1] ? navArray[firstLvlIndex - 1].itemId : navArray[navArray.length - 1].itemId});"
                       @keydown.esc="$parent.childNavNavClose()"
                       :href="firstLvlItem.href && !firstLvlItem.children ? firstLvlItem.href : false"
                       class="c_navigation__menu__menu_item"
                       :class="firstLvlItem.classes"
                       :aria-expanded="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? 'true' : 'false') : false"
                       :target="firstLvlItem.target"
                       :set-focus="firstLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false">
                {{ firstLvlItem.label }}
                <span v-if="firstLvlItem.children" aria-hidden="true">&#x25BC;</span>
            </component>
            <ul :hidden="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? false : true) : true" v-if="firstLvlItem.children" class="c_navigation__menu__sub_menu">
                <li v-for="(secondLvlItem, secondLvlIndex) in firstLvlItem.children">
                    <component :is="secondLvlItem.href && !secondLvlItem.children ? 'a' : 'button'"
                               @click="$parent.childNavToggleSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})"
                               @keydown.down="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? $parent.childNavNavigateDirectionForward({nextItemId: secondLvlItem.children[0] ? secondLvlItem.children[0].itemId : false }) : $parent.childNavOpenSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})) : $parent.childNavNavigateDirectionForward({nextItemId: firstLvlItem.children[secondLvlIndex + 1] ? firstLvlItem.children[secondLvlIndex + 1].itemId : firstLvlItem.children[0].itemId});"
                               @keydown.up="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? $parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event}) : $parent.childNavNavigateDirectionBackward({prevItemId: firstLvlItem.children[secondLvlIndex - 1] ? firstLvlItem.children[secondLvlIndex - 1].itemId : firstLvlItem.children[firstLvlItem.children.length - 1].itemId})) : $parent.childNavNavigateDirectionBackward({prevItemId: firstLvlItem.children[secondLvlIndex - 1] ? firstLvlItem.children[secondLvlIndex - 1].itemId : firstLvlItem.children[firstLvlItem.children.length - 1].itemId});"
                               @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, event: $event})"
                               :href="secondLvlItem.href && !secondLvlItem.children ? secondLvlItem.href : false"
                               class="c_navigation__menu__menu_item"
                               :class="secondLvlItem.classes"
                               :aria-expanded="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? 'true' : 'false') : false"
                               :target="secondLvlItem.target"
                               :set-focus="secondLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false">
                        {{ secondLvlItem.label }}
                        <span v-if="secondLvlItem.children" aria-hidden="true">&#x25BC;</span>
                    </component>
                    <ul :hidden="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? false : true) : true" v-if="secondLvlItem.children" class="c_navigation__menu__sub_menu">
                        <li v-for="(thirdLvlItem, thirdLvlIndex) in secondLvlItem.children">
                            <component :is="thirdLvlItem.href && !thirdLvlItem.children ? 'a' : 'button'"
                                       :href="thirdLvlItem.href && !thirdLvlItem.children ? thirdLvlItem.href : false"
                                       @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})"
                                       @keydown.down="$parent.childNavNavigateDirectionForward({nextItemId: secondLvlItem.children[thirdLvlIndex + 1] ? secondLvlItem.children[thirdLvlIndex + 1].itemId : secondLvlItem.children[0].itemId})"
                                       @keydown.up="$parent.childNavNavigateDirectionBackward({prevItemId: secondLvlItem.children[thirdLvlIndex - 1] ? secondLvlItem.children[thirdLvlIndex - 1].itemId : secondLvlItem.children[secondLvlItem.children.length - 1].itemId})"
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
            }
        },
        props: {
            navArray: false,
            currentItemId: false,
            currentChildItemId: false,
            setFocusToItemId: false
        },
        methods: {

        },
        created() {
            VueEvent.$on('nav-button-keyboard-pressed', (event) => {
                if(event){
                    if(event.keyCode == 40 && this.navArray && this.navArray[0]){ /* KeyCode 40 is the Down key */
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
    <%- include(paths.css.src + 'base/_mixins.scss') %>

     .c_navigation {
         $self: &;
         padding:10px;
         & {
             background: gray;
         }
         &--nav_stacked_dropdown {
             & .c_navigation__menu{
                 & > li {
                     a, button{
                         padding:10px;
                         display:inline-block;
                         text-decoration:none;
                         width:100%;
                     }
                     button{
                         display:flex;
                         flex-flow:row nowrap;
                         align-items:center;
                         span{
                             font-size:50%;
                             padding-left:5px;
                         }
                     }
                     & > a, & > button{
                         padding:10px;
                         &:hover, &:focus, &[aria-expanded="true"]{
                             background:#EEEEEE;
                         }
                     }
                     ul {
                         li {
                             position: relative;
                             & > a, & > button{
                                 width:100%;
                                 color:#FFFFFF;
                                 background:#444444;
                                 &:hover, &:focus, &[aria-expanded="true"]{
                                     background:#000000;
                                 }
                             }
                             ul {
                                 width: 100%;
                             }
                         }
                     }
                 }
             }
         }
     }
</style>