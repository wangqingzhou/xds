<template>
  <component 
    :is="getComponent()" 
    :message="message" 
    :plan="message.arguments?.plan"
    :question="message.arguments?.question"
    :summary="message.arguments?.summary"
    :name="message.toolName"
  />
</template>

<script setup>
import { defineProps, computed } from 'vue'
import AiChatMessage from './AiChatMessage.vue'
import UserChatMessage from './UserChatMessage.vue'
import CheckpointChatMessage from './CheckpointChatMessage.vue'
import RejectionChatMessage from './RejectionChatMessage.vue'
import SummaryChatMessage from './SummaryChatMessage.vue'
import ToolCallChatMessage from './ToolCallChatMessage.vue'
import ToolCallErrorChatMessage from './ToolCallErrorChatMessage.vue'
import PlanChatMessage from './PlanChatMessage.vue'
import AskUserChatMessage from './AskUserChatMessage.vue'

// 定义组件属性
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

// 根据消息类型返回相应的组件
const getComponent = computed(() => {
  switch (props.message.type) {
    case 'ai':
      return AiChatMessage
    case 'user':
      return UserChatMessage
    case 'checkpoint':
      return CheckpointChatMessage
    case 'toolCall':
      switch (props.message.toolName) {
        case 'plan':
          return PlanChatMessage
        case 'ask_user':
          return AskUserChatMessage
        case 'finish_with_summary':
          return SummaryChatMessage
        default:
          return ToolCallChatMessage
      }
    case 'toolCallResult':
      if (props.message.isError) {
        return ToolCallErrorChatMessage
      }
      return null
    default:
      return {
        template: '<div>Unknown message type</div>'
      }
  }
})
</script>
