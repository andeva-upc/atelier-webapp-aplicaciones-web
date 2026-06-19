import { defineStore } from 'pinia';
import { AppointmentsApi } from '../infrastructure/appointments-api.js';
import { AppointmentStatus } from '../domain/model/appointment.entity.js';

const appointmentsApi = new AppointmentsApi();

/**
 * Appointments Store.
 * Application layer state management for the Appointments Bounded Context.
 */
export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    appointments: [],
    selectedAppointment: null,
    isLoading: false,
    isSaving: false,
    error: null
  }),

  getters: {
    activeAppointments: (state) => state.appointments.filter((appointment) => !appointment.deletedAt),
    totalAppointments: (state) => state.appointments.filter((appointment) => !appointment.deletedAt).length,
    confirmedAppointments: (state) => state.appointments.filter((appointment) => appointment.isConfirmed()).length,
    pendingAppointments: (state) => state.appointments.filter((appointment) => appointment.status === AppointmentStatus.PENDING_APPROVAL).length,
    completedAppointments: (state) => state.appointments.filter((appointment) => appointment.status === AppointmentStatus.COMPLETED).length
  },

  actions: {
    async fetchAppointments(query = '') {
      this.isLoading = true;
      this.error = null;

      try {
        this.appointments = await appointmentsApi.getAppointmentsWithRelations(query);
      } catch (error) {
        this.error = error.message || 'Failed to fetch appointments';
        console.error('[AppointmentsStore] fetchAppointments error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async searchAppointments(query) {
      await this.fetchAppointments(query);
    },

    selectAppointment(appointment) {
      this.selectedAppointment = appointment;
    },

    clearSelection() {
      this.selectedAppointment = null;
    },

    async addAppointment(appointmentEntity) {
      this.isSaving = true;
      this.error = null;

      try {
        await appointmentsApi.create(appointmentEntity);
        await this.fetchAppointments();
      } catch (error) {
        this.error = error.message || 'Failed to create appointment';
        throw error;
      } finally {
        this.isSaving = false;
      }
    },

    async updateAppointment(appointmentEntity) {
      this.isSaving = true;
      this.error = null;

      try {
        await appointmentsApi.update(appointmentEntity, appointmentEntity.id);
        await this.fetchAppointments();
      } catch (error) {
        this.error = error.message || 'Failed to update appointment';
        throw error;
      } finally {
        this.isSaving = false;
      }
    }
  }
});
