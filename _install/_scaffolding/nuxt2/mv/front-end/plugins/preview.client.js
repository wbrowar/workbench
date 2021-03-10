export default async function({ enablePreview, query }) {
  if (query.CraftPreviewSlug) {
    await enablePreview();
  }
}
