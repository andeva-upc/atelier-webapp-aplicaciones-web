<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Toolbar as PvToolbar, Menu, Button as PvButton, Avatar as PvAvatar } from 'primevue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Juan Carlos',
      email: 'juan@example.com'
    })
  },
  notificationCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['profile', 'logout', 'notifications'])

const { t, locale } = useI18n()
const languageMenuRef = ref(null)
const userMenuRef = ref(null)

const currentUser = computed(() => props.user)
const hasNotifications = computed(() => props.notificationCount > 0)
const currentLanguageLabel = computed(() => locale.value.toUpperCase())

const userInitials = computed(() => {
  return currentUser.value.name
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
})

const languageMenuItems = computed(() => [
  {
    label: 'Español',
    class: locale.value === 'es' ? 'menu-item-active' : '',
    command: () => {
      locale.value = 'es'
    }
  },
  {
    label: 'English',
    class: locale.value === 'en' ? 'menu-item-active' : '',
    command: () => {
      locale.value = 'en'
    }
  }
])

const userMenuItems = computed(() => [
  {
    label: t('toolbar.profile'),
    icon: 'pi pi-user',
    command: () => emit('profile')
  },
  {
    label: t('toolbar.logout'),
    icon: 'pi pi-sign-out',
    command: () => emit('logout')
  }
])

const toggleLanguageMenu = (event) => {
  languageMenuRef.value.toggle(event)
}

const toggleUserMenu = (event) => {
  userMenuRef.value.toggle(event)
}

const openNotifications = () => {
  emit('notifications')
}
</script>

<template>
<pv-toolbar class="tool">
  <template #start>
    <div></div>
  </template>
  <template #end>
    <div class="toolbar-item language-wrapper">
      <PvButton class="language-button" text @click="toggleLanguageMenu" aria-haspopup="true" :aria-label="t('toolbar.language')">
        <i class="pi pi-globe"></i>
        <span class="language-text">{{ currentLanguageLabel }}</span>
        <i class="pi pi-chevron-down"></i>
      </PvButton>
      <Menu ref="languageMenuRef" :model="languageMenuItems" :popup="true" appendTo="self" class="language-menu">
        <template #item="{ item, props }">
          <a v-bind="props.action" class="menu-item-content" :class="item.class">
            <span class="menu-text">{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </div>

    <div class="toolbar-item notifications-wrapper">
      <PvButton class="notification-button" text rounded @click="openNotifications" :aria-label="t('toolbar.notifications')">
        <i class="pi pi-bell"></i>
        <span v-if="hasNotifications" class="notification-dot"></span>
      </PvButton>
    </div>

    <div class="toolbar-item user-wrapper">
      <PvButton @click="toggleUserMenu" class="user-button" text aria-haspopup="true" :aria-label="t('toolbar.account')">
        <PvAvatar :label="userInitials" shape="circle" class="user-avatar" />
        <span class="user-name">{{ currentUser.name }}</span>
        <i class="pi pi-chevron-down"></i>
      </PvButton>
      <Menu ref="userMenuRef" :model="userMenuItems" :popup="true" appendTo="self" class="user-menu">
        <template #item="{ item, props }">
          <a v-bind="props.action" class="menu-item-content">
            <i :class="['menu-icon', item.icon]"></i>
            <span class="menu-text">{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </div>
  </template>
</pv-toolbar>
</template>

<style scoped>
.tool {
  background-color: #fff;
  border-bottom: 1px solid rgba(189, 189, 189, 0.35);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 78px;
}

.toolbar-item {
  display: flex;
  align-items: center;
  border-radius: 8px;
}

.language-wrapper {
  margin-right: 0.75rem;
}

.language-wrapper:hover {
  background-color: #B3D4F8;
}

.language-button {
  gap: 0.8rem;
  color: #202020;
  font-family: Arimo, sans-serif;
  padding: 0.45rem 0.75rem;
  border-radius: 12px;
}

.language-text {
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1;
}

.language-button .pi-globe,
.language-button .pi-chevron-down,
.user-button .pi-chevron-down {
  color: #8c99a8;
  font-size: 1.15rem;
}


.language-button:hover {
  background: #e9f0f8;
}

.language-button:hover .pi,
.language-button:hover .language-text {
  color: #0071eb;
}

.user-button:hover {
  background: #e9f0f8;
}

.user-button:hover .pi-chevron-down {
  color: #0071eb;
}

.notification-button:hover {
  background: #e9f0f8;
}

.notification-button:hover .pi-bell {
  color: #0071eb;
}

.notifications-wrapper {
  margin-right: 0.75rem;
}

.notifications-wrapper:hover {
  background-color: #B3D4F8;
}

.notification-button {
  background: transparent;
  font-size: 1.35rem;
  color: #212121;
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  border: 2px solid #fff;
}

.user-wrapper {
  gap: 0.15rem;
}

.user-wrapper:hover {
  background-color: #B3D4F8;
}

.user-button {
  gap: 0.75rem;
  background: transparent;
  color: #212121;
  font-family: Arimo, sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
  padding: 0.4rem 0.65rem;
  border-radius: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #0071EB;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-name {
  font-size: 1.2rem;
  line-height: 1;
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.language-menu.p-menu),
:deep(.user-menu.p-menu) {
  font-family: Arimo, sans-serif;
  border: none;
  border-radius: 14px;
  background: #f3f3f6;
  padding: 0.55rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  margin-top: 0.4rem;
}

:deep(.language-menu.p-menu) {
  min-width: 145px;
}

:deep(.user-menu.p-menu) {
  min-width: 180px;
}

:deep(.language-menu .p-menu-list),
:deep(.user-menu .p-menu-list) {
  display: flex;
  flex-direction: column;
  gap: 0;
}

:deep(.language-menu .p-menu-item-link),
:deep(.user-menu .p-menu-item-link) {
  border-radius: 8px;
  padding: 0.95rem 0.95rem;
  background: transparent;
  min-height: 56px;
}

:deep(.language-menu .p-menu-item + .p-menu-item),
:deep(.user-menu .p-menu-item + .p-menu-item) {
  border-top: 1px solid #ececf0;
}

:deep(.language-menu .p-menu-item-label),
:deep(.user-menu .p-menu-item-label) {
  font-size: 1.05rem;
  color: #111827;
  font-weight: 500;
}

:deep(.user-menu .p-menu-item-icon) {
  color: #000;
  font-size: 1rem;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  border-radius: 9px;
  padding: 0.95rem 0.95rem;
  min-height: 52px;
  color: #111827;
  text-decoration: none;
  transition: background 0.2s ease;
}

.menu-text {
  font-size: 1.05rem;
  font-weight: 500;
}

.menu-icon {
  color: #000;
  font-size: 1rem;
}

.menu-item-content:hover {
  background: #e9edf3;
}

.menu-item-content.menu-item-active {
  background: #d8d8dd;
}

:deep(.language-menu .p-menu-item-link:hover),
:deep(.user-menu .p-menu-item-link:hover) {
  background: #e9edf3;
}

@media (max-width: 768px) {
  .tool {
    padding: 0.65rem 0.8rem;
  }

  .language-text,
  .user-name {
    display: none;
  }

  .language-button,
  .user-button {
    gap: 0.45rem;
    padding: 0.3rem 0.35rem;
  }
}
</style>