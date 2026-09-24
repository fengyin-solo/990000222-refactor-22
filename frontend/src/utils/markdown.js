import { marked } from 'marked'

// Single place that configures the markdown renderer used by both
// the article detail page and the editor preview.
marked.setOptions({
  breaks: true,
  gfm: true
})

const EMPTY_BODY_HTML = '<p class="markdown-empty">暂无内容</p>'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Render an article body to HTML. Empty or missing bodies always produce
// the same placeholder, and a parser failure falls back to the escaped
// source instead of crashing the view.
export function renderMarkdown(body) {
  const source = typeof body === 'string' ? body : ''
  if (!source.trim()) {
    return EMPTY_BODY_HTML
  }
  try {
    return marked.parse(source)
  } catch (error) {
    console.error('Failed to render markdown:', error)
    return `<pre>${escapeHtml(source)}</pre>`
  }
}

// Reading-assist metrics derived from the same body, so every place that
// shows an article agrees on word count and estimated reading time.
export function getReadingMetrics(body) {
  const source = typeof body === 'string' ? body : ''
  // Ignore fenced code blocks and whitespace so the estimate tracks readable text.
  const readable = source.replace(/```[\s\S]*?```/g, ' ')
  const wordCount = readable.replace(/\s/g, '').length
  const readingMinutes = wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / 400))
  return { wordCount, readingMinutes }
}
