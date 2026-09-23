<template>
  <div class="reading-metrics" :class="{ 'reading-metrics--empty': metrics.isEmpty }">
    <span class="reading-metrics__item">
      {{ metrics.isEmpty ? '暂无正文' : `${metrics.charCount} 字` }}
    </span>
    <span v-if="!metrics.isEmpty" class="reading-metrics__item">
      预计阅读 {{ metrics.readingMinutes }} 分钟
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getReadingMetrics } from '../utils/reading'

// 阅读辅助指标统一由正文派生，各处只展示同一份结果
const props = defineProps({
  body: {
    type: String,
    default: ''
  }
})

const metrics = computed(() => getReadingMetrics(props.body))
</script>

<style scoped>
.reading-metrics {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #909399;
  font-size: 13px;
  margin-bottom: 16px;
}

.reading-metrics__item::before {
  content: '·';
  margin-right: 12px;
  color: #c0c4cc;
}

.reading-metrics__item:first-child::before {
  content: '';
  margin-right: 0;
}

.reading-metrics--empty {
  font-style: italic;
}
</style>
