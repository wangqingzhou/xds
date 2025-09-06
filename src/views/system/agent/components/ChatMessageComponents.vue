<template>
  <!-- 公共组件不会直接渲染，供其他组件导入使用 -->
</template>

<script setup>
import { inject } from 'vue'

// 注入AI代理上下文
const aiAgentContext = inject('AiAgentContext')
</script>
