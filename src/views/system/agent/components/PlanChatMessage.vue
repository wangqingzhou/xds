<template>
  <div>
    <ToolCallChatMessage name="plan" />
    <div class="plan-chat-message">
      <pre>{{ plan }}</pre>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ToolCallChatMessage from './ToolCallChatMessage.vue'

// 定义组件属性
const props = defineProps({
  plan: {
    type: String,
    required: true
  }
})
</script>
