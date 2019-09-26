export const icons = {
<% svgs.forEach((item) => { -%>
  "<%- item.name %>": {
    html: `<%- include(item.path) %>`,
    encoded: `<%- new Buffer(`${ include(item.path) }`).toString('base64') %>`,
  },
<% }) -%>
}

// Get icon as a CSS background value
export function background(handle, replacements = {}) {
  const replacedString = getReplacements(icons[handle].html, replacements);
  return `url('data:image/svg+xml;utf8,${ replacedString }')`;
}

// Get icon as an <svg> element to embed onto the page
export function html(handle, replacements = {}) {
  return getReplacements(icons[handle].html, replacements);
}

// Get icon for a src attribute, for images
export function src(handle, replacements = {}) {
  const replacedString = getReplacements(icons[handle].html, replacements);
  return `data:image/svg+xml;utf8,${ replacedString }`;
}

// Replace things like IDs, colors, or other random strings
// Usage: getReplacements(`Hi, world!`, { 'Hi': 'Hello' })
// Results: `Hello, world!`
function getReplacements(text, replacements = {}) {
  Object.keys(replacements).forEach(function (item) {
    text = text.replace(new RegExp(item), replacements[item]);
  });

  return text;
}