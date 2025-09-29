# Invoice Management System

A comprehensive, user-friendly invoice management system designed for freelancers and small to medium-sized businesses (SMBs). Streamline your entire billing lifecycle from quotation to payment reconciliation.

## 🚀 Features

### 📊 Dashboard & Analytics
- Interactive financial metrics dashboard
- Real-time tracking of revenue, expenses, and profit/loss
- Graphical representation of sales and purchases
- Customizable date range filters (Weekly, Monthly, Quarterly, Half-Yearly, Yearly)

### 👥 Client Management (CRM)
- Centralized client database with complete contact information
- Client history tracking (invoices, payments, quotations)
- Tax ID and company information management

### 📄 Document Management
- **Quotations**: Create and track professional estimates
- **Proforma Invoices**: Generate pre-invoices for client commitment
- **Invoices**: Full invoice creation with line items, discounts, and taxes
- One-click conversion from quotation to invoice

### 💰 Financial Management
- **Accounts Receivable**: Track incoming payments with partial payment support
- **Accounts Payable**: Manage outgoing bills and expenses
- Payment gateway integration (Stripe, PayPal, Razorpay)
- Online payment links for clients

### 🎨 Customization & Branding
- Fully customizable invoice templates
- Custom color schemes and logo placement
- Multiple professional layouts
- Custom fields and terms & conditions

### 🔔 Automation & Notifications
- Automated overdue payment reminders
- Internal notifications for receivables and payables
- Email notifications for invoice status updates

### 📈 Data Management & Export
- Export to Excel/Google Sheets
- Professional PDF generation
- Comprehensive financial reports
- Data categorization and filtering

## 🛠️ Technology Stack

- **Frontend**: React.js with TypeScript + Tailwind CSS
- **Backend**: Node.js with Express + TypeScript
- **Database**: Supabase (PostgreSQL with built-in APIs)
- **Authentication**: Firebase Auth
- **Charts**: Recharts for analytics visualization
- **PDF Generation**: jsPDF
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
InvoiceAPP/
├── client/              # React frontend application
├── server/              # Node.js backend API
├── shared/              # Shared TypeScript types and utilities
├── docs/                # Project documentation
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
├── package.json         # Root package.json for scripts
└── docker-compose.yml   # Local development environment
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BhagyeshPatil2004/Invoice-System.git
   cd Invoice-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your configuration
   # - Supabase URL and API Key
   # - Firebase configuration
   # - Stripe API keys
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:client    # Frontend only
   npm run dev:server    # Backend only
   ```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Add to your `.env` file

### Firebase Auth Setup
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication with desired providers
3. Add Firebase config to your `.env` file

### Stripe Integration
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys
3. Add to your `.env` file

## 📚 API Documentation

API documentation will be available at `http://localhost:3001/api/docs` when running the development server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bhagyesh Patil** - [BhagyeshPatil2004](https://github.com/BhagyeshPatil2004)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for scalability and performance
- Focus on user experience and accessibility

---

**Happy Invoicing! 💼✨**
