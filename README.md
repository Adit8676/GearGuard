# GearGuard
GearGuard is a lightweight maintenance management system built to help organizations track equipment, manage maintenance requests, and assign tasks efficiently.

**Video Demo**: [Click Here](https://youtu.be/8i3IknFytxM)

## Team Members

| Name                   | Role / Branch | Institute    | GitHub                                            |
| ---------------------- | ------------- | ------------ | ------------------------------------------------- |
| **Aditya Singh**       | CSE '27       | MANIT Bhopal | [Adit8676](https://github.com/Adit8676)           |
| **Devesh Danderwal**   | CSE '27       | MANIT Bhopal | [Thermo041](https://github.com/Thermo041)         |
| **Dhanvi Shah**        | ECE '27       | MANIT Bhopal | [Dshah0711](https://github.com/Dshah0711)         |
| **Shivansh Srivastav** | CSE '27       | MANIT Bhopal | [Shivansh11956](https://github.com/Shivansh11956) |

## Features

### Multi-Role Dashboard System
- **Admin Dashboard**: Complete system management and oversight
- **User Dashboard**: Submit and track maintenance requests
- **Technician Dashboard**: Kanban-style task management and execution
- **Manager Dashboard**: Team oversight and request assignment

### Core Functionality
- **Equipment Management**: Track and organize all equipment assets
- **Smart Request Routing**: Automatic assignment based on equipment teams
- **Real-time Status Updates**: Live tracking of maintenance progress
- **Calendar Integration**: Schedule and view preventive maintenance
- **Analytics & Reporting**: Comprehensive maintenance insights

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Modern, professional interface
- **Real-time Notifications**: Instant updates via Socket.IO
- **Offline Support**: Graceful degradation when server unavailable

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - Component library
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication
- **Brevo** - Email service integration

## Project Structure

```
GearGuard/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & validation
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper functions
│   ├── seeds/                 # Database seeders
│   └── package.json
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── user/          # User dashboard pages
│   │   │   ├── technician/    # Technician dashboard pages
│   │   │   └── auth/          # Authentication pages
│   │   ├── store/             # Zustand stores
│   │   ├── services/          # API services
│   │   └── utils/             # Helper functions
│   └── package.json
├── deployment/                 # Docker & deployment configs
├── docs/                      # Documentation
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/gearguard.git
   cd gearguard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and other configs
   
   # Seed the database
   node create-admin.js
   node seed-equipment.js
   node seed-maintenance.js
   
   # Start the server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Default Credentials
- **Admin**: admin@gearguard.com / Creatus17

## Usage

### For Administrators
1. Login with admin credentials
2. Manage users, teams, and equipment
3. View system-wide analytics and reports
4. Configure maintenance workflows

### For Users
1. Sign up or login to your account
2. Submit maintenance requests
3. Track request status and history
4. View equipment information

### For Technicians
1. Access the technician dashboard
2. View assigned maintenance tasks in Kanban board
3. Accept and update task status
4. Use calendar view for scheduled maintenance

### For Managers
1. Oversee team maintenance activities
2. Assign technicians to requests
3. Monitor team performance
4. Generate team reports

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Maintenance Requests
- `GET /api/maintenance` - Get all requests
- `POST /api/maintenance` - Create new request
- `PATCH /api/maintenance/:id/status` - Update request status
- `GET /api/maintenance/my` - Get user's requests

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/teams` - Get all teams
- `GET /api/admin/equipment` - Get all equipment
- `GET /api/admin/stats` - Get system statistics

## Key Features Showcase

### Technician Dashboard
- **Kanban Board**: Visual task management with drag-and-drop
- **Status Columns**: New, In Progress, Repaired, Scrap
- **Quick Actions**: Accept requests, update status, mark complete
- **Team Filtering**: See only relevant team assignments

### Calendar Integration
- **Preventive Maintenance**: Schedule and track routine maintenance
- **Visual Planning**: Monthly calendar view with task indicators
- **Date Selection**: Click dates to view scheduled tasks

### Real-time Updates
- **Live Status Changes**: Instant updates across all dashboards
- **Notifications**: Toast notifications for important events
- **Collaborative**: Multiple users can work simultaneously

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Different permissions for each user type
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Full-featured desktop experience
- **Touch-Friendly**: Large buttons and touch targets

## Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Configure environment variables
3. Deploy backend to your server
4. Serve frontend static files
5. Configure reverse proxy (nginx recommended)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies
- Inspired by industry-standard maintenance management systems
- Thanks to the open-source community for the amazing tools and libraries

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`
