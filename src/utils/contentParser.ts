import type { Article } from './supabaseClient'

export const parseOriginalContent = (article: Article): string => {
  if (!article.raw_json_content?.mainContentHtml?.sections) {
    return 'No content available'
  }

  const sections = article.raw_json_content.mainContentHtml.sections
  let content = ''

  // Add title if available
  const title = article.raw_json_content.title || article.raw_json_content.mainContentHtml.articleTitle
  if (title && title !== 'Unknown Title') {
    content += `# ${title}\n\n`
  }

  // Process each section
  Object.entries(sections).forEach(([sectionName, sectionItems]) => {
    // Skip certain sections that might not be relevant
    if (sectionName.includes('Review Date') || sectionName.includes('Related MedlinePlus')) {
      return
    }

    // Add section header
    content += `## ${sectionName}\n\n`

    // Process items in the section
    sectionItems.forEach(item => {
      if (item.type === 'paragraph') {
        content += `${item.text}\n\n`
      } else if (item.type === 'list') {
        if (item.items) {
          item.items.forEach(listItem => {
            if (typeof listItem === 'string') {
              content += `• ${listItem}\n`
            } else if (typeof listItem === 'object' && listItem.text) {
              content += `• ${listItem.text}\n`
            }
          })
          content += '\n'
        }
      }
    })
  })

  return content.trim()
}

export const formatArticleTitle = (article: Article): string => {
  let title = 'Untitled Article';

  if (article.content_en_rewritten) {
    title = article.content_en_rewritten.substring(0, 100);
    if (article.content_en_rewritten.length > 100) {
      title += '...';
    }
  } else if (article.raw_json_content?.title && article.raw_json_content.title !== 'Unknown Title') {
    title = article.raw_json_content.title;
  } else if (article.raw_json_content?.mainContentHtml?.articleTitle) {
    title = article.raw_json_content.mainContentHtml.articleTitle;
  }
  
  return title.replace(/: MedlinePlus Medical Encyclopedia$/, '').trim();
}

export const formatSourceUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}
