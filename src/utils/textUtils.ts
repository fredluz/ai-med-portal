// src/utils/textUtils.ts

/**
 * Generates an excerpt from Markdown content.
 * It performs basic stripping of markdown syntax.
 * @param markdownContent - The markdown string to generate an excerpt from.
 * @param maxLength - The maximum length of the excerpt. Defaults to 200.
 * @returns A string excerpt.
 */
export function generateExcerpt(markdownContent: string | null | undefined, maxLength: number = 200): string {
  if (!markdownContent) {
    return '';
  }

  // Basic stripping of markdown for excerpt
  let textContent = markdownContent
    .replace(/#+\s/g, '') // Remove headers (e.g., # Header)
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold (e.g., **bold**)
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italics (e.g., *italic*)
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove inline code and code blocks
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep link text (e.g., [link text](url))
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Remove images, keep alt text
    .replace(/-{3,}/g, '') // Remove horizontal rules
    .replace(/-\s\[\s\]\s/g, '') // Remove empty markdown checkboxes
    .replace(/-\s\[x\]\s/g, '') // Remove checked markdown checkboxes
    .replace(/^\s*>\s/gm, '') // Remove blockquotes
    .replace(/^\s*[-*+]\s/gm, '') // Remove list item markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces into one
    .trim();

  if (textContent.length <= maxLength) {
    return textContent;
  }
  return textContent.substring(0, maxLength).trim() + '...';
}
