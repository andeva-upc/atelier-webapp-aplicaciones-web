<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { WorkBay, BayStatus } from '../../domain/model/workbay.entity.js';
import { environment } from '../../../environments/environment.js'; // Corrected import path
import axios from 'axios';

const props = defineProps({
  visible: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  workBay: {
    type: Object,
    default: null
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'save']);
const { t } = useI18n();

const branches = ref([]);

const form = reactive({
  branchId: '',
  internalNumber: 0,
  status: BayStatus.VACANT
});

const isEditMode = computed(() => props.mode === 'edit');

const isFormValid = computed(() => {
  return form.branchId
      && form.internalNumber > 0
      && form.status;
});

const resetForm = () => {
  form.branchId = '';
  form.internalNumber = 0;
  form.status = BayStatus.VACANT;
};

const patchForm = () => {
  if (!props.workBay) {
    resetForm();
    return;
  }

  form.branchId = props.workBay.branchId || '';
  form.internalNumber = props.workBay.internalNumber || 0;
  form.status = props.workBay.status || BayStatus.VACANT;
};

const loadFormOptions = async () => {
  const baseUrl = environment.platformProviderApiBaseUrl;

  const branchesResponse = await axios.get(`${baseUrl}${environment.platformProviderBranchesEndpointPath}`);
  const rawBranches = toArray(branchesResponse);

  branches.value = rawBranches
      .filter((branch) => !branch.deleted_at)
      .map((branch) => ({
        id: branch.id,
        name: branch.branch_name
      }));

  patchForm();
};

const toArray = (response) => {
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  return [];
};

watch(
    () => [props.visible, props.workBay, props.mode],
    () => {
      if (props.visible) {
        patchForm();
      }
    },
    { immediate: true }
);

const close = () => {
  emit('update:visible', false);
};

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `workbay-${Date.now()}`;
};

const handleSubmit = () => {
  if (!isFormValid.value || props.saving) return;

  const entity = new WorkBay(
      props.workBay?.id || createId(),
      form.branchId,
      form.status,
      form.internalNumber
  );

  emit('save', entity);
};

onMounted(async () => {
  await loadFormOptions();
});
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :modal="true"
      class="workbay-dialog"
      :style="{ width: '680px' }"
      :draggable="false"
      :closable="true"
      :showHeader="true"
      appendTo="body"
  >
    <template #header>
      <h2 class="dialog-title">
        {{ isEditMode ? t('workbays.form.edit_title') : t('workbays.form.create_title') }}
      </h2>
    </template>

    <form class="workbay-form" @submit.prevent="handleSubmit">
      <label class="form-field form-field-full">
        <span>{{ t('workbays.fields.branch') }} *</span>
        <select v-model="form.branchId">
          <option value="">{{ t('workbays.placeholders.select_branch') }}</option>
          <option
              v-for="branch in branches"
              :key="branch.id"
              :value="branch.id"
          >
            {{ branch.name }}
          </option>
        </select>
      </label>

      <label class="form-field form-field-full">
        <span>{{ t('workbays.fields.internal_number') }} *</span>
        <input
            v-model="form.internalNumber"
            type="number"
            :placeholder="t('workbays.placeholders.internal_number')"
        />
      </label>

      <label class="form-field form-field-full">
        <span>{{ t('workbays.fields.status') }} *</span>
        <select v-model="form.status">
          <option :value="BayStatus.VACANT">{{ t('workbays.status.vacant') }}</option>
          <option :value="BayStatus.OCCUPIED">{{ t('workbays.status.occupied') }}</option>
          <option :value="BayStatus.NOT_AVAILABLE">{{ t('workbays.status.not_available') }}</option>
        </select>
      </label>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="close">
          {{ t('workbays.actions.cancel') }}
        </button>

        <button type="submit" class="btn-primary" :disabled="!isFormValid || saving">
          {{ isEditMode ? t('workbays.actions.save_changes') : t('workbays.actions.create') }}
        </button>
      </div>
    </form>
  </pv-dialog>
</template>

<style scoped>
:global(.workbay-dialog.p-dialog) {
  background: #ffffff !important;
  border-radius: 28px !important;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28) !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden !important;
}

:global(.workbay-dialog .p-dialog-header) {
  background: #ffffff !important;
  padding: 2rem 2.5rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:global(.workbay-dialog .p-dialog-content) {
  background: #ffffff !important;
  padding: 2rem 2.5rem 2.5rem !important;
}

:global(.workbay-dialog .p-dialog-footer) {
  background: #f8fafc !important;
  padding: 1.5rem 2.5rem !important;
  border-top: 1px solid #f1f5f9 !important;
}

.dialog-title {
  margin: 0;
  color: #0f172a;
  font-family: 'Mona Sans', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
}

.workbay-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  font-family: 'Mona Sans', sans-serif;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
}

.form-field,
.form-field-full {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.form-field-full {
  grid-column: 1 / -1;
}

.form-field span,
.form-field-full span {
  color: #0f172a;
  font-family: 'Arimo', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
}

.form-field input,
.form-field select,
.form-field textarea,
.form-field-full input,
.form-field-full select,
.form-field-full textarea {
  width: 100%;
  min-width: 0;
  height: 52px;
  padding: 0 1rem;
  border: 1px solid #d6dbe3;
  border-radius: 14px;
  background: #f7faff;
  color: #0f172a;
  font-family: 'Arimo', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.form-field textarea,
.form-field-full textarea {
  height: 84px;
  padding-top: 0.9rem;
  line-height: 1.35;
  resize: none;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus,
.form-field-full input:focus,
.form-field-full select:focus,
.form-field-full textarea:focus {
  border-color: #0071EB;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 113, 235, 0.12);
}

.form-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.9rem;
  margin-top: 0.75rem;
}

.btn-secondary,
.btn-primary {
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: none;
  font-family: 'Mona Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
}

.btn-secondary {
  background: #ffffff;
  color: #475569;
  border: 1px solid #d9dee7;
}

.btn-primary {
  background: #0071EB;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 113, 235, 0.18);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary:hover,
.btn-primary:not(:disabled):hover {
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .form-grid,
  .form-actions {
    grid-template-columns: 1fr;
  }
}
</style>