import { defineStore } from 'pinia'
import api from '../api'

/**
 * 文章详情缓存：
 * - 重新进入文章时沿用同一份详情，不重复请求
 * - 同一篇文章的并发读取合并为一次请求
 * - 保存/删除后统一失效，保证再次进入时拿到最新内容
 */
export const useArticleStore = defineStore('article', () => {
  const cache = new Map()
  const pending = new Map()

  function getCachedArticle(id) {
    return cache.get(String(id)) || null
  }

  function fetchArticle(id, { force = false } = {}) {
    const key = String(id)

    if (!force) {
      const cached = cache.get(key)
      if (cached) return Promise.resolve(cached)

      const inFlight = pending.get(key)
      if (inFlight) return inFlight
    }

    const request = api
      .get(`/articles/${key}`)
      .then((response) => {
        cache.set(key, response.data)
        return response.data
      })
      .finally(() => {
        pending.delete(key)
      })

    pending.set(key, request)
    return request
  }

  function setArticle(article) {
    if (article?.id == null) return
    cache.set(String(article.id), article)
  }

  function invalidateArticle(id) {
    cache.delete(String(id))
  }

  return {
    getCachedArticle,
    fetchArticle,
    setArticle,
    invalidateArticle
  }
})
