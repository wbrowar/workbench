<template>
  <div class="docs__modifiers_table">
    <h2>Modifiers</h2>
    <table class="docs__modifiers_table__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in modifiers">
          <td><strong>{{ rootClass }}--{{ item.name || ' ' }}</strong></td>
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
      modifiers: { type: Array, required: true },
      rootClass: { type: String, required: true },
    },
  };
</script>

<style lang="scss" scoped>
  .docs__modifiers_table {
    $self: &;

    margin: 50px 0;

    @at-root #{$self}__table {
      width: 100%;

      th {
        padding: 0.4em 20px;
        background-color: rgba(231, 196, 193, 0.9);
        border: 1px solid rgba(231, 191, 188, 0.7);
        text-align: left;
        font-size: 14px;
        color: #3b2322;
      }
      td {
        padding: 0.4em 20px;
        font-size: 0.8rem;
        border: 1px solid rgba(231, 199, 201, 0.7);
        background-color: rgba(231, 200, 207, 0.6);
        line-height: 1.5;
        color: rgba(59, 37, 43, 0.7);
      }
    }
  }
</style>