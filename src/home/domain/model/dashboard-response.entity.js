export class DashboardResponse {
  constructor(kpis, chartData, alerts, recentOrders) {
    this.kpis = kpis;
    this.chartData = chartData;
    this.alerts = alerts;
    this.recentOrders = recentOrders;
  }
}

