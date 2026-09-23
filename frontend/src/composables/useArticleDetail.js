import { ref, computed, watch } from 'vue'
import { useArticleStore } from '../stores/article'

/**
 * 文章正文读取的共用流程：
 * - 统一通过 article store 获取/缓存详情
 * - 统一收敛三种展示状态：加载中、文章不存在(404)、读取失败(可重试)
 * - 路由参数变化（同一组件内切换文章）时自动重新读取
 */
export function useArticleDetail(idRef) {
  const articleStore = useArticleStore()

  const article = ref(articleStore.getCachedArticle(idRef.value) || null)
  const loading = ref(!article.value)
  const errorCode = ref(null)

  const notFound = computed(() => errorCode.value === 404)
  const failed = computed(() => loading.value === false && !article.value && errorCode.value !== 404)

  async function load({ force = false } = {}) {
    const id = idRef.value
    if (!id) return

    const cached = articleStore.getCachedArticle(id)
    if (cached && !force) {
      article.value = cached
      errorCode.value = null
      loading.value = false
      return
    }

    loading.value = true
    try {
      article.value = await articleStore.fetchArticle(id, { force })
      errorCode.value = null
    } catch (error) {
      article.value = null
      errorCode.value = error.response?.status ?? 'network'
    } finally {
      loading.value = false
    }
  }

  function retry() {
    return load({ force: true })
  }

  watch(idRef, (newId, oldId) => {
    // 切换到另一篇文章时先清掉上一篇的状态，避免旧内容在遮罩下短暂残留
    if (oldId !== undefined && String(newId) !== String(oldId)) {
      article.value = articleStore.getCachedArticle(newId) || null
      errorCode.value = null
      loading.value = !article.value
    }
    load()
  }, { immediate: true })

  return {
    article,
    loading,
    errorCode,
    notFound,
    failed,
    load,
    retry
  }
}
