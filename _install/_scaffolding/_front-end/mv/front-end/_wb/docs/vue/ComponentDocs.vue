<template>
  <div>
    <div class="dev__components">
      <div class="dev__components__nav">
        <div :is="linkElementType" :class="{ 'dev__components__nav--current': currentPageHandle === item }" :to="`/dev/docs/${ item }/`" v-for="item in pages" :key="item">{{ titleCase(item) }}</div>
      </div>
      <div :is="currentPageHandle" class="dev__components__demo" :global-data="{ tailwind: tailwind, wb: wb }" />
    </div>
  </div>
</template>

<script>
  import { docsComponents, imports } from 'JS/automated/docs.js';
  import tailwind from 'JS/automated/tailwind.js';
  import wb from 'JS/automated/wb.js';

  export default {
    components: imports,
    data() {
      return {
        pages: docsComponents,
        tailwind,
        wb,
      };
    },
    computed: {
      currentPageHandle() {
        return `wb-${this.$route.path.substring(10, this.$route.path.length - 1)}`;
      },
      linkElementType() {
        let linkType = 'router-link';
        switch (wb.projectType) {
          case 'nuxt2':
            linkType = 'nuxt-link';
            break;
        }
        return linkType;
      },
    },
    methods: {
      titleCase(str) {
        return str.toLowerCase().split('_').map(function(word) {
          return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
      },
    },
  };
</script>

<style>
  /*! purgecss start ignore */
  .dev__components {
    margin: 0 auto;
    padding: 60px 0;
    max-width: 800px;

    &__nav {
      display: flex;
      flex-flow: row wrap;
      background-color: rgb(43, 48, 59);
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 40px;
      overflow: hidden;

      & > a {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column nowrap;
        flex: 1 1 140px;
        padding: 20px;
        box-sizing: border-box;
        text-align: center;
        text-decoration: none;
        color: rgb(255, 255, 255);
        transition: color 0.2s ease-out, background 0.2s ease-out;

        &.active {
          color: rgb(122, 134, 158);
        }

        &:not(.active):hover {
          background-color: rgb(75, 84, 103);
          color: rgb(196, 201, 212);
        }
      }
    }
    &__demo {
      h1&__header {
        margin-bottom: 0.3em;
        font-size: 1.5rem;
      }
      h2&__header {
        margin: 0.8em 0 0.2em;
        font-size: 1.2rem;
      }
      h3&__header {
        margin-bottom: 0.2em;
        font-size: 1.1rem;
        color: rgb(122, 134, 158);
      }
      & > p {
        margin-bottom: 20px;
      }
    }
    &__input {
      @apply p-4 w-full bg-dev-gray-700 text-white rounded;
    }
  }
  /*! purgecss end ignore */
</style>
