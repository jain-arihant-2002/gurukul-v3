// lib/security.ts
import sanitizeHtml from 'sanitize-html';

export function sanitize(dirty: string): string {
  const clean = sanitizeHtml(dirty, {
    allowedTags: [
      // From Tiptap StarterKit
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "ul", "ol",
      "li", "b", "i", "strong", "em", "s", "code", "pre", "hr", "br",
      // From other extensions
      "a",        // for Link extension
      "u",        // for Underline extension
      "img",      // for Image extension
      "div",      // Tiptap often wraps paragraphs in divs
    ],

    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'], // Allowing rel for security (e.g., 'noopener noreferrer')
      img: ['src', 'alt', 'title', 'width', 'height'], // For the Image extension
      p: ['style'],
      h1: ['style'],
      h2: ['style'],
      h3: ['style'],
      h4: ['style'],
    },

    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^center$/, /^right$/, /^justify$/],
      },
    },

    // 4. === Allowed URL Schemes ===
    // This allows for standard web links and base64 encoded images, which  image upload logic uses.
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel', 'data'],

    selfClosing: [ 'img', 'br', 'hr' ],

    // 6. === Transform Tags ===
    // A security best-practice. For links, add rel="noopener noreferrer" to
    // prevent security vulnerabilities associated with opening new tabs.
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },

    // This prevents attacks like <a href="javascript:alert('XSS')">
    allowProtocolRelative: false,
  });

  return clean;
}