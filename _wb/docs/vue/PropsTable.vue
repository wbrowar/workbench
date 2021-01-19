<template>
  <div class="docs__props_table">
    <h2 class="dev__components__demo__header">Props</h2>
    <table class="docs__props_table__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th v-if="showDefaultColumn">Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props">
          <td><strong>{{ item.name || ' ' }}</strong></td>
          <td><em>{{ item.type || ' ' }}</em></td>
          <td v-if="showDefaultColumn">{{ item.default || ' ' }}</td>
          <td>{{ item.description || ' ' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showDefaultColumn: false,
      };
    },
    props: {
      props: { type: Array, required: true },
    },
    created() {
      this.props.forEach((item) => {
          if (item.default) {
            this.showDefaultColumn = true;
          }
      });
    }
  };
</script>

<style scoped>
  /*! purgecss start ignore */
  .docs__props_table {
    margin: 50px 0;

    &__table {
      width: 100%;

      th {
        padding: 0.4em 20px;
        background-color: rgba(211, 220, 231, 0.9);
        border: 1px solid rgba(211, 220, 231, 0.7);
        text-align: left;
        font-size: 14px;
        color: #2b303b;
      }
      td {
        padding: 0.4em 20px;
        font-size: 0.8rem;
        border: 1px solid rgba(211, 220, 231, 0.7);
        background-color: rgba(211, 220, 231, 0.6);
        line-height: 1.5;
        color: rgba(43, 48, 59, 0.7);
      }
    }
  }
  /*! purgecss end ignore */
</style>