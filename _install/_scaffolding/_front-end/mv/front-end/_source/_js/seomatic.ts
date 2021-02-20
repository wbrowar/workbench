// Based on https://github.com/ben-rogerson/nuxt-seomatic-meta/blob/master/lib/plugin.js

import { log } from 'JS/global';

export function gqlToObject(data: any) {
  log('SEOmatic GraphQL to Object', data);

  // Convert the graphql JSON data to an object so we can work with it
  const {
    metaTitleContainer: {
      title: { title },
    },
    metaTagContainer,
    metaLinkContainer,
    metaScriptContainer,
    metaJsonLdContainer,
  } = Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = JSON.parse(value);
    return acc;
  }, {});

  // Flatten metaTagContainer values into string
  const meta = metaTagContainer
    ? Object.values(metaTagContainer).reduce((flat, next) => {
        if (next.name === 'description') {
          // Override description tag with updated description
          next.hid = 'description';
        }
        return flat.concat(next);
      }, [])
    : null;

  // Flatten metaLinkContainer values into string
  const link = metaLinkContainer
    ? Object.values(metaLinkContainer).reduce((flat, next) => flat.concat(next), [])
    : null;

  // Convert script data to <script>..</script>
  const metaScripts = metaScriptContainer
    ? Object.values(metaScriptContainer).map(({ script }) => ({
        innerHTML: script,
      }))
    : [];

  // Convert JsonLd to <script type="application/ld+json">...</script>
  const jsonLd = metaJsonLdContainer
    ? Object.entries(metaJsonLdContainer).map((value) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(value[1]),
      }))
    : [];

  // Combine processed script data
  const script = [...metaScripts, ...jsonLd];

  return {
    ...(title && { title }),
    ...(meta && { meta }),
    ...(link && { link }),
    script,
    __dangerouslyDisableSanitizers: ['script'],
  };
}
