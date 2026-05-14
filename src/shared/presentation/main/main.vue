<script setup>
import Toolbar from "@/shared/presentation/toolbar/toolbar.vue";
</script>

<template>
<div class="main-container">
  <Toolbar />
  <div class="main-content">
    <router-view />
  </div>
</div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #fafafa;
}
</style>