export const globalsGql = `query globalsGql {
  publicFiles: seomatic {
    frontendTemplateContainer
  }
  sitemapFiles: seomatic {
    sitemapIndexes(site: "default") {
      contents
    }
    sitemapStyles {
      contents
      filename
    }
    sitemaps(site: "default") {
      contents
      filename
    }
  }
}`;
