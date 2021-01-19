<template>
  <div>
    <h1>Share Component</h1>
    <p>Use the browser Share API to bring up a share sheet to share a URL</p>

    <ImportPath path="import Share from 'Components/share/Share.vue';" />

    <CodeExample
      :code="code.default"
      title="Share Button"
      description="When clicked, a share sheet appears on browsers that support the Share API. Hides itself on browsers that do not support the Share API."
    >
      <Share share-title="This is Header" share-text="This is the body text." :share-url="linkToShare" />
      <p>
        <em
          >NOTE: the share button will only appear if your browser supports the
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share">Share API</a>.</em
        >
      </p>
    </CodeExample>

    <CodeExample
      :code="code.full"
      title="Share + Fallback"
      description="Add fallback content for browsers that do not support the Share API."
    >
      <Share
        share-title="This is Header"
        share-text="This is the body text."
        :share-url="linkToShare"
        @share-success="
          $refs.messenger.addMessage({ closeButton: true, level: 'success', messageHtml: `<p>URL shared!</p>` })
        "
        @share-error="displayError"
      >
        <template v-slot:fallback>
          <div class="grid grid-cols-it gap-4 max-w-sm items-center">
            <Button @clicked="copyToClipboard(linkToShare)" label-text="Copy" />
            <p>Copy URL to clipboard: {{ linkToShare }}</p>
          </div>
        </template>
      </Share>
      <Messenger ref="messenger" docked :message-duration="5000" />
    </CodeExample>

    <PropsTable :props="props" />

    <EventsTable :events="events" />
    <!--    <CssModifiers root-class="c_root_class" :modifiers="modifiers" />-->
  </div>
</template>

<script>
import Button from 'Components/button/Button.vue';
import Messenger from 'Components/message/Messenger.vue';
import Share from 'Components/share/Share.vue';
import CodeExample from 'WB/docs/vue/CodeExample.vue';
import EventsTable from 'WB/docs/vue/EventsTable.vue';
import ImportPath from 'WB/docs/vue/ImportPath.vue';
import PropsTable from 'WB/docs/vue/PropsTable.vue';
import { log } from 'JS/global.js';

export default {
  components: {
    Button,
    Messenger,
    Share,
    CodeExample,
    EventsTable,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      linkToShare: 'http://google.com',
      code: false,
      events: false,
      modifiers: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        () => {
          log(`Copied to clipboard: ${text}`);
          this.$refs.messenger.addMessage({
            closeButton: true,
            level: 'success',
            messageHtml: `<p>"${this.linkToShare}" copied to clipboard.</p>`,
          });
        },
        () => {
          log(`Could not copy ${text} to clipboard`);
          this.$refs.messenger.addMessage({
            closeButton: true,
            level: 'error',
            messageHtml: `<p>Copying "${this.linkToShare}" to clipboard failed. Please try again.</p>`,
          });
        }
      );
    },
    displayError(errorMessage) {
      this.$refs.messenger.addMessage({ closeButton: true, level: 'warning', messageHtml: errorMessage });
    },
  },
  created() {
    this.code = {
      default: `<Share share-title="This is Header" share-text="This is the body text." :share-url="linkToShare" />`,
      full: `<Share share-title="This is Header" share-text="This is the body text." :share-url="linkToShare" @share-success="$refs.messenger.addMessage({ closeButton: true, level: 'success', messageHtml: \`<p>URL shared!</p>\` })" @share-error="$refs.messenger.addMessage({ closeButton: true, level: 'warning', messageHtml: \`<p>URL was not shared.</p>\` })">
  <template v-slot:fallback>
    <div class="grid grid-cols-it gap-4 max-w-sm items-center">
      <Button @clicked="copyToClipboard(linkToShare)" label-text="Copy" />
      <p>Copy URL to clipboard: {{ linkToShare }}</p>
    </div>
  </template>
</Share>
<Messenger ref="messenger" docked :message-duration="5000" />`,
    };
    this.events = [
      { name: 'share-success', description: `Fires when the share action is complete.` },
      {
        name: 'share-error',
        arguments: 'String (error message)',
        description: `Fires when an error occurs or when the user decides to decline sharing even when a sharing action has begun.`,
      },
    ];
    this.modifiers = [{ name: 'example', description: `Example description.` }];
    this.props = [
      { name: 'shareTitle', type: 'String', description: `Used as a title for the URL being shared.` },
      {
        name: 'shareText',
        type: 'String',
        description: `Describes the URL to be shared. Can be used as body text in some sharing actions.`,
      },
      { name: 'shareUrl', type: 'String', description: `The URL to be shared.` },
    ];
  },
};
</script>
