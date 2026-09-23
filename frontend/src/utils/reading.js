// 中文阅读速度约为每分钟 300~500 字，取中间值作为估算基准
const READING_SPEED_PER_MINUTE = 400

const CJK_CHAR_RE = /[㐀-鿿豈-﫿]/g
const LATIN_WORD_RE = /[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g

/**
 * 由正文统一派生阅读辅助指标，渲染方只消费结果，不再各自计算。
 * - wordCount：中日韩字符按字计，拉丁字符按单词计
 * - charCount：去除空白后的字符数，用于“字数”展示
 * - readingMinutes：预计阅读分钟数；空正文为 0，展示方统一显示“不足 1 分钟”
 */
export function getReadingMetrics(body) {
  const source = typeof body === 'string' ? body : ''
  const cjkChars = source.match(CJK_CHAR_RE) || []
  const latinWords = source.match(LATIN_WORD_RE) || []

  const wordCount = cjkChars.length + latinWords.length
  const charCount = source.replace(/\s/g, '').length
  const readingMinutes =
    wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / READING_SPEED_PER_MINUTE))

  return {
    wordCount,
    charCount,
    readingMinutes,
    isEmpty: source.trim().length === 0
  }
}
