<template>
  <<%- wb.projectType === 'gridsome' ? 'Layout' : 'div' %>>
    <div class="dev__components">
      <div class="dev__components__nav">
        <<%- wb.projectType === 'gridsome' ? 'g-link' : 'router-link' %> :class="{ 'dev__components__nav--current': currentPageHandle === item }" :to="`/dev/docs/${ item }/`" v-for="item in pages" :key="item">{{ titleCase(item) }}</<%- wb.projectType === 'gridsome' ? 'g-link' : 'router-link' %>>
      </div>
      <demo class="dev__components__demo" :global-data="{ wb: wb }" />
    </div>
  </<%- wb.projectType === 'gridsome' ? 'Layout' : 'div' %>>
</template>

<script>
  import demo from 'Components/<%- handle %>/demo.vue';

  export default {
    components: {
      demo,
    },
    data() {
      return {
        currentPageHandle: '<%- handle %>',
        pages: ['<%- components.join("','") %>'],
        wb: require(`${ process.cwd() }/wb.config.js`),
      };
    },
    methods: {
      titleCase: function(str) {
        return str.toLowerCase().split('_').map(function(word) {
          return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
      },
    },
  };
</script>

<style lang="scss">
  .dev__components {
    $self: &;

    margin: 0 auto;
    padding: 60px 0;
    max-width: 800px;

    @at-root #{$self}__nav {
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
    @at-root #{$self}__demo {
      h1:not(.c_header) {
        margin-bottom: 0.3em;
        font-size: 1.5rem;
      }
      h2:not(.c_header) {
        margin: 0.8em 0 0.2em;
        font-size: 1.2rem;
      }
      h3:not(.c_header) {
        margin-bottom: 0.2em;
        font-size: 1.1rem;
        color: rgb(122, 134, 158);
      }
      & > p {
        margin-bottom: 20px;
      }
    }
  }
</style>