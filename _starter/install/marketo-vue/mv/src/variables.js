import wb from 'JS/automated/wb.js';

export const headVars = [
  {
    label: "Show Marketo Docs",
    id: "show_marketo_docs",
    type: "mktoBoolean",
    default: false,
    description: `Show landing page docs.`,
  },
  {
    // String example
    label: "Example Single Line Text",
    id: "example_single_line_text",
    type: "mktoString",
    default: "Example Headline",
    allowHtml: false,
    description: `Example of single-line string.`,
  },
  {
    // Color example
    label: "Example Color",
    id: "example_color",
    type: "mktoColor",
    default: "#FF00FF",
    description: `Example of color picker variable.`,
  },
  {
    // Boolean example
    label: "Example Lightswitch",
    id: "example_lightswitch",
    type: "mktoBoolean",
    default: true,
    description: `Example of boolean. Will be parsed as a Boolean in Vue.`,
  },
  {
    // Form example
    label: "Video Example",
    id: "example_video",
    type: "mktoString",
    default: `G4Sn91t1V4g`,
  },
];

export const bodyVars = [
  {
    // Image example
    label: "Example Text",
    id: "example_text",
    type: "mktoText",
    default: `<p>Optionally add default text for the editable text area.</p>`,
    description: `Example rich text field.`,
  },
  {
    // Image example
    label: "Example Image",
    id: "example_image",
    type: "mktoImg",
    default: {
      alt: `Bright fuchsia image with FPO written in the center of it.`,
      src: `${wb.paths.publicPath}img/FPO.png`,
    },
  },
  {
    // Form example
    label: "Form Example",
    id: "example_form",
    type: "mktoForm",
  },
];