export const linkFieldButtonGql = function(handle = 'ioArticleBody') {
  return `homeHeaderCta {
  ariaLabel
  customText
  element {
    title
    uri
  }
  target
  text
  title
  type
  url
}`.replace(/homeHeaderCta/g, handle);
};
