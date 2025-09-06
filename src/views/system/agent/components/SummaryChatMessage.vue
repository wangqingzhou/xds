<template>
  <div class="summary-chat-message">
    <div class="label-small">Task Summary</div>
    <pre>{{ summary }}</pre>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// 定义组件属性
const props = defineProps({
  summary: {
    type: String,
    required: true
  }
})
</script>
