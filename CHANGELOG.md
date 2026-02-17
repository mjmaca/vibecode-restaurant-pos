# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17

### Added
- Initial release of Restaurant Inventory Management System
- Firebase Authentication with role-based access control (ADMIN, STAFF)
- GraphQL API with Apollo Server
- Complete Inventory Management (Create, Read, Update, Archive)
- Stock Movements tracking (IN, OUT, ADJUSTMENT)
- Suppliers management
- Dashboard with real-time statistics
  - Total inventory value
  - Low stock alerts
  - Expiring items tracking
  - Recent stock movements
- Modern Material-UI interface
- Responsive design for desktop, tablet, and mobile
- TanStack Table with sorting and filtering
- React Hook Form for form validation
- Recharts for data visualization
- Vercel deployment configuration
- Comprehensive documentation
  - README.md - Full project documentation
  - QUICKSTART.md - Quick start guide
  - DEPLOYMENT.md - Deployment instructions
  - API.md - GraphQL API documentation
  - FIRESTORE_INDEXES.md - Database indexing guide
- Helper scripts
  - set-user-role.js - Set admin/staff roles
  - seed-data.js - Seed initial test data
- Firestore security rules
- TypeScript support throughout the project

### Security
- Firebase ID token verification
- Role-based access control in resolvers
- Firestore security rules
- Environment variable encryption
- HTTPS enforced in production

### Performance
- Apollo Client caching
- Firestore indexes for optimized queries
- Code splitting with React lazy loading
- Optimized bundle size with Vite

## [Unreleased]

### Planned Features
- Recipe management (ingredients → dishes)
- Automated low stock alerts (email/SMS)
- Advanced analytics and reporting
- Multi-location support
- Barcode scanning
- Purchase order management
- Waste tracking
- Mobile app (React Native)
- Export functionality (CSV, PDF)
- Batch operations
- Advanced filtering and search
- Dark mode toggle
- Multi-language support
- Offline support with service workers

---

For support or feature requests, please open an issue on GitHub.
