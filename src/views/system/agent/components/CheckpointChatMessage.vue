<template>
  <div class="checkpoint-chat-message">
    <span class="label">🎯 Checkpoint set</span>
    <button 
      type="button" 
      @click="handleRestore"
    >
      Restore
    </button>
  </div>
</template>

<script setup>
import { defineProps, inject } from 'vue'

// 注入AI代理上下文
const aiAgentContext = inject('AiAgentContext')

// 定义组件属性
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

// 处理恢复检查点
const handleRestore = () => {
  aiAgentContext.provider.restoreCheckpoint(props.message.checkpoint)
}
</script>
