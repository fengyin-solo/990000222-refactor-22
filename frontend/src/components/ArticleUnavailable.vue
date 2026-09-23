<template>
  <el-result
    :icon="notFound ? 'info' : 'warning'"
    :title="notFound ? '文章不存在' : '正文读取失败'"
    :sub-title="notFound ? '该文章可能已被删除，返回列表看看其他内容吧。' : '网络或服务暂时不可用，请稍后重试。'"
    class="article-unavailable"
  >
    <template #extra>
      <el-button v-if="!notFound" type="primary" @click="emit('retry')">重试</el-button>
      <el-button @click="emit('back')">返回列表</el-button>
    </template>
  </el-result>
</template>

<script setup>
// 文章详情读取失败后的统一占位：
// - 404：文章不存在，仅提供返回入口
// - 其他错误：提供重试与返回入口，不再与“不存在”混用
defineProps({
  notFound: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry', 'back'])
</script>
