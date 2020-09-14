<template>
  <div class="c-marketo_form">
    <div v-if="formLoadingConfig.domain && formLoadingConfig.loadScript">
      <form :id="'mktoForm_' + marketoFormId" :class="formClasses"></form>
    </div>
    <div v-else>
      Marketo form information has not been setup. Please add a form loading script and a form domain.
    </div>
  </div>
</template>

<script>
import { processIsClient } from 'JS/global.js';
import loadjs from 'loadjs';

export default {
  name: 'MarketoForm',
  components: {},
  data() {
    return {};
  },
  props: {
    formClass: String,
    marketoAccount: { type: String, required: true },
    marketoFormId: { type: Number, required: true },
    marketoFormDomain: String,
    marketoFormLoadScript: String,
  },
  computed: {
    formClasses() {
      const classes = [];

      classes.push(this.formClass);

      return classes;
    },
    formLoadingConfig() {
      let domain = null;
      let loadScript = null;

      if (this.marketoFormDomain) {
        domain = this.marketoFormDomain;
      } else if (this.$store.marketoFormDomain) {
        domain = this.$store.marketoFormDomain;
      }

      if (this.marketoFormLoadScript) {
        loadScript = this.marketoFormLoadScript;
      } else if (this.$store.marketoFormLoadScript) {
        loadScript = this.$store.marketoFormLoadScript;
      }

      return {
        domain,
        loadScript,
      };
    },
  },
  methods: {
    loadForm() {
      if (this.formLoadingConfig.domain && this.formLoadingConfig.loadScript && processIsClient) {
        loadjs(this.formLoadingConfig.loadScript, {
          success: () => {
            // eslint-disable-next-line no-undef
            MktoForms2.loadForm(this.formLoadingConfig.domain, this.marketoAccount, this.marketoFormId);
          },
          async: false,
        });
      }
    },
  },
  mounted() {
    this.loadForm();
  },
};
</script>
