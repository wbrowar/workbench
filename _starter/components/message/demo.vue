<template>
  <div>
    <h1 class="dev__components__demo__header">Title</h1>
    <p>Description</p>

    <ImportPath path="import Message from 'Components/message/Message.vue';" />

    <CodeExample :code="code.message" title="Message">
      <Message>
        <p class="font-semibold">Great success!</p>
        <p>The thing that you were hoping would happen, occurred as expected!</p>
      </Message>
    </CodeExample>

    <PropsTable :props="props.message" />

    <h1 class="dev__components__demo__header">Title</h1>
    <p>Description</p>

    <ImportPath path="import Message from 'Components/message/Message.vue';" />

    <CodeExample
      :code="code.staticMessenger"
      title="Messenger"
      description="Display one or more static message that can be manually closed."
    >
      <Messenger
        :starting-messages="[
          { closeButton: true, level: 'warning', messageText: 'I’m sorry, Dave. I’m afraid I can’t do that.' },
        ]"
      />
    </CodeExample>

    <CodeExample
      :code="code.dockedMessenger"
      title="Docked Messenger"
      description="Add messages to a messenger based on user action."
    >
      <div class="c-buttons mb-3">
        <Button @clicked="addMessage" label-text="Show new message" />
      </div>
      <Messenger ref="messenger" docked :message-duration="5000" />
    </CodeExample>

    <PropsTable :props="props.messenger" />

    <!--    <CssModifiers root-class="c_root_class" :modifiers="modifiers" />-->
  </div>
</template>

<script>
import Button from 'Components/button/Button.vue';
import Message from 'Components/message/Message.vue';
import Messenger from 'Components/message/Messenger.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    Button,
    Message,
    Messenger,
    CodeExample,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  methods: {
    addMessage() {
      this.$refs.messenger.addMessage({
        closeButton: true,
        level: 'error',
        messageHtml: `<p>Oh, hello! It looks like a button was pressed.</p>`,
      });
    },
  },
  created() {
    this.code = {
      message: `<Message>
  <p class="font-semibold">Great success!</p>
  <p>The thing that you were hoping would happen, occurred as expected!</p>
</Message>`,
      staticMessenger: `<Messenger :starting-messages="[
  { closeButton: true, level: 'warning', messageText: 'I’m sorry, Dave. I’m afraid I can’t do that.' }
]" />`,
      dockedMessenger: `<div class="c-buttons mb-3">
  <Button @clicked="addMessage" label-text="Show new message" />
</div>
<Messenger ref="messenger" docked :message-duration="5000" />`,
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.props = {
      message: [
        { name: 'closeButton', type: 'Boolean', default: `false`, description: `Allow the user to close the message.` },
        {
          name: 'duration',
          type: 'Number',
          description: `If a duration is set, the message will disappear after the set duration (set in milliseconds).`,
        },
        {
          name: 'id',
          type: 'String',
          description: `A unique identifier needed when messages are in a Messenger. If it is not set, the current timestamp will be used.`,
        },
        {
          name: 'level',
          type: 'String',
          default: `'success'`,
          description: `Determines the message’s theme colors. Accpets: success, warning, error`,
        },
        { name: 'messageText', type: 'String', description: `The message content displayed as simple text.` },
        { name: 'messageHtml', type: 'String', description: `The message content parsed as HTML.` },
      ],
      messenger: [
        {
          name: 'docked',
          type: 'Boolean',
          default: `false`,
          description: `Docking the messenger fixes its position to an area of the screen.`,
        },
        {
          name: 'messageCloseButton',
          type: 'Boolean',
          default: `false`,
          description: `Displays a close button on all messages, regardless of individual message settings.`,
        },
        {
          name: 'messageDuration',
          type: 'Number',
          description: `Sets a duration on all messages, regardless of individual message settings.`,
        },
        {
          name: 'startingMessages',
          type: 'Array',
          description: `An array of message properties used to display messages on load.`,
        },
      ],
    };
  },
};
</script>
