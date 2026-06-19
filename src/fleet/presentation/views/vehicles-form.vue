<script setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Vehicle } from '../../domain/model/vehicle.entity.js';
import { environment } from '../../../../environments/environment.js';

const props = defineProps({
  visible: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  vehicle: {
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

const customers = ref([]);
const vehicleModels = ref([]);

const form = reactive({
  customerId: '',
  vehicleModelId: '',
  plateNumber: '',
  year: new Date().getFullYear(),
  vin: '',
  currentMileage: 0
});

const isEditMode = computed(() => props.mode === 'edit');

const isFormValid = computed(() => {
  return form.customerId
      && form.vehicleModelId
      && form.plateNumber.trim().length > 0
      && form.year > 1900 && form.year <= new Date().getFullYear()
      && form.vin.trim().length > 0
      && form.currentMileage >= 0;
});

const resetForm = () => {
  form.customerId = '';
  form.vehicleModelId = '';
  form.plateNumber = '';
  form.year = new Date().getFullYear();
  form.vin = '';
  form.currentMileage = 0;
};

const patchForm = () => {
  if (!props.vehicle) {
    resetForm();
    return;
  }

  form.customerId = props.vehicle.customerId || '';
  form.vehicleModelId = props.vehicle.vehicleModelId || '';
  form.plateNumber = props.vehicle.plateNumber || '';
  form.year = props.vehicle.year || new Date().getFullYear();
  form.vin = props.vehicle.vin || '';
  form.currentMileage = props.vehicle.currentMileage || 0;
};

const loadFormOptions = async () => {
  const baseUrl = environment.platformProviderApiBaseUrl;

  const [
    customerProfilesResponse,
    usersResponse,
    vehicleModelsResponse
  ] = await Promise.all([
    axios.get(`${baseUrl}${environment.platformProviderCustomerProfilesEndpointPath}`),
    axios.get(`${baseUrl}${environment.platformProviderUsersEndpointPath}`),
    axios.get(`${baseUrl}${environment.platformProviderVehicleModelsEndpointPath}`)
  ]);

  const customerProfiles = toArray(customerProfilesResponse);
  const users = toArray(usersResponse);
  const rawVehicleModels = toArray(vehicleModelsResponse);

  const usersById = new Map(
      users
          .filter((user) => !user.deleted_at)
          .map((user) => [user.id, user])
  );

  customers.value = customerProfiles
      .filter((customer) => !customer.deleted_at)
      .map((customer) => {
        const user = usersById.get(customer.user_id);

        const customerName = customer.is_corporate && customer.business_name
            ? customer.business_name
            : `${customer.first_name || ''} ${customer.last_name || ''}`.trim();

        return {
          id: customer.user_id, // Use user_id as customerId for vehicle association
          name: customerName || 'Cliente sin nombre',
          phone: user?.phone || 'Sin teléfono'
        };
      });

  vehicleModels.value = rawVehicleModels.map((model) => ({
    id: model.id,
    name: `${model.brand} ${model.model}`
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
    () => [props.visible, props.vehicle, props.mode],
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

  return `vehicle-${Date.now()}`;
};

const handleSubmit = () => {
  if (!isFormValid.value || props.saving) return;

  const entity = new Vehicle(
      props.vehicle?.id || createId(),
      props.vehicle?.workshopId || 'e2667890-7890-466d-7890-ca7f62d1c9ef', // Default workshopId
      form.customerId,
      form.vehicleModelId,
      form.plateNumber,
      form.year,
      form.vin,
      form.currentMileage
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
      class="vehicle-dialog"
      :style="{ width: '680px' }"
      :draggable="false"
      :closable="true"
      :showHeader="true"
      appendTo="body"
  >
    <template #header>
      <h2 class="dialog-title">
        {{ isEditMode ? t('vehicles.form.edit_title') : t('vehicles.form.create_title') }}
      </h2>
    </template>

    <form class="vehicle-form" @submit.prevent="handleSubmit">
      <label class="form-field form-field-full">
        <span>{{ t('vehicles.fields.customer') }} *</span>
        <select v-model="form.customerId">
          <option value="">{{ t('vehicles.placeholders.select_customer') }}</option>
          <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
          >
            {{ customer.name }}
          </option>
        </select>
      </label>

      <label class="form-field form-field-full">
        <span>{{ t('vehicles.fields.model') }} *</span>
        <select v-model="form.vehicleModelId">
          <option value="">{{ t('vehicles.placeholders.select_model') }}</option>
          <option
              v-for="model in vehicleModels"
              :key="model.id"
              :value="model.id"
          >
            {{ model.name }}
          </option>
        </select>
      </label>

      <div class="form-grid">
        <label class="form-field">
          <span>{{ t('vehicles.fields.plate_number') }} *</span>
          <input
              v-model="form.plateNumber"
              type="text"
              :placeholder="t('vehicles.placeholders.plate_number')"
          />
        </label>

        <label class="form-field">
          <span>{{ t('vehicles.fields.year') }} *</span>
          <input
              v-model="form.year"
              type="number"
              :placeholder="t('vehicles.placeholders.year')"
          />
        </label>
      </div>

      <label class="form-field form-field-full">
        <span>{{ t('vehicles.fields.vin') }} *</span>
        <input
            v-model="form.vin"
            type="text"
            :placeholder="t('vehicles.placeholders.vin')"
        />
      </label>

      <label class="form-field form-field-full">
        <span>{{ t('vehicles.fields.current_mileage') }} *</span>
        <input
            v-model="form.currentMileage"
            type="number"
            :placeholder="t('vehicles.placeholders.current_mileage')"
        />
      </label>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="close">
          {{ t('vehicles.actions.cancel') }}
        </button>

        <button type="submit" class="btn-primary" :disabled="!isFormValid || saving">
          {{ isEditMode ? t('vehicles.actions.save_changes') : t('vehicles.actions.create') }}
        </button>
      </div>
    </form>
  </pv-dialog>
</template>

<style scoped>
:global(.vehicle-dialog.p-dialog) {
  background: #ffffff !important;
  border-radius: 28px !important;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28) !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden !important;
}

:global(.vehicle-dialog .p-dialog-header) {
  background: #ffffff !important;
  padding: 2rem 2.5rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:global(.vehicle-dialog .p-dialog-content) {
  background: #ffffff !important;
  padding: 2rem 2.5rem 2.5rem !important;
}

:global(.vehicle-dialog .p-dialog-footer) {
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

.vehicle-form {
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