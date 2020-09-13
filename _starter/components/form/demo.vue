<template>
  <div>
    <h1>Form</h1>
    <p>Description</p>

    <ImportPath path="import ValidatedForm from 'Components/form/ValidatedForm.vue';" />

    <CodeExample :code="code.form" title="Validated Form" description="Optional description.">
      <ValidatedForm validate action="/dev/docs/form">
        <div class="c_form--2_column">
          <ValidatedFormInput required input-name="firstName" label-text="First Name" />
          <ValidatedFormInput input-name="lastName" label-text="Last Name" />
        </div>
        <ValidatedFormInput required input-name="email" label-text="Email" validation-type="email" />
        <ValidatedFormInput
          required
          input-name="country"
          label-text="Country"
          input-type="select"
          :input-options="[
            { label: 'USA', value: 'us' },
            { label: 'Germany', value: 'de' },
          ]"
        />
        <ValidatedFormInput
          input-name="checkboxes"
          input-type="checkboxes"
          :input-options="[
            { label: 'USA', value: 'us' },
            { label: 'Germany', value: 'de' },
          ]"
        />
        <ValidatedFormInput
          input-name="radio"
          input-type="radio"
          :input-options="[
            { label: 'USA', value: 'us' },
            { label: 'Germany', value: 'de' },
          ]"
        />
        <ValidatedFormInput input-name="comments" label-text="Comments" input-type="textarea" />
      </ValidatedForm>
    </CodeExample>

    <PropsTable :props="props.form" />

    <h1>Form Input</h1>

    <ImportPath path="import ValidatedFormInput from 'Components/form/ValidatedFormInput.vue';" />

    <CodeExample
      :code="code.plainText"
      title="Plain Text Field"
      description="Simple input field with no validation or formatting."
    >
      <ValidatedFormInput input-name="textName" label-text="First Name" />
    </CodeExample>

    <CodeExample
      :code="code.validatedEmail"
      title="Validated Email Field"
      description="A field that will display an error when an invalid email address is entered."
    >
      <ValidatedFormInput input-name="validatedEmail" label-text="Email" validation-type="email" />
    </CodeExample>

    <CodeExample
      :code="code.formattedPhone"
      title="Formatted + Validated Telephone Field"
      description="A field that will only allow numbers that are formatted for a telephone number>"
    >
      <ValidatedFormInput
        input-name="formattedPhone"
        label-text="Phone (xxx-xxx-xxxx)"
        format-type="tel"
        validation-type="tel"
        input-placeholder="xxx-xxx-xxxx"
      />
    </CodeExample>

    <CodeExample :code="code.prepopulatedInput" title="Pre-populated Field">
      <ValidatedFormInput input-name="startingValue" label-text="Address" starting-value="123 Example Ave." />
    </CodeExample>

    <CodeExample :code="code.selectField" title="Select (dropdown)">
      <ValidatedFormInput
        input-name="selectCountry"
        label-text="Country"
        input-type="select"
        :input-options="[
          { label: 'USA', value: 'us' },
          { label: 'Germany', value: 'de' },
        ]"
      />
    </CodeExample>

    <PropsTable :props="props.input" />

    <EventsTable :events="events.input" />
  </div>
</template>

<script>
import ValidatedForm from 'Components/form/ValidatedForm.vue';
import ValidatedFormInput from 'Components/form/ValidatedFormInput.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
// import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import EventsTable from 'Starter/docs/vue/EventsTable.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    ValidatedForm,
    ValidatedFormInput,
    CodeExample,
    EventsTable,
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
  created() {
    this.code = {
      entry: `<FormEntry form-slug="contact-sales" />`,
      form: `<ValidatedForm validate action="/dev/docs/form">
  <div class="c_form--2_column">
    <ValidatedFormInput required input-name="firstName" label-text="First Name" />
    <ValidatedFormInput input-name="lastName" label-text="Last Name" />
  </div>
  <ValidatedFormInput required input-name="email" label-text="Email" validation-type="email" />
  <ValidatedFormInput
    required
    input-name="country"
    label-text="Country"
    input-type="select"
    :input-options="[
      { label: 'USA', value: 'us' },
      { label: 'Germany', value: 'de' },
    ]"
  />
  <ValidatedFormInput input-name="comments" label-text="Comments" input-type="textarea" />
</ValidatedForm>`,
      plainText: `<ValidatedFormInput input-name="textName" label-text="First Name" />`,
      validatedEmail: `<ValidatedFormInput input-name="validatedEmail" label-text="Email" validation-type="email" />`,
      formattedPhone: ``,
      default: `<ValidatedFormInput
  input-name="formattedPhone"
  label-text="Phone (xxx-xxx-xxxx)"
  format-type="tel"
  validation-type="tel"
  input-placeholder="xxx-xxx-xxxx"
/>`,
      prepopulatedInput: `<ValidatedFormInput input-name="startingValue" label-text="Address" starting-value="123 Example Ave." />`,
      selectField: `<ValidatedFormInput
  input-name="selectCountry"
  label-text="Country"
  input-type="select"
  :input-options="[
    { label: 'USA', value: 'us' },
    { label: 'Germany', value: 'de' },
  ]"
/>`,
    };
    this.events = {
      input: [
        { name: 'form-set-error', arguments: 'MouseEvent', description: `Fires whenever the button is clicked.` },
        { name: 'form-remove-error', arguments: 'MouseEvent', description: `Fires whenever the button is clicked.` },
        { name: 'value-change', arguments: 'MouseEvent', description: `Fires whenever the button is clicked.` },
      ],
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.props = {
      entry: [
        {
          name: 'formSlug',
          type: 'String',
          description: `The slug of a form entry. This is used in a GraphQL call to load the form fields and attributes.`,
        },
      ],
      form: [
        { name: 'action', type: 'String', description: `Sets the form action attribute.` },
        { name: 'method', type: 'String', default: `'get'`, description: `Sets the form method attribute.` },
        {
          name: 'submitButtonLabel',
          type: 'String',
          description: `Change the submit button attribute from "Submit" to a new string.`,
        },
        {
          name: 'validate',
          type: 'String',
          default: `false`,
          description: `Enable Vue-based validation to prevent the form from submitting.`,
        },
      ],
      input: [
        {
          name: 'errorMessage',
          type: 'String',
          description: `An error message that overrides the default error message for a given validation type.`,
        },
        {
          name: 'formatType',
          type: 'String',
          description: `Formats text entry into a specified format. Accepts: tel, zip`,
        },
        { name: 'inputClasses', type: 'String', description: `Pass classes into the input.` },
        { name: 'inputId', type: 'String', description: `The ID of the input.` },
        { name: 'inputName', type: 'String', description: `The name attribute of the input.` },
        { name: 'inputPlaceholder', type: 'String', description: `The placeholder attribute of the input.` },
        {
          name: 'inputType',
          type: 'String',
          default: `'text'`,
          description: `Determine the type of input. Accepts: textarea or any valid text-based input type`,
        },
        {
          name: 'startingValue',
          type: 'String',
          description: `Sets the value of the input when the input is created.`,
        },
        {
          name: 'labelText',
          type: 'String',
          description: `Adds a form label. NOTE: an id should be added to the field to set the label’s "for" attribute.`,
        },
        { name: 'required', type: 'Boolean', default: `false`, description: `Sets the input to required.` },
        {
          name: 'validationType',
          type: 'String',
          description: `Defines the method used to validate an input value. Accepts: email, tel, text, zip`,
        },
      ],
    };
  },
};
</script>
