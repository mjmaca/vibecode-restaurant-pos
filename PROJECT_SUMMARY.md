# Restaurant Inventory Management System

Production-ready inventory management system for restaurants and cafés.

## ✅ Project Complete!

All features have been implemented:

- ✅ Project structure with TypeScript, Vite, React
- ✅ GraphQL backend with Apollo Server
- ✅ Firebase Admin SDK integration
- ✅ Firebase Authentication with role-based access
- ✅ Complete Inventory Management (CRUD)
- ✅ Stock Movements tracking
- ✅ Suppliers management
- ✅ Dashboard with statistics
- ✅ Modern Material-UI interface
- ✅ Responsive design
- ✅ Vercel deployment configuration
- ✅ Comprehensive documentation

## 📚 Documentation

- **[README.md](./README.md)** - Full project documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel
- **[API.md](./API.md)** - GraphQL API documentation

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see QUICKSTART.md)
cp .env.example .env
# Edit .env with your Firebase config

# Run development server
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
vibecode-restaurant-pos/
├── api/                    # GraphQL backend
│   ├── graphql/
│   │   ├── resolvers/     # Business logic
│   │   └── typeDefs.ts    # GraphQL schema
│   ├── lib/
│   │   ├── auth.ts        # Authentication & authorization
│   │   └── firebase-admin.ts
│   └── graphql.ts         # Serverless API handler
│
├── src/                    # React frontend
│   ├── components/
│   │   ├── inventory/     # Ingredient modals
│   │   ├── layout/        # Dashboard layout
│   │   └── suppliers/     # Supplier components
│   ├── contexts/          # React contexts
│   ├── graphql/           # GraphQL queries
│   ├── pages/             # Page components
│   ├── services/          # Firebase & Apollo setup
│   └── types/             # TypeScript types
│
├── .env.example           # Environment variables template
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
└── Documentation files    # README, guides, API docs
```

## 🎯 Features

### Authentication & Authorization
- Firebase Authentication (Email/Password)
- Role-based access control (ADMIN, STAFF)
- Secure token verification

### Inventory Management
- Create, read, update, archive ingredients
- Stock status indicators (Safe/Low/Critical)
- Category filtering and search
- Expiry date tracking
- Cost per unit and total value calculation

### Stock Movements
- Record IN/OUT/ADJUSTMENT movements
- Automatic stock updates
- Movement history with filtering
- Prevent negative stock

### Suppliers
- Manage supplier information
- Link ingredients to suppliers
- Contact details tracking

### Dashboard
- Total inventory value
- Low stock alerts
- Expiring items count
- Recent stock movements
- Real-time statistics

### UI/UX
- Material-UI components
- Responsive design (desktop/tablet/mobile)
- TanStack Table with sorting & filtering
- Modal forms with validation
- Loading states and error handling

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Material-UI + Tailwind CSS
- Apollo Client (GraphQL)
- React Hook Form
- TanStack Table
- Recharts

**Backend:**
- GraphQL (Apollo Server)
- Firebase Firestore
- Firebase Authentication
- Firebase Admin SDK

**Deployment:**
- Vercel (frontend + serverless API)

## 📊 Data Models

**Ingredient:**
- Basic info (name, category, unit)
- Stock levels (current, threshold)
- Pricing (cost per unit, total value)
- Supplier link
- Expiry date
- Status (archived flag)

**Stock Movement:**
- Type (IN/OUT/ADJUSTMENT)
- Quantity
- Note
- Performed by (user ID)
- Timestamp

**Supplier:**
- Name, contact person
- Email, phone, address
- Creation/update timestamps

## 🔒 Security

- Firebase ID token verification
- Role-based resolver protection
- Firestore security rules
- Environment variable encryption
- HTTPS enforced in production

## 📱 Responsive Design

- Desktop: Full sidebar layout
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation
- All tables are horizontally scrollable

## 🧪 Testing Checklist

- [ ] User authentication works
- [ ] Can create ingredients
- [ ] Can update ingredients
- [ ] Can archive ingredients
- [ ] Stock movements update inventory
- [ ] Cannot reduce stock below zero
- [ ] Dashboard shows correct statistics
- [ ] Low stock alerts work
- [ ] Expiring items detected
- [ ] Suppliers can be managed
- [ ] Filtering and search work
- [ ] Role-based access enforced

## 📈 Production Ready

This project includes:
- TypeScript for type safety
- Error boundaries
- Loading states
- Form validation
- API error handling
- Security best practices
- Comprehensive documentation
- Deployment configuration

## 🚢 Deployment Steps

1. Set up Firebase project
2. Configure environment variables
3. Create admin user
4. Deploy to Vercel
5. Set Firestore security rules
6. Create database indexes

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 💡 Future Enhancements

- Recipe management (ingredients → dishes)
- Automated low stock alerts (email/SMS)
- Advanced analytics and reporting
- Multi-location support
- Barcode scanning
- Purchase order management
- Waste tracking
- Mobile app (React Native)

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Fork and customize
- Add new features
- Improve documentation
- Report issues

## 📄 License

MIT License - See LICENSE file

## 🙏 Credits

Built with modern web technologies and best practices for production use.

---

**Ready to deploy!** Follow QUICKSTART.md to get started. 🚀
