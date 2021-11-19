const elementGql = `title
seomatic(asArray: true) {
  metaTitleContainer
  metaLinkContainer
  metaScriptContainer
  metaJsonLdContainer
  metaTagContainer
}`;

export const basicPageGql = `query($uri: String) {
  entry(
    section: ["basicPage"]
    uri: [$uri]
  ) {
    ${elementGql}
  }
}`;

export const basicPageGenerateGql = function(params = {}) {
  const offset = params.offset || '0';
  const limit = params.limit || 'null';

  return `query {
    entryCount(
      uri:":notempty:"
      section: ["basicPage"]
      limit: null
    )
    entries(
      uri:":notempty:"
      section: ["basicPage"]
      offset: ${offset}
      limit: ${limit}
    ) {
      sectionHandle
      siteId
      uri
      ${elementGql}
    }
  }`;
};
