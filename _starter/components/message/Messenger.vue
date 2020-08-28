<template>
  <div class="c-messenger" :class="containerClassess">
    <ClientOnly>
      <transition-group name="c-messenger-fade">
        <Message class="m-2 first:mt-0" @closedMessage="removeMessage" v-bind="message" v-for="message in messages" :key="message.messageId" />
      </transition-group>
    </ClientOnly>
  </div>
</template>

<script>
// import { log } from 'JS/global.js';
import Message from 'Components/message/Message.vue';

export default {
  components: {
    Message,
  },
  data() {
    return {
      messages: [],
    };
  },
  props: {
    docked: { type: Boolean, default: false },
    messageCloseButton: { type: Boolean, default: false },
    messageDuration: Number,
    startingMessages: Array,
  },
  computed: {
    containerClassess: function() {
      let classes = [];

      if (this.docked) {
        classes.push(['my-0 mx-auto fixed bottom-0 right-0 w-full max-w-xl z-40']);
      }

      return classes;
    },
  },
  methods: {
    addMessage: function(message) {
      if (message.messageId === undefined) {
        message.messageId = `message-${Date.now()}`;
      }
      if (this.messageCloseButton) {
        message.closeButton = this.messageCloseButton;
      }
      if (this.messageDuration) {
        message.duration = this.messageDuration;
      }
      this.messages.push(message);
    },
    removeMessage: function(messageId) {
      this.messages = this.messages.filter(function(el) { return el.messageId !== messageId; });
    },
  },
  created() {
    if (this.startingMessages) {
      this.startingMessages.forEach((message) => {
          this.addMessage(message);
      });
    }

    // @TODO look into Vuex-based messages
    // Reference: https://dev.to/viniciuskneves/watch-for-vuex-state-changes-2mgj
    // this.$store.subscribe((mutation, state) => {
    //   if (mutation.type === 'updateStatus') {
    //     console.log(`Updating to ${state.status}`);
    //
    //     // Do whatever makes sense now
    //     if (state.status === 'success') {
    //       this.complex = {
    //         deep: 'some deep object',
    //       };
    //     }
    //   }
    // });
  },
};
</script>

<style>
.c-messenger {
  &-fade {
    &-enter-active, &-leave-active {
      transition: transform .3s ease-out, opacity .3s ease-out;
    }
    &-enter, &-leave-to {
      transform: translateY(50px);
      opacity: 0;
    }
  }
}
</style>
