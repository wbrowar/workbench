<template>
  <div :is="elementType" ref="el" v-bind="bindAttributes"><slot></slot></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, toRefs } from '@nuxtjs/composition-api';
import { useIntersectionObserver, useMutationObserver } from '@vueuse/core';
import { log } from 'JS/global';

export default defineComponent({
  name: 'Box',
  props: {
    bindDefault: {
      type: Object,
      default() {
        return {};
      },
    },
    bindOnEnter: Object,
    bindOnExit: Object,
    elementType: {
      type: String,
      default: 'div',
    },
    intersection: {
      type: Boolean,
      default: false,
    },
    intersectionOnce: {
      type: Boolean,
      default: false,
    },
    intersectionRootSelector: String,
    intersectionRootMargin: {
      type: String,
      default: '-100px 0px',
    },
    intersectionThreshold: {
      type: Number,
      default: 0,
    },
    mutation: {
      type: Boolean,
      default: false,
    },
    mutationOptions: {
      type: Object,
      default() {
        return {
          attributes: true,
          childList: true,
          subtree: true,
        };
      },
    },
  },
  setup(props: any, { emit }: any) {
    const state = reactive<{
      bindAttributes: any;
    }>({
      bindAttributes: null,
    });

    const el = ref<HTMLElement | null>(null);
    state.bindAttributes = props.bindDefault;

    const intersectionCallback = (isIntersecting: boolean) => {
      if (isIntersecting) {
        // log('Entering Viewport');
        emit('enter-viewport');

        if (props.bindOnEnter) {
          state.bindAttributes = props.bindOnEnter;
        }
      } else {
        // log('Exiting Viewport');
        emit('exit-viewport');

        if (props.bindOnExit) {
          state.bindAttributes = props.bindOnExit;
        }
      }
    };
    onMounted(() => {
      if ((props.intersection || props.intersectionOnce) && el?.value) {
        const rect = el.value.getBoundingClientRect();

        if (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) {
          // log('Box in Viewport');
          intersectionCallback(true);
        } else {
          const { stop } = useIntersectionObserver(
            el,
            ([{ isIntersecting }], observerElement) => {
              // log('Intersection', isIntersecting, observerElement);
              intersectionCallback(isIntersecting);

              if (props.intersectionOnce && isIntersecting) {
                observerElement.disconnect();
              }
            },
            {
              root: props.intersectionRootSelector ? document.querySelector(`${props.intersectionRootSelector}`) : null,
              rootMargin: props.intersectionRootMargin || undefined,
              threshold: props.intersectionThreshold || undefined,
            }
          );

          onBeforeUnmount(() => {
            stop();
          });
        }
      }

      if (props.mutation) {
        const { stop } = useMutationObserver(
          el,
          (mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                // log('A child node has been added or removed.');
              } else if (mutation.type === 'attributes') {
                // log('The ' + mutation.attributeName + ' attribute was modified.');
              }
              emit('resized', {
                attributeName: mutation.attributeName || null,
                mutationType: mutation.type,
              });
            });
          },
          {
            attributes: true,
          }
        );

        onBeforeUnmount(() => {
          stop();
        });
      }

      log('Box loaded');
    });

    return {
      el,
      ...toRefs(state),
    };
  },
});
</script>
