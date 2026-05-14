export class DashboardKpi {
  constructor(
    income,
    incomeGrowth,
    activeOrders,
    vehiclesInWorkshop,
    completedToday = 0,
    vehiclesWithTelemetry = 0,
    pendingAlerts = 0,
    criticalAlerts = 0,
    mediumAlerts = 0
  ) {
    this.income = income;
    this.incomeGrowth = incomeGrowth;
    this.activeOrders = activeOrders;
    this.vehiclesInWorkshop = vehiclesInWorkshop;
    this.completedToday = completedToday;
    this.vehiclesWithTelemetry = vehiclesWithTelemetry;
    this.pendingAlerts = pendingAlerts;
    this.criticalAlerts = criticalAlerts;
    this.mediumAlerts = mediumAlerts;
  }
}
