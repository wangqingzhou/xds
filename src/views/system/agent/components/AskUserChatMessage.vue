<template>
  <div class="ask-user-chat-message">
    <div class="label-small">Question</div>
    <pre>{{ question }}</pre>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// 定义组件属性
const props = defineProps({
  question: {
    type: String,
    required: true
  }
})
</script>
