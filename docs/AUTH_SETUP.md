# GearGuard - Sign Up + OTP Implementation

Complete authentication system with OTP verification using Brevo email service.

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies**
```bash
cd gearguard-backend
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Required Environment Variables**
```env
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your-super-secret-jwt-key-here
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER=noreply@yourdomain.com
ADMIN_EMAIL=admin@gearguard.com
ADMIN_PASSWORD=admin123
```

4. **Seed Admin User**
```bash
npm run seed:admin
```

5. **Start Development Server**
```bash
npm run dev
```

### Frontend Setup

1. **Install dependencies**
```bash
cd gearguard-frontend
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. **Start Development Server**
```bash
npm run dev
```

## 🔐 Authentication Flow

### Sign Up Process
1. User fills signup form (name, email, password, confirmPassword)
2. Frontend validates and sends to `/api/auth/send-otp`
3. Backend generates 6-digit OTP, stores hashed in MongoDB
4. Brevo sends OTP email to user
5. User enters OTP on verification page
6. Backend verifies OTP and creates user account
7. JWT token set in httpOnly cookie
8. User redirected to dashboard

### Security Features
- Passwords hashed with bcryptjs
- OTPs hashed before storage
- 10-minute OTP expiry with MongoDB TTL
- Rate limiting (5 OTPs per hour per email)
- httpOnly, secure cookies
- Input validation and sanitization
- Role-based access control

## 📧 Brevo Integration

### Setup Brevo Account
1. Sign up at [Brevo](https://www.brevo.com/)
2. Get API key from Settings > API Keys
3. Verify sender email domain
4. Add credentials to `.env`

### Email Template
- Professional HTML template
- 6-digit code prominently displayed
- 10-minute expiry notice
- Branded with GearGuard styling

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user|technician|manager|admin),
  teamId: ObjectId (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model
```javascript
{
  email: String,
  otpHash: String,
  attempts: Number (max 5),
  expiresAt: Date (TTL index),
  createdAt: Date
}
```

## 🎨 Frontend Features

### UI Components
- **DaisyUI**: Pre-built, accessible components
- **TailwindCSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Split Layout**: Brand panel + form panel

### UX Features
- Real-time form validation
- Password visibility toggle
- 6-digit OTP input with auto-focus
- Resend timer (60 seconds)
- Loading states and error handling
- Toast notifications

## 🛡️ Security Considerations

### Backend Security
- CORS configured for credentials
- JWT tokens in httpOnly cookies
- Password strength validation
- Email format validation
- Rate limiting on OTP requests
- Role-based route protection

### Frontend Security
- No sensitive data in localStorage
- Temporary signup state in memory
- Automatic token refresh
- Protected route handling

## 📱 API Endpoints

### Authentication Routes
- `POST /api/auth/send-otp` - Send OTP for signup
- `POST /api/auth/verify-otp` - Verify OTP and create account
- `POST /api/auth/login` - Standard login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run seed:admin   # Create admin user
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🚀 Deployment Notes

### Environment Variables
- Set `NODE_ENV=production` for backend
- Configure CORS for production frontend URL
- Use secure MongoDB connection string
- Set secure cookie flags in production

### Cookie Configuration
```javascript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}
```

## 🎯 Next Steps

1. **Login Component**: Standard email/password login
2. **Dashboard**: Main application interface
3. **Equipment Management**: CRUD operations
4. **Maintenance Requests**: Ticket system
5. **Role Management**: Admin panel for user roles
6. **Team Management**: Technician team assignments

## 🐛 Troubleshooting

### Common Issues
- **CORS errors**: Check frontend URL in backend CORS config
- **Cookie not set**: Ensure `withCredentials: true` in axios
- **OTP not received**: Verify Brevo API key and sender email
- **MongoDB connection**: Check connection string and network access

### Debug Commands
```bash
# Check MongoDB connection
mongosh "mongodb://localhost:27017/gearguard"

# Test Brevo API
curl -X POST "https://api.brevo.com/v3/account" \
  -H "api-key: YOUR_API_KEY"
```