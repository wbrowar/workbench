<template>
  <div class="c-message border border-solid rounded" :class="classes">
    <div class="px-4 py-3">
      <slot>
        <div v-if="messageHtml" v-html="messageHtml"></div>
        <div v-text="messageText" v-else-if="messageText"></div>
      </slot>
    </div>
    <div
      class="flex items-center justify-center px-4 py-3 text-white rounded-r cursor-pointer"
      :class="[`bg-${level}`]"
      title="Close"
      @click="closeMessage"
      v-if="closeButton"
    >
      X
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeout: null,
    };
  },
  props: {
    closeButton: { type: Boolean, default: false },
    duration: Number,
    messageId: String,
    level: { type: String, default: 'success' }, // success, warning, error
    messageText: String,
    messageHtml: String,
  },
  computed: {
    classes: function() {
      let classes = [];

      classes.push(`bg-${this.level}-70`, `text-white`, `border-${this.level}`);

      if (this.closeButton) {
        classes.push('grid', 'c-message-grid');
      }

      return classes;
    },
  },
  methods: {
    closeMessage: function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$emit('closedMessage', this.messageId);
    },
  },
  mounted() {
    if (this.duration) {
      this.timeout = setTimeout(this.closeMessage, this.duration);
    }
  },
  destroyed() {
    clearTimeout(this.timeout);
  }
};
</script>

<style lang="scss">
.c-message {
  $self: &;

  backdrop-filter: blur(20px);

  @at-root #{$self}-grid {
    grid-template-columns: auto 50px;
  }
}
</style>
