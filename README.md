# 📄 Invoice Management System

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Supabase-blueviolet)

> A modern, web-based Invoice Management System designed to digitalize, automate, and streamline billing workflows for small and medium-scale businesses (SMEs).

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Future Scope](#-future-scope)
- [Author](#-author)

---

## 🚀 Project Overview

The **Invoice Management System** is a full-stack web application designed to replace manual and spreadsheet-based invoicing with a structured, secure, and analytics-driven solution.

**It enables businesses to:**
- Create and manage professional invoices.
- Maintain centralized customer and inventory records.
- Automate tax and total calculations.
- Track payments and outstanding dues.
- Visualize financial performance via detailed dashboards.

**Ideal for:** Freelancers, Startups, and SMEs looking for simplicity, accuracy, and scalability.

---

## ✨ Key Features

### 🔐 Authentication & Security
- Secure user authentication (Email + Password)
- Robust Session Management
- **Row-Level Security (RLS)** for strict data isolation

### 🧾 Invoice Management
| Feature | Description |
| :--- | :--- |
| **CRUD Operations** | Create, Update, Delete invoices easily |
| **Line Items** | Multiple line items support per invoice |
| **Auto-Calc** | Automatic subtotal, tax, and total computation |
| **Status Tracking** | Track status: `Paid` \| `Pending` \| `Overdue` |
| **PDF Export** | Generate professional A4 PDF invoices instantly |

### 👥 Client & Inventory Management
- **Centralized Directory**: Manage all clients in one place.
- **Health Score**: AI-driven evaluation of client reliability based on payment behavior (Good/Average/Poor).
- **Inventory Sync**: Real-time product/service catalog with auto-selection.

### 📊 Dashboard & Analytics
- **Financial Summaries**: Total revenue, outstanding, and overdue payments.
- **Visual Trends**: Monthly performance charts.
- **Real-time Insights**: Data-driven decision making.

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend & Database
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Tools & DevOps
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

---

## 🏗 System Architecture

The system follows a modern web-based **Client-Server Architecture**:

```mermaid
graph TD
    User((User))
    Frontend[Frontend (React SPA)]
    Backend[Supabase BaaS]
    DB[(PostgreSQL Database)]

    User -->|Interacts| Frontend
    Frontend -->|REST / Realtime APIs| Backend
    Backend -->|Auth & RLS| DB
```

---

## ⚙️ Functional Requirements

1. **User Auth**: Secure sign-up/sign-in flows.
2. **Invoice Ops**: Full lifecycle management of invoices.
3. **Calculations**: Automated tax processing.
4. **Reporting**: Financial dashboards and client scoring.
5. **Exports**: Downloadable PDF invoices.

---

## 🧠 Core Algorithms

| Algorithm | Purpose | Complexity |
| :--- | :--- | :--- |
| **Invoice Calculation** | Subtotal, Tax & Total | O(n) |
| **Client Health Score** | Reliability Assessment | O(1) |
| **Invoice Search** | Real-time Filtering | O(n) |

---

## 🔮 Future Scope

- [ ] **Payment Gateway**: Integration with Razorpay/Stripe.
- [ ] **Compliance**: GST and e-Invoicing support.
- [ ] **Mobile App**: Native Android/iOS applications.
- [ ] **AI Features**: OCR for invoice parsing.

---

## 👤 Author

**Bhagyesh Rajendra Patil**

Make sure to star the repo if you find it useful! 🌟
