import { defineStore } from 'pinia';
import { VehiclesApi } from '../infrastructure/vehicles-api.js';
import { WorkBaysApi } from '../infrastructure/workbays-api.js';
import { CustomerRegistrationsApi } from '../infrastructure/customer-registrations-api.js';
import { EmployeeRegistrationsApi } from '../infrastructure/employee-registrations-api.js'; // New import
import { VehicleRepository } from '../domain/repositories/vehicle.repository.js';
import { WorkBayRepository } from '../domain/repositories/workbay.repository.js';
import { CustomerRegistrationRepository } from '../domain/repositories/customer-registration.repository.js';
import { EmployeeRegistrationRepository } from '../domain/repositories/employee-registration.repository.js'; // New import

const vehiclesApi = new VehiclesApi();
const workbaysApi = new WorkBaysApi();
const customerRegistrationsApi = new CustomerRegistrationsApi();
const employeeRegistrationsApi = new EmployeeRegistrationsApi(); // New instantiation

/**
 * Fleet Store.
 * Application layer state management for the Fleet Bounded Context.
 */
export const useFleetStore = defineStore('fleet', {
  state: () => ({
    vehicles: [],
    selectedVehicle: null,
    isLoadingVehicles: false,
    isSavingVehicle: false,
    errorVehicles: null,

    workbays: [],
    selectedWorkBay: null,
    isLoadingWorkBays: false,
    isSavingWorkBay: false,
    errorWorkBays: null,

    customerRegistrations: [],
    selectedCustomerRegistration: null,
    isLoadingCustomerRegistrations: false,
    isSavingCustomerRegistration: false,
    errorCustomerRegistrations: null,

    employeeRegistrations: [], // New state
    selectedEmployeeRegistration: null, // New state
    isLoadingEmployeeRegistrations: false, // New state
    isSavingEmployeeRegistration: false, // New state
    errorEmployeeRegistrations: null, // New state
  }),

  getters: {
    totalVehicles: (state) => state.vehicles.length,
    totalWorkBays: (state) => state.workbays.length,
    totalCustomerRegistrations: (state) => state.customerRegistrations.length,
    totalEmployeeRegistrations: (state) => state.employeeRegistrations.length, // New getter
  },

  actions: {
    async fetchVehicles() {
      this.isLoadingVehicles = true;
      this.errorVehicles = null;

      try {
        this.vehicles = await vehiclesApi.getAll();
      } catch (error) {
        this.errorVehicles = error.message || 'Failed to fetch vehicles';
        console.error('[FleetStore] fetchVehicles error:', error);
      } finally {
        this.isLoadingVehicles = false;
      }
    },

    selectVehicle(vehicle) {
      this.selectedVehicle = vehicle;
    },

    clearVehicleSelection() {
      this.selectedVehicle = null;
    },

    async addVehicle(vehicleEntity) {
      this.isSavingVehicle = true;
      this.errorVehicles = null;

      try {
        await vehiclesApi.create(vehicleEntity);
        await this.fetchVehicles();
      } catch (error) {
        this.errorVehicles = error.message || 'Failed to create vehicle';
        throw error;
      } finally {
        this.isSavingVehicle = false;
      }
    },

    async updateVehicle(vehicleEntity) {
      this.isSavingVehicle = true;
      this.errorVehicles = null;

      try {
        await vehiclesApi.update(vehicleEntity.id, vehicleEntity);
        await this.fetchVehicles();
      } catch (error) {
        this.errorVehicles = error.message || 'Failed to update vehicle';
        throw error;
      } finally {
        this.isSavingVehicle = false;
      }
    },

    async deleteVehicle(id) {
      this.isSavingVehicle = true;
      this.errorVehicles = null;

      try {
        await vehiclesApi.delete(id);
        await this.fetchVehicles();
      } catch (error) {
        this.errorVehicles = error.message || 'Failed to delete vehicle';
        throw error;
      } finally {
        this.isSavingVehicle = false;
      }
    },

    async fetchWorkBays() {
      this.isLoadingWorkBays = true;
      this.errorWorkBays = null;

      try {
        this.workbays = await workbaysApi.getAll();
      } catch (error) {
        this.errorWorkBays = error.message || 'Failed to fetch workbays';
        console.error('[FleetStore] fetchWorkBays error:', error);
      } finally {
        this.isLoadingWorkBays = false;
      }
    },

    selectWorkBay(workBay) {
      this.selectedWorkBay = workBay;
    },

    clearWorkBaySelection() {
      this.selectedWorkBay = null;
    },

    async addWorkBay(workBayEntity) {
      this.isSavingWorkBay = true;
      this.errorWorkBays = null;

      try {
        await workbaysApi.create(workBayEntity);
        await this.fetchWorkBays();
      } catch (error) {
        this.errorWorkBays = error.message || 'Failed to create workbay';
        throw error;
      } finally {
        this.isSavingWorkBay = false;
      }
    },

    async updateWorkBay(workBayEntity) {
      this.isSavingWorkBay = true;
      this.errorWorkBays = null;

      try {
        await workbaysApi.update(workBayEntity.id, workBayEntity);
        await this.fetchWorkBays();
      } catch (error) {
        this.errorWorkBays = error.message || 'Failed to update workbay';
        throw error;
      } finally {
        this.isSavingWorkBay = false;
      }
    },

    async deleteWorkBay(id) {
      this.isSavingWorkBay = true;
      this.errorWorkBays = null;

      try {
        await workbaysApi.delete(id);
        await this.fetchWorkBays();
      } catch (error) {
        this.errorWorkBays = error.message || 'Failed to delete workbay';
        throw error;
      } finally {
        this.isSavingWorkBay = false;
      }
    },

    async fetchCustomerRegistrations() {
      this.isLoadingCustomerRegistrations = true;
      this.errorCustomerRegistrations = null;

      try {
        this.customerRegistrations = await customerRegistrationsApi.getAll();
      } catch (error) {
        this.errorCustomerRegistrations = error.message || 'Failed to fetch customer registrations';
        console.error('[FleetStore] fetchCustomerRegistrations error:', error);
      } finally {
        this.isLoadingCustomerRegistrations = false;
      }
    },

    selectCustomerRegistration(customerRegistration) {
      this.selectedCustomerRegistration = customerRegistration;
    },

    clearCustomerRegistrationSelection() {
      this.selectedCustomerRegistration = null;
    },

    async addCustomerRegistration(customerRegistrationEntity) {
      this.isSavingCustomerRegistration = true;
      this.errorCustomerRegistrations = null;

      try {
        await customerRegistrationsApi.create(customerRegistrationEntity);
        await this.fetchCustomerRegistrations();
      } catch (error) {
        this.errorCustomerRegistrations = error.message || 'Failed to create customer registration';
        throw error;
      } finally {
        this.isSavingCustomerRegistration = false;
      }
    },

    async updateCustomerRegistration(customerRegistrationEntity) {
      this.isSavingCustomerRegistration = true;
      this.errorCustomerRegistrations = null;

      try {
        await customerRegistrationsApi.update(customerRegistrationEntity.id, customerRegistrationEntity);
        await this.fetchCustomerRegistrations();
      } catch (error) {
        this.errorCustomerRegistrations = error.message || 'Failed to update customer registration';
        throw error;
      } finally {
        this.isSavingCustomerRegistration = false;
      }
    },

    async deleteCustomerRegistration(id) {
      this.isSavingCustomerRegistration = true;
      this.errorCustomerRegistrations = null;

      try {
        await customerRegistrationsApi.delete(id);
        await this.fetchCustomerRegistrations();
      } catch (error) {
        this.errorCustomerRegistrations = error.message || 'Failed to delete customer registration';
        throw error;
      } finally {
        this.isSavingCustomerRegistration = false;
      }
    },

    // New actions for Employee Registrations
    async fetchEmployeeRegistrations() {
      this.isLoadingEmployeeRegistrations = true;
      this.errorEmployeeRegistrations = null;

      try {
        this.employeeRegistrations = await employeeRegistrationsApi.getAll();
      } catch (error) {
        this.errorEmployeeRegistrations = error.message || 'Failed to fetch employee registrations';
        console.error('[FleetStore] fetchEmployeeRegistrations error:', error);
      } finally {
        this.isLoadingEmployeeRegistrations = false;
      }
    },

    selectEmployeeRegistration(employeeRegistration) {
      this.selectedEmployeeRegistration = employeeRegistration;
    },

    clearEmployeeRegistrationSelection() {
      this.selectedEmployeeRegistration = null;
    },

    async addEmployeeRegistration(employeeRegistrationEntity) {
      this.isSavingEmployeeRegistration = true;
      this.errorEmployeeRegistrations = null;

      try {
        await employeeRegistrationsApi.create(employeeRegistrationEntity);
        await this.fetchEmployeeRegistrations();
      } catch (error) {
        this.errorEmployeeRegistrations = error.message || 'Failed to create employee registration';
        throw error;
      } finally {
        this.isSavingEmployeeRegistration = false;
      }
    },

    async updateEmployeeRegistration(employeeRegistrationEntity) {
      this.isSavingEmployeeRegistration = true;
      this.errorEmployeeRegistrations = null;

      try {
        await employeeRegistrationsApi.update(employeeRegistrationEntity.id, employeeRegistrationEntity);
        await this.fetchEmployeeRegistrations();
      } catch (error) {
        this.errorEmployeeRegistrations = error.message || 'Failed to update employee registration';
        throw error;
      } finally {
        this.isSavingEmployeeRegistration = false;
      }
    },

    async deleteEmployeeRegistration(id) {
      this.isSavingEmployeeRegistration = true;
      this.errorEmployeeRegistrations = null;

      try {
        await employeeRegistrationsApi.delete(id);
        await this.fetchEmployeeRegistrations();
      } catch (error) {
        this.errorEmployeeRegistrations = error.message || 'Failed to delete employee registration';
        throw error;
      } finally {
        this.isSavingEmployeeRegistration = false;
      }
    }
  }
});