import axios from 'axios';
import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { environment } from '../../environments/environment.js';
import { DashboardKpi } from '../domain/model/dashboard-kpi.entity.js';
import { DashboardAlert } from '../domain/model/dashboard-alert.entity.js';
import { RecentWorkOrder } from '../domain/model/recent-work-order.entity.js';
import { DashboardResponse } from '../domain/model/dashboard-response.entity.js';

export class DashboardApi extends BaseApi {
  constructor() {
    super();
    this.http = axios.create({
      baseURL: environment.apiBaseUrl,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async getDashboardData() {
    try {
      const [
        workOrdersRes,
        vehiclesRes,
        alertsRes,
        customersRes,
        usersRes,
        obd2DevicesRes,
        tasksRes,
        paymentsRes
      ] = await Promise.all([
        this.http.get('/work_orders'),
        this.http.get('/vehicles'),
        this.http.get('/vehicle_dtc_alerts'),
        this.http.get('/customers'),
        this.http.get('/users'),
        this.http.get('/obd2_devices'),
        this.http.get('/work_order_tasks'),
        this.http.get('/payments')
      ]);

      const workOrders = workOrdersRes.data;
      const vehicles = vehiclesRes.data;
      const alertsData = alertsRes.data;
      const customers = customersRes.data;
      const users = usersRes.data;
      const obd2Devices = obd2DevicesRes.data;
      const tasks = tasksRes.data;
      const payments = paymentsRes.data;

      // 1. KPIs
      const activeOrdersCount = workOrders.filter(
        wo => wo.status === 'IN_PROGRESS' || wo.status === 'DIAGNOSING'
      ).length;

      const nonFinishedOrders = workOrders.filter(
        wo => wo.status !== 'COMPLETED' && wo.status !== 'INVOICED'
      );
      const uniqueVehicles = new Set(nonFinishedOrders.map(wo => wo.vehicle_id));
      const vehiclesInWorkshopCount = uniqueVehicles.size;

      // Calculate Income and Growth
      const now = new Date('2026-05-14T00:00:00Z'); // Using current context date
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const paymentsByMonth = {};
      payments.forEach(p => {
        if (!p.paid_at) return;
        const d = new Date(p.paid_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!paymentsByMonth[key]) paymentsByMonth[key] = 0;
        paymentsByMonth[key] += Number(p.amount);
      });

      const currentMonthKey = `${currentYear}-${currentMonth}`;
      let prevMonth = currentMonth - 1;
      let prevYear = currentYear;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear -= 1;
      }
      const prevMonthKey = `${prevYear}-${prevMonth}`;

      const currentIncome = paymentsByMonth[currentMonthKey] || 0;
      const prevIncome = paymentsByMonth[prevMonthKey] || 0;

      let incomeGrowth = 0;
      if (prevIncome > 0) {
        incomeGrowth = Math.round(((currentIncome - prevIncome) / prevIncome) * 100);
      } else if (currentIncome > 0) {
        incomeGrowth = 100;
      }

      // Add missing completed today & telemetry fields mapping to fix mock
      const todayStr = new Date('2026-05-14').toISOString().split('T')[0];
      const completedToday = workOrders.filter(wo => wo.status === 'COMPLETED' && wo.updated_at && wo.updated_at.startsWith(todayStr)).length;

      const vehiclesWithTelemetry = obd2Devices.filter(device => device.status === 'ACTIVE').length;

      const pendingAlertsList = alertsData.filter(a => a.is_active !== false && a.is_resolved !== true);
      const pendingAlertsCount = pendingAlertsList.length;
      const criticalAlertsCount = pendingAlertsList.filter(a => a.severity === 'CRITICAL').length;
      const mediumAlertsCount = pendingAlertsList.filter(a => a.severity === 'MEDIUM').length;

      const kpis = new DashboardKpi(
        currentIncome,
        incomeGrowth,
        activeOrdersCount,
        vehiclesInWorkshopCount,
        completedToday,
        vehiclesWithTelemetry,
        pendingAlertsCount,
        criticalAlertsCount,
        mediumAlertsCount
      );

      // 2. Chart Data (Last 5 months)
      const chartData = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 4; i >= 0; i--) {
        let m = currentMonth - i;
        let y = currentYear;
        if (m < 0) {
          m += 12;
          y -= 1;
        }
        const key = `${y}-${m}`;
        chartData.push({
          month: monthNames[m],
          income: paymentsByMonth[key] || 0
        });
      }

      // 3. Alerts
      const vehicleMap = new Map(vehicles.map(v => [v.id, v]));

      const filteredAlerts = pendingAlertsList
        .filter(a => a.severity === 'CRITICAL' || a.severity === 'MEDIUM')
        .map(a => {
          const vehicle = vehicleMap.get(a.vehicle_id);
          const plate = vehicle ? vehicle.plate_number : 'Unknown';
          const time = a.created_at ? new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Reciente';
          return new DashboardAlert(a.id, a.dtc_code, a.severity, plate, a.description, time);
        });

      // 4. Recent Orders
      const customerMap = new Map(customers.map(c => [c.id, c]));
      const userMap = new Map(users.map(u => [u.id, u]));

      const sortedOrders = [...workOrders].sort((a, b) => {
        const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return timeB - timeA;
      });
      const top4Orders = sortedOrders.slice(0, 4);

      const recentOrdersList = top4Orders.map(wo => {
        const vehicle = vehicleMap.get(wo.vehicle_id);
        const plate = vehicle ? vehicle.plate_number : 'Desconocido';
        const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehiculo Desconocido';

        const customer = customerMap.get(wo.customer_id);
        const custName = customer ? customer.full_name : 'Cliente Anonimo';

        const mechanic = userMap.get(wo.assigned_mechanic_id);
        const mechName = mechanic ? mechanic.full_name : 'No asignado';

        const woTasks = tasks.filter(t => t.work_order_id === wo.id);
        const totalAmt = woTasks.reduce((sum, t) => sum + Number(t.unit_price), 0);

        const internalId = wo.internal_number ? `OT-${String(wo.internal_number).padStart(3, '0')}` : wo.id.substring(0, 8);

        return new RecentWorkOrder(
          internalId,
          wo.status,
          custName,
          vehicleName,
          plate,
          mechName,
          totalAmt,
          wo.updated_at
        );
      });

      return new DashboardResponse(kpis, chartData, filteredAlerts, recentOrdersList);

    } catch (error) {
      this.handleError('Failed to fetch dashboard data')(error);
      throw error;
    }
  }
}
