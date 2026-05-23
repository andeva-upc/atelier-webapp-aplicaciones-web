CREATE TABLE appointments
(
    id               CHAR(36)    NOT NULL,
    branch_id        CHAR(36)    NOT NULL,
    customer_id      CHAR(36)    NOT NULL,
    vehicle_id       CHAR(36)    NOT NULL,
    appointment_date DATETIME    NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' COMMENT 'Enum: SCHEDULED, COMPLETED, CANCELLED',
    version          BIGINT      NULL     DEFAULT 0,
    created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP   NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE branches
(
    id                CHAR(36)     NOT NULL,
    workshop_id       CHAR(36)     NOT NULL,
    branch_name       VARCHAR(100) NOT NULL,
    branch_address    VARCHAR(200) NULL    ,
    branch_phone      VARCHAR(50)  NULL    ,
    hourly_capacity   INT          NOT NULL DEFAULT 3,
    subscription_plan VARCHAR(20)  NOT NULL,
    version           BIGINT       NOT NULL DEFAULT 0,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NULL    ,
    deleted_at        TIMESTAMP    NULL    ,
    created_by        CHAR(36)     NULL    ,
    updated_by        CHAR(36)     NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE categories
(
    id            CHAR(36)    NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE customer_profiles
(
    id            CHAR(36)    NOT NULL,
    user_id       CHAR(36)    NOT NULL,
    first_name    VARCHAR(50) NULL    ,
    last_name     VARCHAR(50) NULL    ,
    is_corporate  BOOLEAN     NOT NULL,
    business_name VARCHAR(50) NULL    ,
    created_by    CHAR(36)    NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE customer_registration
(
    id              CHAR(36)   NOT NULL,
    branch_id       CHAR(36)   NOT NULL,
    customer_id     CHAR(36)   NOT NULL,
    registered_at   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unregistered_at TIMESTAMP  NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE dtc_alerts
(
    id                    CHAR(36)     NOT NULL,
    telemetry_snapshot_id CHAR(36)     NOT NULL,
    dtc_code              VARCHAR(10)  NOT NULL,
    description           VARCHAR(255) NOT NULL,
    severity              VARCHAR(20)  NOT NULL COMMENT 'Enum: LOW, MEDIUM, HIGH, CRITICAL',
    created_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version               BIGINT       NOT NULL DEFAULT 0,
    branch_id             CHAR(36)     NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE employee_profiles
(
    id         CHAR(36)    NOT NULL,
    user_id    CHAR(36)    NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    created_by CHAR(36)    NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE employee_registration
(
    id              CHAR(36)      NOT NULL,
    branch_id       CHAR(36)      NOT NULL,
    employee_id     CHAR(36)      NOT NULL,
    specialty_id    CHAR(36)      NOT NULL,
    salary          DECIMAL(10,2) NOT NULL,
    registered_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unregistered_at TIMESTAMP     NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE inventory_batches
(
    id                 CHAR(36)      NOT NULL,
    product_id         CHAR(36)      NOT NULL,
    initial_quantity   INT           NOT NULL,
    available_quantity INT           NOT NULL,
    acquisition_cost   DECIMAL(10,2) NOT NULL,
    entry_date         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    branch_id          CHAR(36)      NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE obd2_device_vehicle_registration
(
    id              CHAR(36)  NOT NULL,
    obd2_id         CHAR(36)  NOT NULL,
    vehicle_id      CHAR(36)  NOT NULL,
    registered_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unregistered_at TIMESTAMP NULL    ,
    branch_id       CHAR(36)  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE obd2_devices
(
    id          CHAR(36)    NOT NULL,
    branch_id   CHAR(36)    NOT NULL,
    mac_address VARCHAR(17) NOT NULL,
    last_ping   DATETIME    NULL    ,
    status      VARCHAR(20) NOT NULL DEFAULT 'INACTIVE' COMMENT 'Enum: ACTIVE, INACTIVE',
    version     BIGINT      NOT NULL DEFAULT 0,
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NULL    ,
    deleted_at  TIMESTAMP   NULL    ,
    created_by  CHAR(36)    NOT NULL,
    updated_by  CHAR(36)    NULL    ,
    PRIMARY KEY (id)
);

ALTER TABLE obd2_devices
    ADD CONSTRAINT UQ_mac_address UNIQUE (mac_address);

CREATE TABLE owner_profiles
(
    id         CHAR(36)    NOT NULL,
    user_id    CHAR(36)    NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE password_recovery_tokens
(
    id         CHAR(36)     NOT NULL,
    user_id    CHAR(36)     NOT NULL,
    token      VARCHAR(100) NOT NULL,
    expires_at DATETIME     NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

ALTER TABLE password_recovery_tokens
    ADD CONSTRAINT UQ_token UNIQUE (token);

CREATE TABLE payments
(
    id         CHAR(36)      NOT NULL,
    voucher_id CHAR(36)      NOT NULL,
    amount     DECIMAL(10,2) NOT NULL,
    currency   VARCHAR(3)    NOT NULL DEFAULT 'PEN',
    method     VARCHAR(20)   NOT NULL COMMENT 'Enum: CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER',
    paid_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version    BIGINT        NOT NULL DEFAULT 0,
    branch_id  CHAR(36)      NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE products
(
    id                    CHAR(36)      NOT NULL,
    category_id           CHAR(36)      NOT NULL,
    branch_id             CHAR(36)      NOT NULL,
    product_name          VARCHAR(50)   NOT NULL,
    sku                   VARCHAR(50)   NOT NULL,
    description           TEXT          NULL    ,
    current_selling_price DECIMAL(10,2) NOT NULL,
    current_stock         INT           NOT NULL DEFAULT 0,
    minimum_stock         INT           NOT NULL,
    version               BIGINT        NOT NULL DEFAULT 0,
    created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     NULL    ,
    deleted_at            TIMESTAMP     NULL    ,
    created_by            CHAR(36)      NOT NULL,
    updated_by            CHAR(36)      NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE quotes
(
    id                  CHAR(36)      NOT NULL,
    work_order_id       CHAR(36)      NOT NULL,
    subtotal_amount     DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2)  NULL    ,
    total_amount        DECIMAL(10,2) NOT NULL,
    version             BIGINT        NOT NULL DEFAULT 0,
    status              VARCHAR(20)   NOT NULL DEFAULT 'DRAFT' COMMENT 'Enum: DRAFT, APPROVED, CANCELLED',
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NULL    ,
    deleted_at          TIMESTAMP     NULL    ,
    created_by          CHAR(36)      NOT NULL,
    updated_by          CHAR(36)      NULL    ,
    branch_id           CHAR(36)      NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE services
(
    id            CHAR(36)      NOT NULL,
    service_name  VARCHAR(50)   NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    branch_id     CHAR(36)      NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE specialties
(
    id             CHAR(36)    NOT NULL,
    specialty_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE telemetry_snapshots
(
    id                                  CHAR(36)  NOT NULL,
    obd2_device_vehicle_registration_id CHAR(36)  NOT NULL,
    branch_id                           CHAR(36)  NOT NULL,
    rpm                                 INT       NOT NULL,
    temp                                INT       NOT NULL,
    speed_kmh                           DOUBLE    NULL    ,
    odometer_km                         INT       NULL    ,
    fuel_level_percent                  DOUBLE    NULL    ,
    created_at                          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE users
(
    id              CHAR(36)     NOT NULL,
    email           VARCHAR(150) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    google_id       VARCHAR(255) NULL    ,
    document_type   VARCHAR(20)  NOT NULL COMMENT 'Enum: DNI, RUC, CE, PASSPORT',
    document_number VARCHAR(50)  NOT NULL,
    phone           CHAR(9)      NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NULL    ,
    deleted_at      TIMESTAMP    NULL    ,
    version         BIGINT       NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT UQ_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT UQ_password_hash UNIQUE (password_hash);

ALTER TABLE users
    ADD CONSTRAINT UQ_google_id UNIQUE (google_id);

ALTER TABLE users
    ADD CONSTRAINT UQ_document_number UNIQUE (document_number);

ALTER TABLE users
    ADD CONSTRAINT UQ_phone UNIQUE (phone);

CREATE TABLE vehicle_models
(
    id    CHAR(36)    NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE vehicles
(
    id               CHAR(36)    NOT NULL,
    user_id          CHAR(36)    NOT NULL,
    vehicle_model_id CHAR(36)    NOT NULL,
    plate_number     VARCHAR(20) NOT NULL,
    year             INT         NOT NULL,
    vin              VARCHAR(50) NOT NULL,
    current_mileage  INT         NOT NULL DEFAULT 0,
    created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP   NULL     DEFAULT CURRENT_TIMESTAMP,
    deleted_at       TIMESTAMP   NULL    ,
    PRIMARY KEY (id)
);

ALTER TABLE vehicles
    ADD CONSTRAINT UQ_plate_number UNIQUE (plate_number);

CREATE TABLE vouchers
(
    id              CHAR(36)       NOT NULL,
    quote_id        CHAR(36)       NOT NULL,
    voucher_number  VARCHAR(50)    NOT NULL,
    subtotal_amount DECIMAL(10,2)  NOT NULL,
    total_amount    DECIMAL(10,2)  NOT NULL,
    type            VARCHAR(20)    NOT NULL COMMENT 'Enum: INVOICE, RECEIPT, CREDIT_NOTE',
    status          VARCHAR(20)    NOT NULL DEFAULT 'PENDING' COMMENT 'Enum: PENDING, PAID',
    version         BIGINT         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP      NULL    ,
    deleted_at      TIMESTAMP      NULL    ,
    created_by      CHAR(36)       NOT NULL,
    updated_by      CHAR(36)       NULL    ,
    currency        CHAR(3)        NOT NULL DEFAULT 'PEN',
    branch_id       CHAR(36)       NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE work_order_task_products
(
    work_order_task_id CHAR(36)      NOT NULL,
    product_id         CHAR(36)      NOT NULL,
    quantity           INT           NOT NULL,
    unit_price         DECIMAL(10,2) NOT NULL,
    total_amount       DECIMAL(10,2) NOT NULL,
    created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP     NULL    ,
    deleted_at         TIMESTAMP     NULL    ,
    branch_id          CHAR(36)      NOT NULL,
    PRIMARY KEY (work_order_task_id, product_id)
) COMMENT 'the products usage in the work order task';

CREATE TABLE work_order_tasks
(
    id            CHAR(36)      NOT NULL,
    work_order_id CHAR(36)      NOT NULL,
    service_id    CHAR(36)      NOT NULL,
    description   TEXT          NULL    ,
    mechanic_id   CHAR(36)      NOT NULL,
    total_price   DECIMAL(10,2) NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING' COMMENT 'Enum: PENDING, DOING, DONE',
    hours         DECIMAL(5,2)  NULL     COMMENT 'Real hours spent on the task',
    started_at    DATETIME      NULL    ,
    completed_at  DATETIME      NULL    ,
    version       BIGINT        NULL     DEFAULT 0,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NULL    ,
    deleted_at    TIMESTAMP     NULL    ,
    created_by    CHAR(36)      NOT NULL,
    updated_by    CHAR(36)      NULL    ,
    branch_id     CHAR(36)      NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE work_orders
(
    id              CHAR(36)    NOT NULL,
    workbay_id      CHAR(36)    NOT NULL,
    branch_id       CHAR(36)    NOT NULL,
    internal_number INT         NOT NULL,
    customer_id     CHAR(36)    NOT NULL,
    vehicle_id      CHAR(36)    NOT NULL,
    current_mileage INT         NOT NULL DEFAULT 0,
    diagnosis       TEXT        NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS' COMMENT 'Enum: IN_PROGRESS, COMPLETED, PAID',
    version         BIGINT      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NULL    ,
    closed_at       DATETIME    NULL    ,
    deleted_at      TIMESTAMP   NULL    ,
    created_by      CHAR(36)    NOT NULL,
    updated_by      CHAR(36)    NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE workbays
(
    id              CHAR(36)    NOT NULL,
    branch_id       CHAR(36)    NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'VACANT' COMMENT 'Enum: VACANT, OCCUPIED, NOT AVAILABLE',
    version         BIGINT      NOT NULL DEFAULT 0,
    internal_number INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NULL    ,
    deleted_at      TIMESTAMP   NULL    ,
    PRIMARY KEY (id)
);

CREATE TABLE workshops
(
    id                      CHAR(36)     NOT NULL,
    owner_id                CHAR(36)     NOT NULL,
    mileage_interval_config INT          NULL     DEFAULT 1,
    tax_id                  VARCHAR(50)  NOT NULL,
    workshop_name           VARCHAR(50)  NOT NULL COMMENT 'RUC',
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    version                 BIGINT       NOT NULL DEFAULT 0,
    created_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP    NULL    ,
    deleted_at              TIMESTAMP    NULL    ,
    PRIMARY KEY (id)
);

ALTER TABLE workshops
    ADD CONSTRAINT UQ_tax_id UNIQUE (tax_id);

ALTER TABLE branches
    ADD CONSTRAINT FK_workshops_TO_branches
        FOREIGN KEY (workshop_id)
            REFERENCES workshops (id);

ALTER TABLE password_recovery_tokens
    ADD CONSTRAINT FK_users_TO_password_recovery_tokens
        FOREIGN KEY (user_id)
            REFERENCES users (id);

ALTER TABLE workbays
    ADD CONSTRAINT FK_branches_TO_workbays
        FOREIGN KEY (branch_id)
            REFERENCES branches (id);

ALTER TABLE appointments
    ADD CONSTRAINT FK_branches_TO_appointments
        FOREIGN KEY (branch_id)
            REFERENCES branches (id);

ALTER TABLE obd2_devices
    ADD CONSTRAINT FK_branches_TO_obd2_devices
        FOREIGN KEY (branch_id)
            REFERENCES branches (id);

ALTER TABLE obd2_device_vehicle_registration
    ADD CONSTRAINT FK_obd2_devices_TO_obd2_device_vehicle_registration
        FOREIGN KEY (obd2_id)
            REFERENCES obd2_devices (id);

ALTER TABLE dtc_alerts
    ADD CONSTRAINT FK_telemetry_snapshots_TO_dtc_alerts
        FOREIGN KEY (telemetry_snapshot_id)
            REFERENCES telemetry_snapshots (id);

ALTER TABLE work_orders
    ADD CONSTRAINT FK_workbays_TO_work_orders
        FOREIGN KEY (workbay_id)
            REFERENCES workbays (id);

ALTER TABLE work_order_tasks
    ADD CONSTRAINT FK_work_orders_TO_work_order_tasks
        FOREIGN KEY (work_order_id)
            REFERENCES work_orders (id);

ALTER TABLE work_order_task_products
    ADD CONSTRAINT FK_work_order_tasks_TO_work_order_task_products
        FOREIGN KEY (work_order_task_id)
            REFERENCES work_order_tasks (id);

ALTER TABLE work_order_task_products
    ADD CONSTRAINT FK_products_TO_work_order_task_products
        FOREIGN KEY (product_id)
            REFERENCES products (id);

ALTER TABLE quotes
    ADD CONSTRAINT FK_work_orders_TO_quotes
        FOREIGN KEY (work_order_id)
            REFERENCES work_orders (id);

ALTER TABLE vouchers
    ADD CONSTRAINT FK_quotes_TO_vouchers
        FOREIGN KEY (quote_id)
            REFERENCES quotes (id);

ALTER TABLE payments
    ADD CONSTRAINT FK_vouchers_TO_payments
        FOREIGN KEY (voucher_id)
            REFERENCES vouchers (id);

ALTER TABLE work_order_tasks
    ADD CONSTRAINT FK_services_TO_work_order_tasks
        FOREIGN KEY (service_id)
            REFERENCES services (id);

ALTER TABLE vehicles
    ADD CONSTRAINT FK_users_TO_vehicles
        FOREIGN KEY (user_id)
            REFERENCES users (id);

ALTER TABLE products
    ADD CONSTRAINT FK_categories_TO_products
        FOREIGN KEY (category_id)
            REFERENCES categories (id);

ALTER TABLE inventory_batches
    ADD CONSTRAINT FK_products_TO_inventory_batches
        FOREIGN KEY (product_id)
            REFERENCES products (id);

ALTER TABLE products
    ADD CONSTRAINT FK_branches_TO_products
        FOREIGN KEY (branch_id)
            REFERENCES branches (id);

ALTER TABLE obd2_device_vehicle_registration
    ADD CONSTRAINT FK_vehicles_TO_obd2_device_vehicle_registration
        FOREIGN KEY (vehicle_id)
            REFERENCES vehicles (id);

ALTER TABLE telemetry_snapshots
    ADD CONSTRAINT FK_obd2_device_vehicle_registration_TO_telemetry_snapshots
        FOREIGN KEY (obd2_device_vehicle_registration_id)
            REFERENCES obd2_device_vehicle_registration (id);

ALTER TABLE customer_registration
    ADD CONSTRAINT FK_branches_TO_customer_registration
        FOREIGN KEY (branch_id)
            REFERENCES branches (id);

ALTER TABLE employee_registration
    ADD CONSTRAINT FK_branches_TO_employee_registration
        FOREIGN KEY (branch_id)
            REFERENCES branches (id);

ALTER TABLE customer_profiles
    ADD CONSTRAINT FK_users_TO_customer_profiles
        FOREIGN KEY (user_id)
            REFERENCES users (id);

ALTER TABLE employee_profiles
    ADD CONSTRAINT FK_users_TO_employee_profiles
        FOREIGN KEY (user_id)
            REFERENCES users (id);

ALTER TABLE owner_profiles
    ADD CONSTRAINT FK_users_TO_owner_profiles
        FOREIGN KEY (user_id)
            REFERENCES users (id);

ALTER TABLE workshops
    ADD CONSTRAINT FK_owner_profiles_TO_workshops
        FOREIGN KEY (owner_id)
            REFERENCES owner_profiles (id);

ALTER TABLE customer_registration
    ADD CONSTRAINT FK_customer_profiles_TO_customer_registration
        FOREIGN KEY (customer_id)
            REFERENCES customer_profiles (id);

ALTER TABLE employee_registration
    ADD CONSTRAINT FK_employee_profiles_TO_employee_registration
        FOREIGN KEY (employee_id)
            REFERENCES employee_profiles (id);

ALTER TABLE vehicles
    ADD CONSTRAINT FK_vehicle_models_TO_vehicles
        FOREIGN KEY (vehicle_model_id)
            REFERENCES vehicle_models (id);

ALTER TABLE employee_registration
    ADD CONSTRAINT FK_specialties_TO_employee_registration
        FOREIGN KEY (specialty_id)
            REFERENCES specialties (id);

ALTER TABLE work_orders
    ADD CONSTRAINT FK_customer_profiles_TO_work_orders
        FOREIGN KEY (customer_id)
            REFERENCES customer_profiles (id);

ALTER TABLE work_orders
    ADD CONSTRAINT FK_vehicles_TO_work_orders
        FOREIGN KEY (vehicle_id)
            REFERENCES vehicles (id);
