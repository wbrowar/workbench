<template>
  <div class="c-share" v-if="canShare || this.$slots.fallback">
    <Button @clicked="shareUrlHandler" v-if="canShare"><slot>Share</slot></Button>
    <slot name="fallback" v-else></slot>
  </div>
</template>

<script>
import { processIsClient, log, error } from 'JS/global.js';
import Button from 'Components/button/Button.vue';

export default {
  name: 'Share',
  components: {
    Button,
  },
  data() {
    return {
      canShare: false,
    };
  },
  props: {
    shareTitle: { type: String, required: true },
    shareText: { type: String, required: true },
    shareUrl: { type: String, required: true },
  },
  computed: {},
  methods: {
    shareUrlHandler() {
      if (processIsClient(process) && this.canShare) {
        const shareInfo = { url: this.shareUrl };

        if (this.shareTitle) {
          shareInfo.title = this.shareTitle;
        }
        if (this.shareText) {
          shareInfo.text = this.shareText;
        }
        navigator
          .share(shareInfo)
          .then(() => {
            this.$emit('share-success');
            log('Thanks for sharing!');
          })
          .catch((err) => {
            this.$emit('share-error', err.message);
            error(`Couldn't share because of`, err.message);
          });
      }
    },
  },
  created() {
    if (processIsClient(process)) {
      if (navigator.share) {
        this.canShare = true;
      }
    }
  },
  mounted() {},
};
</script>
