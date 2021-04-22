// Test using `articleType`, then swap handle out

const elementGql = (handle = 'articleType') => {
  return `title
    postDate @formatDateTime(format: "F j, Y")
    dateUpdated @formatDateTime(format: "F j, Y")
    uri
    ... on articleSection_articleType_Entry {
      myCustomField
    }
    seomatic(asArray: true) {
      metaTitleContainer
      metaLinkContainer
      metaScriptContainer
      metaJsonLdContainer
      metaTagContainer
    }`
    .replace(/articleType/g, handle);
};

export const articleGql = (handle = 'articleType', aboutHandle = 'codeAbout') => {
  return `query articleGql($uri: String) {
    entry(type: "${handle}", uri: [$uri]) {
      ${elementGql(handle, aboutHandle)}
    }
  }`;
};

export const articleGenerateGql = (handle = 'articleType', aboutHandle = 'codeAbout') => {
  return `query {
    entryCount(
      limit: null
      type: ["${handle}"]
      uri:":notempty:"
    )
    entries(
      limit: null
      type: ["${handle}"]
      uri:":notempty:"
    ) {
      sectionHandle
      uri
      ${elementGql(handle, aboutHandle)}
    }
  }`;
};
