# Pharmacy Management System

## Project Description

Build a Single Page Application (SPA) using AngularJS to manage a Pharmacy system.

The system should allow users to:

Manage medicines

Manage customers

Create sales invoices

Search and filter data

Navigate between pages using AngularJS routing

## ERD

```mermaid

erDiagram
    CUSTOMERS {
        INT customer_id PK
        VARCHAR name
        VARCHAR phone
        VARCHAR email
        TIMESTAMP date_registered
    }

    INVOICES {
        INT invoice_id PK
        INT customer_id FK
        UUID created_by FK
        TIMESTAMP invoice_date
        NUMERIC total_amount
        NUMERIC discount
        VARCHAR payment_status
    }

    INVOICE_ITEMS {
        INT id PK
        INT invoice_id FK
        INT medicine_id FK
        INT quantity
        NUMERIC unit_price
    }

    MEDICINES {
        INT medicine_id PK
        VARCHAR name
        TEXT description
        VARCHAR form
        INT quantity
        NUMERIC strip_price
        NUMERIC ampoule_price
        NUMERIC box_price
        DATE expiry_date
    }

    AUTH_USERS {
        UUID id PK
    }

    USERS_METADATA {
        UUID id PK
        TEXT role
        TIMESTAMPTZ created_at
        TEXT name
        TEXT email
    }

    CUSTOMERS ||--o{ INVOICES : places
    INVOICES ||--o{ INVOICE_ITEMS : contains
    MEDICINES ||--o{ INVOICE_ITEMS : included_in
    AUTH_USERS ||--o{ INVOICES : creates
    AUTH_USERS ||--|| USERS_METADATA : has

```

<!-- Features:

Update medicine quantities
Issue invoices for customers with the ability to apply discounts to each invoice
Manage customers

Pages:

Dashboard – Main control panel
Medicines – Manage inventory
Invoices – Issue invoices with the ability to apply discounts
Manage Customers

Roles:

1-Admin

Pages:
Dashboard – Main control panel
Users Management – Manage users
Medicines Management – Manage inventory
Invoices – View and manage invoices
------Reports – Comprehensive reports

Features:

Add / Edit / Delete users
user permissions
Update/ View inventory
add new medicines
Issue and review invoices

2-Pharmacist /Staff -->
