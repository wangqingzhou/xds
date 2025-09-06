<template>
  <div id="app">
    <AppHeader />
    <div class="main-container">
      <AppSidebar />
      <main class="main-content">
        <AiAssistant />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "../../../components/layout/AppHeader.vue";
import AppSidebar from "../../../components/layout/AppSidebar.vue";
import AiAssistant from "../../../components/ai-assistant/AiAssistant.vue";
</script>

<style scoped>
.main-container {
  display: flex;
  height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  min-width: 0;
  background: #ffffff;
}

@media (max-width: 768px) {
  .main-container {
    height: calc(100vh - 60px);
  }
}
</style>
