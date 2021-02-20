<template>
  <div class="docs__events_table">
    <h2 class="dev__components__demo__header">Events</h2>
    <table class="docs__events_table__table">
      <thead>
        <tr>
          <th>Name</th>
          <th v-if="showArgumentsColumn">Arguments</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in events">
          <td><strong>{{ item.name || ' ' }}</strong></td>
          <td v-if="showArgumentsColumn"><em>{{ item.arguments || ' ' }}</em></td>
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
        showArgumentsColumn: false,
      };
    },
    props: {
      events: { type: Array, required: true },
    },
    created() {
      this.events.forEach((item) => {
        if (item.arguments) {
          this.showArgumentsColumn = true;
        }
      });
    },
  };
</script>

<style scoped>
  /*! purgecss start ignore */
  .docs__events_table {
    margin: 50px 0;

    &__table {
      width: 100%;

      th {
        padding: 0.4em 20px;
        background-color: rgba(154, 231, 157, 0.9);
        border: 1px solid rgba(194, 231, 204, 0.7);
        text-align: left;
        font-size: 14px;
        color: #273b2a;
      }
      td {
        padding: 0.4em 20px;
        font-size: 0.8rem;
        border: 1px solid rgba(191, 231, 198, 0.7);
        background-color: rgba(191, 231, 198, 0.6);
        line-height: 1.5;
        color: rgba(38, 59, 38, 0.7);
      }
    }
  }
  /*! purgecss end ignore */
</style>