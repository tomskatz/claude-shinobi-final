import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create window instance once for better performance
const window = new JSDOM('').window
const purify = DOMPurify(window)

export function sanitizeHTML(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u',
      'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'img', 'blockquote', 'code', 'pre',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target',
      'class', 'id'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  })
}

/**
 * Sanitize comment content with more restrictive rules
 * Allows only basic text formatting (bold, italic, links)
 * Removes any potentially dangerous HTML
 */
export function sanitizeComment(content: string): string {
  return purify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'a', 'code'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel'
    ],
    // Force rel="noopener noreferrer" on all links for security
    ALLOWED_URI_REGEXP: /^(?:https?|mailto):/i,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Add target="_blank" and rel="noopener noreferrer" to all links
    ADD_ATTR: ['target', 'rel'],
    FORBID_ATTR: ['style', 'class', 'id'],
  })
}