<template>
    <ul class="c-navigation__menu">
        <li v-for="(firstLvlItem, firstLvlIndex) in navArray">
            <component :is="firstLvlItem.href && !firstLvlItem.children ? 'a' : 'button'"
                       @click="$parent.childNavToggleSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event})"
                       @keydown.down="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? $parent.childNavNavigateDirectionForward({nextItemId: firstLvlItem.children[0] ? firstLvlItem.children[0].itemId : false}) : $parent.childNavOpenSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event})) : false;"
                       @keydown.up="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? $parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event}) : false) : false;"
                       @keydown.right="firstLvlItem.itemId === currentItemId ? [$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event}), $parent.childNavNavigateDirectionForward({nextItemId: navArray[firstLvlIndex + 1] ? navArray[firstLvlIndex + 1].itemId : navArray[0].itemId})] : $parent.childNavNavigateDirectionForward({nextItemId: navArray[firstLvlIndex + 1] ? navArray[firstLvlIndex + 1].itemId : navArray[0].itemId})"
                       @keydown.left="firstLvlItem.itemId === currentItemId ? [$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event}), $parent.childNavNavigateDirectionBackward({prevItemId: navArray[firstLvlIndex - 1] ? navArray[firstLvlIndex - 1].itemId : navArray[navArray.length - 1].itemId})] : $parent.childNavNavigateDirectionBackward({prevItemId: navArray[firstLvlIndex - 1] ? navArray[firstLvlIndex - 1].itemId : navArray[navArray.length - 1].itemId})"
                       @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event})"
                       :href="firstLvlItem.href && !firstLvlItem.children ? firstLvlItem.href : false"
                       class="c-navigation__menu__menu_item"
                       :class="firstLvlItem.classes"
                       :aria-live="firstLvlItem.children ? 'aggresive' : false"
                       :aria-expanded="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? 'true' : 'false') : false"
                       :target="firstLvlItem.target"
                       :set-focus="firstLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false">
                            {{ firstLvlItem.label }}
                            <span v-if="firstLvlItem.children" aria-hidden="true">&#x25BC;</span>
            </component>
            <ul :hidden="firstLvlItem.children ? (firstLvlItem.itemId === currentItemId ? false : true) : true" v-if="firstLvlItem.children">
                <li v-for="(secondLvlItem, secondLvlIndex) in firstLvlItem.children">
                    <component :is="secondLvlItem.href && !secondLvlItem.children ? 'a' : 'button'"
                               @click="$parent.childNavToggleSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})"
                               @keydown.down="$parent.childNavNavigateDirectionForward({nextItemId: firstLvlItem.children[secondLvlIndex + 1] ? firstLvlItem.children[secondLvlIndex + 1].itemId : firstLvlItem.children[0].itemId})"
                               @keydown.up="$parent.childNavNavigateDirectionBackward({prevItemId: firstLvlItem.children[secondLvlIndex - 1] ? firstLvlItem.children[secondLvlIndex - 1].itemId : firstLvlItem.children[firstLvlItem.children.length - 1].itemId})"
                               @keydown.right="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? $parent.childNavNavigateDirectionForward({nextItemId: secondLvlItem.children[0] ? secondLvlItem.children[0].itemId : false }) : $parent.childNavOpenSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})) : false;"
                               @keydown.left="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? $parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event}) : false) : false;"
                               @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: false, event: $event})"
                               :href="secondLvlItem.href && !secondLvlItem.children ? secondLvlItem.href : false"
                               class="c-navigation__menu__menu_item"
                               :class="secondLvlItem.classes"
                               :aria-live="secondLvlItem.children ? 'aggresive' : false"
                               :aria-expanded="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? 'true' : 'false') : false"
                               :target="secondLvlItem.target"
                               :set-focus="secondLvlItem.itemId == setFocusToItemId ? [$parent.childNavSetNavItemFocus() && true] : false">
                                    {{ secondLvlItem.label }}
                                    <span v-if="secondLvlItem.children" aria-hidden="true">&#x25B6;</span>
                    </component>
                    <ul :hidden="secondLvlItem.children ? (secondLvlItem.itemId === currentChildItemId ? false : true) : true" v-if="secondLvlItem.children" class="c-navigation__menu__sub_menu">
                        <li v-for="(thirdLvlItem, thirdLvlIndex) in secondLvlItem.children">
                            <component :is="thirdLvlItem.href && !thirdLvlItem.children ? 'a' : 'button'"
                                       :href="thirdLvlItem.href && !thirdLvlItem.children ? thirdLvlItem.href : false"
                                       @keydown.esc="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event})"
                                       @keydown.down="$parent.childNavNavigateDirectionForward({nextItemId: secondLvlItem.children[thirdLvlIndex + 1] ? secondLvlItem.children[thirdLvlIndex + 1].itemId : secondLvlItem.children[0].itemId})"
                                       @keydown.up="$parent.childNavNavigateDirectionBackward({prevItemId: secondLvlItem.children[thirdLvlIndex - 1] ? secondLvlItem.children[thirdLvlIndex - 1].itemId : secondLvlItem.children[secondLvlItem.children.length - 1].itemId})"
                                       @keydown.left="$parent.childNavCloseSubNav({itemId: firstLvlItem.itemId, childItemId: secondLvlItem.itemId, event: $event, setFocusToParentItem: true})"
                                       class="c-navigation__menu__menu_item"
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
                showNav: false,
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

        },
        mounted() {
            this.$parent.childNavNavClose(); // Close menu when rendered.

        }
    }
</script>

<style>
    .c-navigation {
         & {
             background: gray;
         }
         &--nav_dropdown {
            & .c-navigation__menu{
                text-align:right;
                &--open{

                }
                 & > li {
                     display: inline-block;
                     position: relative;
                     a, button{
                         padding:10px;
                         display:inline-block;
                         text-decoration:none;
                         box-sizing: border-box;
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
                         border-right:1px solid #333333;
                         &:hover, &:focus, &[aria-expanded="true"]{
                             background:#EEEEEE;
                         }
                     }
                     ul {
                         position: absolute;
                         top: 100%;
                         left: 0;
                         li {
                             position: relative;
                             & > a, & > button{
                                 color:#FFFFFF;
                                 background:#444444;
                                 width:300px;
                                 &:hover, &:focus, &[aria-expanded="true"]{
                                     background:#000000;
                                 }
                             }
                             ul {
                                 top:0;
                                 transform: translateX(100%);
                             }
                             button.c-navigation__menu__menu_item--out-of-viewport-right + ul{
                                 transform: translateX(-100%);
                             }
                             button.c-navigation__menu__menu_item--out-of-viewport-left + ul{
                                 transform: translateX(100%);
                             }
                         }
                     }
                     button.c-navigation__menu__menu_item--out-of-viewport-right + ul{
                         left:auto;
                         right: 0;
                         button{
                             justify-content:flex-end;
                         }
                     }
                     button.c-navigation__menu__menu_item--out-of-viewport-left + ul{
                         left: 0;
                         right:auto;
                         button{
                             justify-content:flex-end;
                         }
                     }
                 }
             }
         }
     }
</style>