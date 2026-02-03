# LawConnect - Legal Services Platform

A comprehensive legal services platform connecting clients with lawyers, featuring case management, bidding system, real-time chat, and payment processing.

## 🚀 Features

### Core Features
- **User Management**: Client, Lawyer, and Admin roles
- **Case Management**: Create, track, and manage legal cases
- **Bidding System**: Lawyers bid on cases, clients accept bids
- **Real-time Chat**: Secure messaging between clients and lawyers
- **Payment System**: Pay-to-chat functionality with Razorpay integration
- **Admin Dashboard**: Complete platform management

### Advanced Features
- **Authentication**: JWT-based secure authentication
- **Role-based Access**: Different permissions for different user types
- **Real-time Notifications**: Socket.IO for instant updates
- **File Sharing**: Document exchange between parties
- **Search & Filter**: Advanced case and user search
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
deploy-ready/
├── frontend/           # React frontend application
├── backend/            # Node.js backend API
├── database/           # MySQL database schema
└── docs/              # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **React Bootstrap** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Socket.IO** - Real-time server
- **JWT** - Authentication tokens
- **Razorpay** - Payment processing
- **Bcrypt** - Password hashing

### Database
- **MySQL** - Primary database
- **Relational Schema** - Normalized tables
- **Foreign Keys** - Data integrity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE lawconnect_db;

-- Import schema
mysql -u root -p lawconnect_db < database/database.sql
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Update .env with your database credentials and Razorpay keys

# Start server
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm start
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lawconnect_db

# JWT
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Server
PORT=5004
NODE_ENV=production
```

## 📱 User Roles & Permissions

### Client
- Create and manage cases
- View lawyer bids
- Accept/reject bids
- Pay for chat access
- Communicate with lawyers

### Lawyer
- Browse available cases
- Submit bids on cases
- Chat with clients (after bid acceptance)
- Manage profile

### Admin
- Complete platform oversight
- User management
- Case monitoring
- Payment tracking
- System analytics

## 💰 Payment System

### Pay-to-Chat Feature
- **Amount**: ₹150 per case
- **Payment Methods**: Credit Card, Debit Card, UPI, Net Banking
- **Gateway**: Razorpay (PCI DSS compliant)
- **Flow**: Client pays → Chat access unlocks

### Payment Security
- 3D Secure authentication
- SSL encryption
- Auto-refund support
- Transaction logging

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- SQL injection prevention
- XSS protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Cases
- `GET /api/cases` - List cases
- `POST /api/cases` - Create case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Bids
- `GET /api/bids/case/:caseId` - Get case bids
- `POST /api/bids` - Submit bid
- `PUT /api/bids/:id/accept` - Accept bid
- `PUT /api/bids/:id/reject` - Reject bid

### Messages
- `GET /api/messages/case/:caseId` - Get case messages
- `POST /api/messages` - Send message
- `PUT /api/messages/read/:caseId` - Mark as read

### Payments
- `POST /api/payments/chat-access` - Create payment
- `GET /api/payments/chat-access/:caseId` - Check access
- `POST /api/payments/complete` - Payment webhook

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel, Netlify, or any static hosting
```

### Backend Deployment
```bash
# Deploy to Railway, Heroku, or any Node.js hosting
cd backend
npm install --production
npm start
```

### Environment Setup
- Set production environment variables
- Configure database connection
- Set up Razorpay webhook URLs
- Configure SSL certificates

## 📈 Monitoring & Analytics

### Key Metrics
- User registration and activity
- Case creation and completion rates
- Bid acceptance rates
- Payment conversion rates
- Chat usage statistics

### Logs
- Application logs
- Error tracking
- Payment transaction logs
- User activity logs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- Email: support@lawconnect.com
- Documentation: [Link to docs]
- Issues: [Link to GitHub Issues]

---

**LawConnect** - Connecting Justice with Technology 🚀⚖️
