<template>
  <div class="tool-call-chat-message">
    <p class="label-small">{{ toolText }}</p>
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

// 工具文本映射
const toolTextMap = {
  read_first_chunk: 'Document read',
  read_next_chunk: 'Document read',
  read_previous_chunk: 'Document read',
  replace_document: 'Document edited',
  apply_diff: 'Document edited',
  plan: 'Action plan updated'
}

// 计算属性获取工具文本
const toolText = computed(() => {
  return toolTextMap[props.name] || 'Unknown tool call'
})
</script>
