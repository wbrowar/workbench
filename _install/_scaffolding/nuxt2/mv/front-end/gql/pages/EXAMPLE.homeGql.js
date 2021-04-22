export const homeGql = `query homeGql {
  entry(
    uri: "__home__"
  ) {
    title
    seomatic(asArray: true) {
      metaTitleContainer
      metaLinkContainer
      metaScriptContainer
      metaJsonLdContainer
      metaTagContainer
    }
  }
}`;
