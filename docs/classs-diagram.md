# Diagrama de Clases - Atelier

Este documento contiene la representación en texto plano del modelo de dominio del sistema Atelier, actualizado para soportar el 100% de las Historias de Usuario (EP001-EP006).

---

## 🔐 Context 0: Core (Seguridad y Multi-Tenancy)

### 📋 Clases y Entidades

#### **BaseEntity** (Clase Base)
- **Atributos:**
  - `id`: Guid
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
  - `deletedAt`: DateTime

#### **Workshop** (Taller/Tenant)
- **Atributos:**
  - `taxId`: string
  - `businessName`: string
  - `tradeName`: string
  - `subscriptionPlan`: SubscriptionPlan
  - `isActive`: bool

#### **User** (Usuario)
- **Atributos:**
  - `workshopId`: Guid
  - `roleId`: Guid
  - `email`: string
  - `passwordHash`: string
  - `fullName`: string
  - `isActive`: bool

#### **Role** (Rol)
- **Atributos:**
  - `name`: string
  - `description`: string

### ⚙️ Lógica y Repositorios

#### **SecurityManager** (Servicio)
- **Atributos:**
  - `_userRepo`: IUserRepository
- **Métodos:**
  - `authenticate(email, rawPassword)`: User
  - `hashPassword(raw)`: string

#### **IUserRepository** (Interfaz)
- **Métodos:**
  - `findByEmailAndWorkshopId(email, workshopId)`: User

### 🔢 Enums
- **SubscriptionPlan:** `FREE`, `PRO`, `ENTERPRISE`

---

## 🚗 Context 1: Fleet (Clientes y Vehículos)

### 📋 Clases y Entidades

#### **Customer** (Cliente)
- **Atributos:**
  - `workshopId`: Guid
  - `documentType`: DocumentType
  - `documentNumber`: string
  - `firstName`: string
  - `lastName`: string
  - `businessName`: string
  - `phone`: string

#### **Vehicle** (Vehículo)
- **Atributos:**
  - `workshopId`: Guid
  - `customerId`: Guid
  - `plate`: string
  - `vin`: string
  - `brand`: string
  - `model`: string
  - `currentMileage`: int

#### **Appointment** (Cita - US024, US025)
- **Atributos:**
  - `workshopId`: Guid
  - `branchId`: Guid
  - `customerId`: Guid?
  - `vehicleId`: Guid?
  - `appointmentDate`: DateTime
  - `status`: AppointmentStatus
  - `preRegisteredData`: string (Datos de clientes no registrados)

#### **WorkBay** (Bahía/Locker - US013)
- **Atributos:**
  - `workshopId`: Guid
  - `branchId`: Guid
  - `name`: string
  - `status`: BayStatus
  - `vehicleId`: Guid?

### ⚙️ Lógica y Repositorios

#### **FleetManagementService** (Servicio)
- **Métodos:**
  - `registerCustomer(workshopId, dto)`: Customer
  - `updateVehicleMileage(vehicleId, newMileage)`: Task
  - `checkMileageSuggestions(workshopId)`: List<Vehicle> (US032)

#### **ICustomerRepository** / **IVehicleRepository**
- Métodos estándar de persistencia y consulta.

### 🔢 Enums
- **DocumentType:** `DNI`, `RUC`, `CE`, `PASSPORT`
- **AppointmentStatus:** `PENDING_APPROVAL`, `SCHEDULED`, `COMPLETED`, `CANCELLED`
- **BayStatus:** `VACANT`, `OCCUPIED`

---

## 📡 Context 2: IOT (Hardware OBD2)

### 📋 Clases y Entidades

#### **OBD2Device** (Dispositivo)
- **Atributos:**
  - `workshopId`: Guid
  - `vehicleId`: Guid
  - `macAddress`: string
  - `status`: DeviceStatus

#### **OBD2Telemetry** (Telemetría Histórica)
- **Atributos:**
  - `rpm`, `speedKmh`, `tempEngineC`, `fuelLevelPct`, `batteryVoltage`

#### **VehicleDTCAlert** (Alerta de Error - US021)
- **Atributos:**
  - `dtcCode`: string
  - `isActive`: bool
  - `severity`: Severity

### ⚙️ Lógica y Repositorios

#### **OBD2EngineService** (Servicio)
- **Métodos:**
  - `processBatch(workshopId, batch)`: Procesa ingesta masiva y genera alertas DTC.

---

## 🛠️ Context 3: Operations (Órdenes de Trabajo)

### 📋 Clases y Entidades

#### **WorkOrder** (Orden de Trabajo - US014)
- **Atributos:**
  - `internalNumber`, `status`, `reportedSymptom`, `currentMileage`

#### **Quote** (Cotización Digital - US026, US027)
- **Atributos:**
  - `internalNumber`: int
  - `status`: QuoteStatus
  - `expirationDate`: DateTime
  - `subtotalAmount`, `discountAmount`, `taxAmount`, `totalAmount`: decimal

#### **QuoteItem** (Detalle de Cotización)
- **Atributos:**
  - `itemType`: string (PRODUCT/SERVICE)
  - `quantity`, `unitPrice`, `totalLineAmount`: decimal

### ⚙️ Lógica y Repositorios

#### **OperationsService** (Servicio)
- **Métodos:**
  - `createDraft(vehicleId)`: WorkOrder
  - `advanceStatus(otId, newStatus)`: Task
  - `generateQuoteFromWorkOrder(otId)`: Quote (Convierte diagnóstico en cotización)

### 🔢 Enums
- **WorkOrderStatus:** `DRAFT`, `DIAGNOSING`, `IN_PROGRESS`, `COMPLETED`, `INVOICED`
- **QuoteStatus:** `DRAFT`, `SENT`, `APPROVED`, `REJECTED`, `EXPIRED`

---

## 📦 Context 4: Inventory (Almacén y Proveedores)

### 📋 Clases y Entidades

#### **Product** (Producto/Repuesto)
- **Atributos:**
  - `sku`, `name`, `unitPrice`, `unitCost`, `currentStock`, `minimumStock` (US010)

#### **InventoryManager** (Servicio)
- **Métodos:**
  - `dispatchStock(productId, qty, referenceId)`: Deducción de stock para OTs.

---

## 💰 Context 5: Billing (Facturación y Finanzas)

### 📋 Clases y Entidades

#### **Voucher** (Comprobante - US028)
- **Atributos:**
  - `subtotalAmount`, `discountAmount` (US029), `taxAmount`, `totalAmount`, `sunatStatus`

#### **FinancialMetrics** (DTO de Reportes)
- **Atributos:**
  - `totalRevenue`, `totalCost`, `profitabilityPct` (US030)

### ⚙️ Lógica y Repositorios

#### **ReportingService** (Servicio de Métricas - US030, US031)
- **Métodos:**
  - `getProfitabilityReport(workshopId, startDate, endDate)`: FinancialMetrics
  - `exportAccountingReport(workshopId, period)`: byte[] (PDF/Excel)

#### **CheckoutOrchestrator** (Orquestador)
- Coordina la venta, deducción de stock y publicación de eventos (Outbox).

---

## 🔗 Actualización de Relaciones Globales

1. **Gestión de Citas:** `Appointment` se vincula opcionalmente a un `Customer` y `Vehicle`.
2. **Espacio Físico:** `WorkBay` puede contener un `Vehicle` durante el servicio.
3. **Flujo de Venta:** `Quote` -> `WorkOrder` -> `Voucher`. La cotización es el paso previo opcional a la orden.
4. **Inteligencia de Negocio:** `ReportingService` analiza `Voucher` y `Product.unitCost` para calcular la rentabilidad real.
