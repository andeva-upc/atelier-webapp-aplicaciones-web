import './assets/base.css';

import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import pinia from './pinia.js';
import router from './router/index.js';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import { PrimeIcons } from '@primevue/core/api';
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Chip,
    Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable,
    Dialog,
    DialogService,
    Divider,
    Drawer,
    FileUpload,
    FloatLabel,
    IconField,
    InputIcon,
    InputNumber,
    InputText,
    Menu,
    Rating,
    Row,
    Select,
    SelectButton,
    Tag,
    Toast,
    Textarea,
    ToastService,
    Toolbar,
    Tooltip
} from "primevue"

createApp(App)
    .use(i18n)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.my-app-dark',
            }
        }
    })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-avatar', Avatar)
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-checkbox', Checkbox)
    .component('pv-chip', Chip)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-divider', Divider)
    .component('pv-drawer', Drawer)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-number', InputNumber)
    .component('pv-input-text', InputText)
    .component('pv-menu', Menu)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-tag', Tag)
    .component('pv-toast', Toast)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-tooltip', Tooltip)
    .use(pinia)
    .use(router)
    .mount('#app')
