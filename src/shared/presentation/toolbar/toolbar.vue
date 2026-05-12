<script setup>
import { ref, computed } from 'vue'
import { Toolbar as PvToolbar, Button, Menu } from "primevue";

// Reactive state for notifications and user
const notificationCount = ref(0)
const currentUser = ref({
  name: 'Juan Carlos',
  email: 'juan@example.com'
})
const menuRef = ref(null)

// Computed properties
const userInitials = computed(() => {
  return currentUser.value.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
})

const hasNotifications = computed(() => notificationCount.value > 0)

// Menu items for user dropdown
const userMenuItems = [

]

const toggleUserMenu = (event) => {
  menuRef.value.toggle(event)
}
</script>

<template>
<pv-toolbar class="tool">
  <template #start>
    <!-- Left side can be used for breadcrumbs or page title -->
  </template>
  <template #end>
    <!-- Notifications bell -->
    <div class="toolbar-item notifications-wrapper">
      <button class="notification-button" type="button">
        <i class="pi pi-bell"></i>
        <span v-if="hasNotifications" class="notification-badge">{{ notificationCount }}</span>
      </button>
    </div>

    <!-- User profile dropdown -->
    <div class="toolbar-item user-wrapper">
      <button @click="toggleUserMenu" class="user-button" type="button">
        <div class="user-avatar">{{ userInitials }}</div>
        <span class="user-name">{{ currentUser.name }}</span>
        <i class="pi pi-chevron-down"></i>
      </button>
      <Menu ref="menuRef" :model="userMenuItems" :popup="true" />
    </div>
  </template>
</pv-toolbar>
</template>

<style scoped>
.tool {
  background-color: #fff;
  border-bottom: 2px solid rgba(189, 189, 189, 0.2);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbar-item {
  display: flex;
  align-items: center;
}

.notifications-wrapper {
  margin-right: 1.5rem;
}

.notification-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #212121;
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.notification-button:hover {
  background: rgba(0, 113, 235, 0.08);
  color: #0071EB;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #FF4444;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid #fff;
}

.user-wrapper {
  gap: 0;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #212121;
  font-family: Arimo, sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.user-button:hover {
  background: rgba(0, 113, 235, 0.08);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0071EB;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  flex-shrink: 0;
}

.user-name {
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-button i {
  font-size: 14px;
  color: #999;
  transition: transform 0.2s ease;
}

.user-button:hover i {
  color: #0071EB;
}
</style>