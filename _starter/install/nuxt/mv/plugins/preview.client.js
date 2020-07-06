export default async function ({ $config, enablePreview, query }) {
  if (query.CraftPreviewSlug && $config.livePreview) {
    await enablePreview();
  }
}
