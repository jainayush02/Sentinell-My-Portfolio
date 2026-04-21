const ALLOWED_TAGS = new Set([
  'a',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'u',
  'ul',
]);

const ALLOWED_ATTRIBUTES = new Map<string, Set<string>>([
  ['a', new Set(['href'])],
]);

function isSafeHref(value: string) {
  if (!value) {
    return false;
  }

  if (value.startsWith('#') || value.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeElement(element: Element) {
  const tagName = element.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    const parent = element.parentNode;
    const childNodes = Array.from(element.childNodes);
    element.replaceWith(...childNodes);
    if (parent) {
      childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          sanitizeElement(child as Element);
        }
      });
    }
    return;
  }

  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase();
    const allowedForTag = ALLOWED_ATTRIBUTES.get(tagName);
    const isAllowed = allowedForTag?.has(name) ?? false;

    if (!isAllowed || name.startsWith('on')) {
      element.removeAttribute(attribute.name);
    }
  }

  if (tagName === 'a') {
    const href = element.getAttribute('href') ?? '';
    if (!isSafeHref(href)) {
      element.removeAttribute('href');
    } else {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }
  }

  Array.from(element.children).forEach(sanitizeElement);
}

export function sanitizeHtml(html: string) {
  if (!html) {
    return '';
  }

  if (typeof window === 'undefined') {
    return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;

  if (!root) {
    return '';
  }

  Array.from(root.children).forEach(sanitizeElement);
  return root.innerHTML;
}
