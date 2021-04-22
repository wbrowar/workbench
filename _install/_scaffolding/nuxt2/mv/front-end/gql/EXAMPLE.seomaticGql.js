export const seomaticGql = `query seomaticGql($uri: String) {
  seomatic(uri: $uri, asArray: true) {
    metaTitleContainer
    metaLinkContainer
    metaScriptContainer
    metaJsonLdContainer
    metaTagContainer
  }
}`;
