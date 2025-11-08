# Procuroid Frontend

A sophisticated React-based procurement dashboard built with Vite, TypeScript, and Tailwind CSS.

## Features

### 🏠 Dashboard
- **Order Expenses Chart**: Interactive spending trends with Daily/Weekly/Monthly filters
- **Pending Approvals**: Actionable list of quotes awaiting review with approve/reject/meeting options
- **Recent Orders Timeline**: Visual tracking of order status progression

### 📦 Orders Management
- **Comprehensive Orders Table**: Searchable and filterable table of all orders
- **Quotations Comparison**: Side-by-side comparison of supplier bids
- **Order History**: Complete order lifecycle tracking

### 🏢 Supplier Management
- **Supplier Directory**: Complete CRM functionality for supplier relationships
- **Performance Tracking**: Ratings, order history, and performance metrics
- **Internal Notes**: Team collaboration with supplier-specific notes
- **Contact Management**: Complete supplier contact information

### 📅 Calendar Integration
- **Interactive Calendar**: Full-screen calendar for scheduling
- **Event Management**: Meetings, calls, and delivery scheduling
- **Automated Entries**: AI-scheduled meetings and calls
- **Manual Scheduling**: User-initiated event creation

### 🎯 Core Actions
- **Place New Order Modal**: Two-step process with AI-powered description parsing
- **Notification Center**: Real-time alerts for quotes, meetings, and deliveries
- **Global Actions**: Always-accessible order placement

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **Date-fns** for date manipulation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd procuroid-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update with your Supabase credentials
   - Set `VITE_API_BASE_URL` to your backend URL:
     - Local: `http://localhost:5000`
     - Production: `https://procuroid-369418280809.us-central1.run.app`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Configure environment variables:
   - Copy `.env.production.example` to `.env.production`
   - Update with your production Supabase credentials
   - Set `VITE_API_BASE_URL` to your production backend URL

2. Build:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Switching Between Local and Cloud Backend

You can easily toggle between localhost and your Cloud Run backend by setting the `VITE_API_BASE_URL` environment variable:

**For local development:**
```bash
# In .env.local
VITE_API_BASE_URL=http://localhost:5000
```

**For Cloud Run (production):**
```bash
# In .env.production
VITE_API_BASE_URL=https://procuroid-369418280809.us-central1.run.app
```

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with sidebar and header
│   ├── PlaceOrderModal.tsx     # Order placement modal
│   └── NotificationCenter.tsx  # Notification dropdown
├── pages/
│   ├── Dashboard.tsx          # Dashboard with charts and overview
│   ├── Orders.tsx              # Orders management page
│   ├── Suppliers.tsx           # Supplier CRM page
│   └── Calendar.tsx            # Calendar and scheduling page
├── App.tsx                     # Main app component with routing
├── main.tsx                    # Application entry point
└── index.css                   # Global styles with Tailwind
```

## Features Overview

### Dashboard
- Real-time expense tracking with interactive charts
- Pending approvals with quick action buttons
- Order timeline with visual progress indicators

### Orders
- Advanced filtering and search capabilities
- Quotation comparison interface
- Complete order lifecycle management

### Suppliers
- Supplier performance dashboard
- Order history and analytics
- Internal notes and collaboration tools

### Calendar
- Full calendar view with event management
- Event type categorization (meetings, calls, deliveries)
- Integration-ready for external calendar APIs

## Dummy Data

The application comes pre-populated with realistic dummy data including:
- Sample orders with various statuses
- Supplier information with ratings and history
- Calendar events and meetings
- Notifications and alerts

## API Integration

The frontend is designed to integrate with backend APIs. Current placeholder endpoints include:
- Order management endpoints
- Supplier data endpoints
- Calendar integration endpoints
- Notification services

## Styling

The application uses a minimalist design approach with:
- Clean, modern interface
- Consistent color scheme
- Responsive design for all screen sizes
- Accessible components with proper contrast

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project follows React best practices with:
- TypeScript for type safety
- Functional components with hooks
- Proper component separation
- Consistent naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.