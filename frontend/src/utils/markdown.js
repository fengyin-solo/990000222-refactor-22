import { marked } from 'marked'

// 全站 Markdown 渲染统一配置，避免各处分别 setOptions 造成口径分叉
marked.setOptions({
  gfm: true,
  breaks: true
})

export const EMPTY_BODY_MESSAGE = '暂无内容'

const EMPTY_BODY_HTML = `<p class="article-body-empty">${EMPTY_BODY_MESSAGE}</p>`

/**
 * 将接口返回的正文归一化为字符串：
 * - 非字符串（null/undefined 等历史数据）按空正文处理
 * - 统一换行符，保证同一篇内容在任何系统上渲染结果一致
 */
export function normalizeBody(body) {
  if (typeof body !== 'string') return ''
  return body.replace(/\r\n?/g, '\n')
}

/**
 * 统一的正文渲染入口：
 * - 空正文（含纯空白）渲染为稳定的占位段落
 * - 其余正文交给 marked，GFM/长代码块均由同一份配置输出
 */
export function renderMarkdown(body) {
  const source = normalizeBody(body)
  if (!source.trim()) return EMPTY_BODY_HTML
  return marked.parse(source)
}
