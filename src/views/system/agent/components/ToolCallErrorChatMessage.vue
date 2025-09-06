<template>
  <div class="tool-call-error-chat-message">
    <p class="label-small">{{ errorText }}</p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// 定义组件属性
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

// 错误文本映射
const toolErrorTextMap = {
  read_first_chunk: 'Error reading document',
  read_next_chunk: 'Error reading document',
  read_previous_chunk: 'Error reading document',
  replace_document: 'Error editing document',
  apply_diff: 'Error editing document',
  plan: 'Error updating action plan'
}

// 计算属性获取错误文本
const errorText = computed(() => {
  return toolErrorTextMap[props.name] || 'Tool call error'
})
</script>
