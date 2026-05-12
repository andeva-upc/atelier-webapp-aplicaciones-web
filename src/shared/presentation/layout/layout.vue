<script setup>
import LeftSidebar from "@/shared/presentation/left-sidebar/left-sidebar.vue";
import Main from  "@/shared/presentation/main/main.vue";
</script>

<template>
  <div class="layout-container">
    <LeftSidebar />
    <Main />
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
}
</style>