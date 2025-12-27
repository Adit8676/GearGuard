# GearGuard MERN Stack - Complete Setup Guide

## Project Structure Created

```
gearguard-mern/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── categoryController.js
│   │   ├── equipmentController.js
│   │   ├── requestController.js
│   │   ├── teamController.js
│   │   └── userController.js
│   ├── models/               # MongoDB schemas
│   │   ├── Equipment.js
│   │   ├── EquipmentCategory.js
│   │   ├── MaintenanceRequest.js
│   │   ├── MaintenanceTeam.js
│   │   └── User.js
│   ├── routes/               # API endpoints
│   │   ├── category.js
│   │   ├── equipment.js
│   │   ├── request.js
│   │   ├── team.js
│   │   └── user.js
│   ├── seedDatabase.js       # Sample data seeder
│   └── server.js             # Express server
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── Navbar.js
│   │   ├── context/          # React Context
│   │   │   └── AppContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── CalendarView.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Equipment.js
│   │   │   ├── KanbanBoard.js
│   │   │   ├── Login.js
│   │   │   ├── Requests.js
│   │   │   └── Teams.js
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment

```bash
# Create .env file from example
cp .env.example .env

# Edit .env and update:
# - MONGODB_URI (default: mongodb://localhost:27017/gearguard)
# - JWT_SECRET (change to a secure random string)
```

### Step 3: Start MongoDB

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data
```

### Step 4: Seed Sample Data

```bash
node backend/seedDatabase.js
```

This creates:
- 5 users (admin, manager, 2 technicians, IT support)
- 5 equipment categories
- 3 maintenance teams
- 5 equipment items
- 5 maintenance requests

### Step 5: Run the Application

```bash
# Option 1: Run both frontend and backend concurrently
npm run dev

# Option 2: Run separately in different terminals
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Sample Login Credentials

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gearguard.com | admin123 |
| Manager | manager@gearguard.com | manager123 |
| Technician | tech1@gearguard.com | tech123 |
| Technician | tech2@gearguard.com | tech123 |
| IT Support | it@gearguard.com | it123 |

## Features Implemented

### ✅ Equipment Management
- CRUD operations for equipment
- Track by department and employee
- Assign maintenance teams and technicians
- Serial number tracking
- Warranty information
- Physical location tracking

### ✅ Maintenance Teams
- Create specialized teams (Mechanics, IT, HVAC, etc.)
- Assign team members
- Color coding for visual identification

### ✅ Maintenance Requests
- **Corrective** (Breakdown) requests
- **Preventive** (Routine) maintenance requests
- Auto-fill team and category from equipment
- Stage workflow: New → In Progress → Repaired → Scrap
- Priority levels
- Duration tracking

### ✅ Kanban Board
- Visual workflow management
- Drag cards between stages (using arrow buttons)
- Overdue request indicators
- Filter by equipment, team, type
- Quick stage updates

### ✅ Calendar View
- Displays preventive maintenance schedule
- Click dates to view scheduled tasks
- Visual event indicators
- Upcoming maintenance list

### ✅ Dashboard
- Statistics overview
- Recent requests table
- Equipment count
- Request counts by stage

### ✅ Smart Features
- **Auto-fill**: When selecting equipment, team and category auto-populate
- **Smart Buttons**: Equipment cards show maintenance request count
- **Scrap Logic**: Moving to scrap stage updates equipment status
- **Overdue Detection**: Automatically highlights overdue requests

## API Endpoints

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/:id` - Get single equipment with maintenance requests
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Maintenance Requests
- `GET /api/requests` - Get all requests (supports filters)
- `POST /api/requests` - Create request (auto-fills team/category)
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `GET /api/requests/stats` - Get statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/technicians` - Get technicians only

## Database Schema

### User
- name, email, password (hashed)
- role: admin | manager | technician | user
- department, phone

### Equipment
- name, serialNumber, category
- department, assignedEmployee
- team, defaultTechnician
- purchaseDate, warranty info
- location, notes
- status: operational | under_maintenance | scrapped

### MaintenanceTeam
- name, members (array of users)
- color, active status

### MaintenanceRequest
- subject, equipment, category
- requestType: corrective | preventive
- team, assignedTechnician
- scheduledDate, duration
- stage: new | in_progress | repaired | scrap
- priority: low | normal | high | very_high
- description

## Technologies Used

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 with Hooks
- React Router for navigation
- Axios for API calls
- React Calendar for calendar view
- React Toastify for notifications

## Development Tips

1. **Adding New Equipment Categories:**
   - Use the API or MongoDB directly
   - Categories are required when creating equipment

2. **Creating Maintenance Requests:**
   - Equipment selection auto-fills team and category
   - Default technician is auto-assigned if available

3. **Workflow:**
   - New requests start in "New" stage
   - Technicians move to "In Progress" when working
   - Mark "Repaired" when complete
   - Use "Scrap" for equipment that cannot be repaired

4. **Calendar:**
   - Only shows preventive maintenance
   - Use for planning routine checkups

## Troubleshooting

**MongoDB Connection Error:**
```bash
# Ensure MongoDB is running
mongod --version
# Check connection string in .env
```

**Port Already in Use:**
```bash
# Change PORT in .env file
# Frontend port can be changed in package.json proxy
```

**Dependencies Issues:**
```bash
# Clear and reinstall
rm -rf node_modules frontend/node_modules
npm run install-all
```

## Future Enhancements

- File attachments for requests
- Email notifications
- Mobile app
- Advanced reporting and analytics
- Barcode/QR code scanning
- Parts inventory management
- Work order templates

## License
MIT

## Support
For issues or questions, create an issue in the repository.
