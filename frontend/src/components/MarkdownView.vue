<template>
  <!-- Single render target for article bodies: empty bodies, long code
       blocks and typography are handled here for every consumer. -->
  <div class="markdown-body" v-html="html"></div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps({
  body: {
    type: String,
    default: ''
  }
})

const html = computed(() => renderMarkdown(props.body))
</script>

<style scoped>
.markdown-body {
  line-height: 1.8;
  font-size: 16px;
}

.markdown-body :deep(.markdown-empty) {
  color: #909399;
}

.markdown-body :deep(h1) {
  font-size: 24px;
  margin: 24px 0 16px;
  color: #303133;
}

.markdown-body :deep(h2) {
  font-size: 20px;
  margin: 20px 0 12px;
  color: #303133;
}

.markdown-body :deep(h3) {
  font-size: 18px;
  margin: 16px 0 8px;
  color: #303133;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(pre) {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body :deep(code) {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #dcdfe6;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background-color: #f5f7fa;
}
</style>
