<template>
  <div class="business-use-cases-menu">
    <div class="label-large">Predefined use cases</div>
    <select 
      class="use-case-select" 
      :value="currentUseCase" 
      @change="handleUseCaseChange"
    >
      <option 
        v-for="useCase in businessUseCases" 
        :key="useCase.name" 
        :value="useCase.name"
      >
        {{ useCase.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { businessUseCases } from '../constants/business-use-cases.js'

// 状态管理
const currentUseCase = ref(businessUseCases[0].name)

// 注入上下文
const userMessageContext = inject('UserMessageContext')
const aiAgentContext = inject('AiAgentContext')

// 处理用例变更
const handleUseCaseChange = (event) => {
  const selectedUseCaseName = event.target.value
  const useCase = businessUseCases.find(uc => uc.name === selectedUseCaseName)
  
  aiAgentContext.provider.reset()
  aiAgentContext.editor.chain()
    .setContent(useCase.editorContent)
    .stopTrackingAiChanges()
    .run()
  
  userMessageContext.addUserMessage(useCase.prompt)
  currentUseCase.value = useCase.name
}
</script>
