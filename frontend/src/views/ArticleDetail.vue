<template>
  <div class="article-detail" v-loading="loading">
    <template v-if="article">
      <el-card>
        <template #header>
          <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <span class="article-date">
                发布于 {{ formatDate(article.created_at) }}
              </span>
              <span v-if="article.updated_at !== article.created_at" class="article-date">
                更新于 {{ formatDate(article.updated_at) }}
              </span>
              <span v-if="readingMetrics" class="article-date">
                约 {{ readingMetrics.wordCount }} 字 · 预计阅读 {{ readingMetrics.readingMinutes }} 分钟
              </span>
            </div>
            <div class="article-tags">
              <el-tag v-for="tag in article.tags" :key="tag" size="small">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </template>

        <MarkdownView :body="article.body" />
      </el-card>

      <div class="back-button">
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
      </div>
    </template>

    <el-empty v-if="!loading && !article" :description="emptyDescription" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import MarkdownView from '../components/MarkdownView.vue'
import { useArticleDetail } from '../composables/useArticleDetail'
import { getReadingMetrics } from '../utils/markdown'

const route = useRoute()
const router = useRouter()

const { article, loading, notFound } = useArticleDetail(() => route.params.id)

const readingMetrics = computed(() => {
  if (!article.value) return null
  const metrics = getReadingMetrics(article.value.body)
  return metrics.wordCount > 0 ? metrics : null
})

const emptyDescription = computed(() =>
  notFound.value ? '文章不存在' : '加载失败，请稍后重试'
)

function goBack() {
  router.push('/')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 20px;
}

.article-header {
  margin-bottom: 20px;
}

.article-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 12px;
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.article-date {
  color: #909399;
  font-size: 14px;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.back-button {
  margin-top: 20px;
}
</style>
