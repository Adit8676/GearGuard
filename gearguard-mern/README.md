# GearGuard - The Ultimate Maintenance Tracker

A comprehensive maintenance management system built with MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Equipment Management**: Track all company assets (machines, vehicles, computers)
- **Maintenance Teams**: Organize technicians into specialized teams
- **Maintenance Requests**: Handle corrective and preventive maintenance
- **Kanban Board**: Visual workflow management with drag & drop
- **Calendar View**: Schedule and track maintenance tasks
- **Smart Automation**: Auto-fill fields and intelligent workflows

## Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm run install-all
```

3. Create `.env` file in root directory:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret

5. Start MongoDB service

6. Run the application:
```bash
# Development mode (both frontend and backend)
npm run dev

# Backend only
npm run server

# Frontend only
npm run client
```

## API Endpoints

### Equipment
- GET /api/equipment - Get all equipment
- POST /api/equipment - Create new equipment
- GET /api/equipment/:id - Get single equipment
- PUT /api/equipment/:id - Update equipment
- DELETE /api/equipment/:id - Delete equipment

### Maintenance Teams
- GET /api/teams - Get all teams
- POST /api/teams - Create new team
- GET /api/teams/:id - Get single team
- PUT /api/teams/:id - Update team
- DELETE /api/teams/:id - Delete team

### Maintenance Requests
- GET /api/requests - Get all requests
- POST /api/requests - Create new request
- GET /api/requests/:id - Get single request
- PUT /api/requests/:id - Update request
- DELETE /api/requests/:id - Delete request

## Project Structure

```
gearguard-mern/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       └── App.js
└── package.json
```

## License

MIT
