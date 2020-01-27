export const docsComponents = ['<%- components.join("','") %>'];
export const imports = {
<% components.forEach((item) => { -%>
  'wb-<%- item %>': () => import('Components/<%- item %>/demo.vue'),
<% }) -%>
};