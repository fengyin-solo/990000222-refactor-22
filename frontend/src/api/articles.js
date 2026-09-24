import api from './index'

// In-memory detail cache so re-entering an article reuses the same detail
// instead of refetching. Entries are invalidated on edit and delete.
const detailCache = new Map()
const pendingRequests = new Map()

function toKey(id) {
  return String(id)
}

export function getCachedArticleDetail(id) {
  return detailCache.get(toKey(id)) || null
}

export async function fetchArticleDetail(id, { force = false } = {}) {
  const key = toKey(id)
  if (!force) {
    if (detailCache.has(key)) {
      return detailCache.get(key)
    }
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key)
    }
  }

  const request = api
    .get(`/articles/${key}`)
    .then((response) => {
      detailCache.set(key, response.data)
      pendingRequests.delete(key)
      return response.data
    })
    .catch((error) => {
      pendingRequests.delete(key)
      throw error
    })

  pendingRequests.set(key, request)
  return request
}

export function invalidateArticleDetail(id) {
  detailCache.delete(toKey(id))
}

export async function createArticle(articleData) {
  const response = await api.post('/articles', articleData)
  return response.data
}

export async function updateArticle(id, articleData) {
  const response = await api.put(`/articles/${toKey(id)}`, articleData)
  detailCache.set(toKey(id), response.data)
  return response.data
}

export async function deleteArticle(id) {
  await api.delete(`/articles/${toKey(id)}`)
  invalidateArticleDetail(id)
}
