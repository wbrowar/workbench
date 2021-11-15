import { LinkField_Link } from 'Types/automated/generated-craft';

export default function useLinkFieldAttributes() {
  const linkFieldToButtonAttributes = (field: LinkField_Link) => {
    const attributes: any = {
      arrow: true,
      href: null,
      newWindow: field.target === '_blank',
      theme: 'cta',
    };
    const customAttributes: any = {};

    if (field.ariaLabel) {
      customAttributes['aria-label'] = field.ariaLabel;
    }
    if (field.customText) {
      attributes.labelText = field.customText;
    } else if (field.text) {
      attributes.labelText = field.text;
    } else if (field.element?.title) {
      attributes.labelText = field.element.title;
    }
    if (field.title) {
      customAttributes.title = field.title;
    }
    if (field.element?.uri) {
      attributes.href = field.element.uri;
      if (field.url) {
        const elementUriQuery = field.url.split('?');
        if (elementUriQuery[1]) {
          attributes.href += `?${elementUriQuery[1]}`;
        }
        const elementUriHash = field.url.split('#');
        if (elementUriHash[1]) {
          attributes.href += `#${elementUriHash[1]}`;
        }
      }
    } else if (field.url) {
      attributes.href = field.url;
    }

    if (Object.keys(customAttributes).length) {
      attributes.customAttributes = customAttributes;
    }

    return attributes;
  };

  return {
    linkFieldToButtonAttributes,
  };
}
