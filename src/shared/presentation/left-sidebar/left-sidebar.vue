<script setup>
import { ref } from 'vue'
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const is_expanded = ref(false)

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
}
/**
 * Array of navbar options for the atelier's sidebar.
 */
const options = [
  { link: '/home', label: 'option.home', icon: 'pi pi-objects-column' },
  { link: '/work-orders', label: 'option.work-orders', icon: 'pi pi-wrench' },
  { link: '/telemetry', label: 'option.telemetry', icon: 'pi pi-chart-line' },
  { link: '/customers', label: 'option.customers', icon: 'pi pi-users' },
  { link: '/fleet/appointments', label: 'option.appointments', icon: 'pi pi-calendar' }, // Corrected
  { link: '/fleet/vehicles', label: 'option.vehicles', icon: 'pi pi-car' }, // Added
  { link: '/fleet/workbays', label: 'option.workbays', icon: 'pi pi-th-large' }, // Added
  { link: '/billing', label: 'option.billing', icon: 'pi pi-receipt' },
  { link: '/inventory', label: 'option.inventory', icon: 'pi pi-box' },
  { link: '/configuration', label: 'option.configuration', icon: 'pi pi-cog' },
]
</script>

<template>
<aside :class="{ 'is-expanded': is_expanded }">
  <div class="logo-container">
    <button type="button" class="arrow" aria-label="toggle sidebar" @click="ToggleMenu" :aria-expanded="is_expanded">
      <i :class="is_expanded ? 'pi pi-times sidebar-toggle-icon' : 'pi pi-bars sidebar-toggle-icon'"></i>
    </button>
    <p class="logo-text">atelier</p>
  </div>
  <div class="sidebar-divider"></div>
  <nav class="sidenav">
    <router-link
      v-for="option in options"
      :key="option.link"
      :to="option.link"
      class="sidenav-nav-item"
      active-class="active"
    >
      <i :class="option.icon"></i>
      <span class="sidenav-nav-label">{{ t(option.label) }}</span>
    </router-link>
  </nav>
</aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 45px);
  min-height: 100vh;
  /* allow rounded buttons and shadows to be visible instead of being clipped */
  overflow: visible;
  padding: 1.2rem 1rem;
  background-color: #fff;
  color: #212121;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(189, 189, 189, 0.3);

  transition: all 0.5s ease;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}

aside.is-expanded {
  width: calc(18rem);
}

aside.is-expanded .logo-text {
  display: flex;
}

.logo-container {
  display: flex;
  align-items: center;
}

.sidebar-divider {
  width: 100%;
  height: 1.5px;
  margin: 1rem 0;
  background: rgba(189, 189, 189, 0.3);
}

.logo-text {
  margin: 0 0 0 1rem;
  font-size: 30px;
  font-family: "Zizou Slab", serif;
  font-weight: Bold;
  color: #000;
  transform: translateY(-3px);
  display: none;
}

.arrow {
  background: #0071EB;
  min-height: 44px;
  min-width: 44px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #0071EB;
  transition: all 0.3s ease;
}

.sidebar-toggle-icon {
  color: #fff;
  font-size: 20px;
  transition: color 0.2s;
}

.arrow:hover {
  background: #B3D4F8;
  .sidebar-toggle-icon {
    color: #0071EB;
  }
}

.sidenav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0; /* add breathing room so the first/last buttons are not cut */
}

.sidenav::-webkit-scrollbar {
  width: 6px;
}

.sidenav::-webkit-scrollbar-track {
  background: transparent;
}

.sidenav::-webkit-scrollbar-thumb {
  background: rgba(189, 189, 189, 0.3);
  border-radius: 3px;
}

.sidenav-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: #757575;
  font-family: Arimo, sans-serif;
  font-size: 14px;
  transition: all 0.22s ease;
  text-align: left;
  white-space: nowrap;
  min-height: 44px;
  min-width: 44px;
  width: 44px;
  height: 44px;
  justify-content: center;
  overflow: visible;
  padding: 0;
  text-decoration: none;
}

.sidenav-nav-item i {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidenav-nav-label {
  opacity: 0;
  transition: opacity 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  display: none;
}

.sidenav-nav-item:hover {
  background: rgba(0, 113, 235, 0.08);
  color: #212121;
}

.sidenav-nav-item.active {
  background: #0071EB;
  color: #fff;
  box-shadow: 0 6px 18px rgba(0,113,235,0.18); /* subtle elevation so it doesn't look cut */
}

.sidenav-nav-item.active i {
  color: #fff;
}

.sidenav-nav-item.active:hover {
  background: #004FA6;
}

aside.is-expanded .sidenav-nav-item {
  padding: 0 1rem 0 1rem;
  justify-content: flex-start;
  width: 100%;
  min-width: auto;
}

aside.is-expanded .sidenav-nav-label {
  display: inline;
  opacity: 1;
}

</style>