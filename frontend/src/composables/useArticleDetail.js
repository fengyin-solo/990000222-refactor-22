import { ref, watch } from 'vue'
import { fetchArticleDetail, getCachedArticleDetail } from '../api/articles'

// Shared detail-loading flow: serves the cached detail when re-entering
// the same article and exposes one set of states (loading / notFound /
// loadError) so every consumer presents failures the same way.
export function useArticleDetail(getId) {
  const article = ref(null)
  const loading = ref(false)
  const notFound = ref(false)
  const loadError = ref(null)

  let requestSeq = 0

  async function load(id) {
    const seq = ++requestSeq
    notFound.value = false
    loadError.value = null

    const cached = getCachedArticleDetail(id)
    if (cached) {
      article.value = cached
      loading.value = false
      return
    }

    article.value = null
    loading.value = true
    try {
      const data = await fetchArticleDetail(id)
      if (seq !== requestSeq) return
      article.value = data
    } catch (error) {
      if (seq !== requestSeq) return
      article.value = null
      if (error.response?.status === 404) {
        notFound.value = true
      } else {
        loadError.value = error
        console.error('Failed to fetch article:', error)
      }
    } finally {
      if (seq === requestSeq) {
        loading.value = false
      }
    }
  }

  watch(
    getId,
    (id) => {
      if (id !== undefined && id !== null && id !== '') {
        load(id)
      }
    },
    { immediate: true }
  )

  return { article, loading, notFound, loadError }
}
