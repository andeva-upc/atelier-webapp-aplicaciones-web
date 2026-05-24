<script setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Appointment, AppointmentStatus } from '../../domain/model/appointment.entity.js';
import { environment } from '../../../environments/environment.js';

const props = defineProps({
  visible: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  appointment: {
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
const vehicles = ref([]);
const selectedBranch = ref(null);

const form = reactive({
  customerId: '',
  customerPhone: '',
  vehicleId: '',
  serviceType: '',
  date: '',
  time: '',
  mechanicName: '',
  notes: '',
  status: AppointmentStatus.SCHEDULED
});

const isEditMode = computed(() => props.mode === 'edit');

const selectedCustomer = computed(() => {
  return customers.value.find((customer) => customer.id === form.customerId) || null;
});

const availableVehicles = computed(() => {
  if (!selectedCustomer.value) return [];

  return vehicles.value.filter((vehicle) => vehicle.userId === selectedCustomer.value.userId);
});

const isFormValid = computed(() => {
  return form.customerId
      && form.customerPhone.trim().length >= 7
      && form.vehicleId
      && form.serviceType.trim().length > 0
      && form.date
      && form.time
      && form.mechanicName.trim().length > 0;
});

const resetForm = () => {
  form.customerId = '';
  form.customerPhone = '';
  form.vehicleId = '';
  form.serviceType = '';
  form.date = '';
  form.time = '';
  form.mechanicName = '';
  form.notes = '';
  form.status = AppointmentStatus.SCHEDULED;
};

const patchForm = () => {
  if (!props.appointment) {
    resetForm();
    return;
  }

  form.customerId = props.appointment.customerId || '';
  form.customerPhone = props.appointment.customerPhone || '';
  form.vehicleId = props.appointment.vehicleId || '';
  form.serviceType = props.appointment.serviceType || '';
  form.date = props.appointment.getDateLabel?.() || '';
  form.time = props.appointment.getTimeLabel?.() || '';
  form.mechanicName = props.appointment.mechanicName || '';
  form.notes = props.appointment.notes || '';
  form.status = props.appointment.status || AppointmentStatus.SCHEDULED;
};

const loadFormOptions = async () => {
  const baseUrl = environment.platformProviderApiBaseUrl;

  const [
    usersResponse,
    customerProfilesResponse,
    vehiclesResponse,
    vehicleModelsResponse,
    branchesResponse
  ] = await Promise.all([
    axios.get(`${baseUrl}${environment.platformProviderUsersEndpointPath}`),
    axios.get(`${baseUrl}${environment.platformProviderCustomerProfilesEndpointPath}`),
    axios.get(`${baseUrl}${environment.platformProviderVehiclesEndpointPath}`),
    axios.get(`${baseUrl}${environment.platformProviderVehicleModelsEndpointPath}`),
    axios.get(`${baseUrl}${environment.platformProviderBranchesEndpointPath}`)
  ]);

  const users = toArray(usersResponse);
  const customerProfiles = toArray(customerProfilesResponse);
  const rawVehicles = toArray(vehiclesResponse);
  const vehicleModels = toArray(vehicleModelsResponse);
  const branches = toArray(branchesResponse);

  const usersById = new Map(
      users
          .filter((user) => !user.deleted_at)
          .map((user) => [user.id, user])
  );

  const vehicleModelsById = new Map(
      vehicleModels.map((model) => [model.id, model])
  );

  customers.value = customerProfiles
      .filter((customer) => !customer.deleted_at)
      .map((customer) => {
        const user = usersById.get(customer.user_id);

        const customerName = customer.is_corporate && customer.business_name
            ? customer.business_name
            : `${customer.first_name || ''} ${customer.last_name || ''}`.trim();

        return {
          id: customer.id,
          userId: customer.user_id,
          name: customerName || 'Cliente sin nombre',
          phone: user?.phone || 'Sin teléfono'
        };
      });

  vehicles.value = rawVehicles
      .filter((vehicle) => !vehicle.deleted_at)
      .map((vehicle) => {
        const model = vehicleModelsById.get(vehicle.vehicle_model_id);

        return {
          id: vehicle.id,
          userId: vehicle.user_id,
          summary: `${model?.brand || 'Marca'} ${model?.model || 'Modelo'} - ${vehicle.plate_number}`
        };
      });

  selectedBranch.value = branches.find((branch) => !branch.deleted_at) || null;

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

const handleCustomerChange = () => {
  const customer = customers.value.find((item) => item.id === form.customerId);

  form.customerPhone = customer?.phone || '';
  form.vehicleId = '';
};

watch(
    () => [props.visible, props.appointment, props.mode],
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

  return `appointment-${Date.now()}`;
};

const handleSubmit = () => {
  if (!isFormValid.value || props.saving) return;

  const customer = customers.value.find((item) => item.id === form.customerId);
  const vehicle = vehicles.value.find((item) => item.id === form.vehicleId);

  if (!customer || !vehicle) return;

  const appointmentDate = `${form.date}T${form.time}:00`;
  const currentAppointment = props.appointment;

  const entity = new Appointment(
      currentAppointment?.id || createId(),
      currentAppointment?.workshopId || selectedBranch.value?.workshop_id || 'e26b1580-b3b0-466d-8c10-ca7f62d1c9ef',
      currentAppointment?.branchId || selectedBranch.value?.id || 'b1ba1580-b3b0-466d-8c10-ca7f62d1c9aa',
      appointmentDate,
      form.status,
      customer.name,
      customer.phone,
      vehicle.summary,
      form.serviceType,
      form.mechanicName,
      form.notes || t('appointments.notes.empty'),
      currentAppointment ? currentAppointment.version + 1 : 0,
      customer.id,
      vehicle.id,
      currentAppointment?.deletedAt || null
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
      class="appointment-dialog"
      :style="{ width: '680px' }"
      :draggable="false"
      :closable="true"
      :showHeader="true"
      appendTo="body"
  >
    <template #header>
      <h2 class="dialog-title">
        {{ isEditMode ? t('appointments.form.edit_title') : t('appointments.form.create_title') }}
      </h2>
    </template>

    <form class="appointment-form" @submit.prevent="handleSubmit">
      <label class="form-field form-field-full">
        <span>{{ t('appointments.fields.customer') }} *</span>

        <select v-model="form.customerId" @change="handleCustomerChange">
          <option value="">Select customer</option>

          <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
          >
            {{ customer.name }}
          </option>
        </select>
      </label>

      <div class="form-grid">
        <label class="form-field">
          <span>{{ t('appointments.fields.phone') }} *</span>

          <input
              v-model="form.customerPhone"
              type="text"
              readonly
              :placeholder="t('appointments.placeholders.phone')"
          />
        </label>

        <label class="form-field">
          <span>{{ t('appointments.fields.vehicle') }} *</span>

          <select v-model="form.vehicleId" :disabled="availableVehicles.length === 0">
            <option value="">Select vehicle</option>

            <option
                v-for="vehicle in availableVehicles"
                :key="vehicle.id"
                :value="vehicle.id"
            >
              {{ vehicle.summary }}
            </option>
          </select>
        </label>
      </div>

      <label class="form-field form-field-full">
        <span>{{ t('appointments.fields.service') }} *</span>

        <input
            v-model="form.serviceType"
            type="text"
            :placeholder="t('appointments.placeholders.service')"
        />
      </label>

      <div class="form-grid">
        <label class="form-field">
          <span>{{ t('appointments.fields.date') }} *</span>
          <input v-model="form.date" type="date" />
        </label>

        <label class="form-field">
          <span>{{ t('appointments.fields.time') }} *</span>
          <input v-model="form.time" type="time" />
        </label>
      </div>

      <label class="form-field form-field-full">
        <span>{{ t('appointments.fields.mechanic') }} *</span>

        <input
            v-model="form.mechanicName"
            type="text"
            :placeholder="t('appointments.placeholders.mechanic')"
        />
      </label>

      <label class="form-field form-field-full">
        <span>{{ t('appointments.fields.notes') }}</span>

        <textarea
            v-model="form.notes"
            :placeholder="t('appointments.placeholders.notes')"
        ></textarea>
      </label>

      <label v-if="isEditMode" class="form-field form-field-full">
        <span>{{ t('appointments.fields.status') }}</span>

        <select v-model="form.status">
          <option :value="AppointmentStatus.SCHEDULED">
            {{ t('appointments.status.confirmed') }}
          </option>
          <option :value="AppointmentStatus.PENDING_APPROVAL">
            {{ t('appointments.status.pending') }}
          </option>
          <option :value="AppointmentStatus.IN_PROGRESS">
            {{ t('appointments.status.in_progress') }}
          </option>
          <option :value="AppointmentStatus.COMPLETED">
            {{ t('appointments.status.completed') }}
          </option>
          <option :value="AppointmentStatus.CANCELLED">
            {{ t('appointments.status.cancelled') }}
          </option>
        </select>
      </label>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="close">
          {{ t('appointments.actions.cancel') }}
        </button>

        <button type="submit" class="btn-primary" :disabled="!isFormValid || saving">
          {{ isEditMode ? t('appointments.actions.save_changes') : t('appointments.actions.schedule') }}
        </button>
      </div>
    </form>
  </pv-dialog>
</template>

<style scoped>
:global(.appointment-dialog.p-dialog) {
  background: #ffffff !important;
  border-radius: 28px !important;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28) !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden !important;
}

:global(.appointment-dialog .p-dialog-header) {
  background: #ffffff !important;
  padding: 2rem 2.5rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:global(.appointment-dialog .p-dialog-content) {
  background: #ffffff !important;
  padding: 2rem 2.5rem 2.5rem !important;
}

:global(.appointment-dialog .p-dialog-footer) {
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

.appointment-form {
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