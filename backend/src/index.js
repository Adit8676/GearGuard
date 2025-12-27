require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./lib/db');
const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const userRoutes = require('./routes/user.route');
const maintenanceRoutes = require('./routes/maintenance.route');
const reportsRoutes = require('./routes/reports.route');
const teamRoutes = require('./routes/team.route');

const app = express();
const PORT = process.env.PORT || 5001;

// Debug environment variables
console.log('Environment check:');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Present' : 'Missing');
console.log('BREVO_SENDER:', process.env.BREVO_SENDER || 'Missing');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/teams', teamRoutes);

// User maintenance request route (temporary fix)
app.post('/api/requests', async (req, res) => {
  try {
    const MaintenanceRequest = require('./models/maintenanceRequest.model');
    const mongoose = require('mongoose');
    
    const { subject, description, type, priority, equipmentId, equipmentName, teamId, teamName } = req.body;
    
    const maintenanceRequest = await MaintenanceRequest.create({
      subject,
      description,
      type,
      priority: priority || 'medium',
      equipmentId,
      equipmentName,
      teamId,
      teamName,
      createdBy: req.user?._id || new mongoose.Types.ObjectId()
    });
    
    res.status(201).json({ ok: true, request: maintenanceRequest });
  } catch (error) {
    console.error('Request creation error:', error);
    res.status(500).json({ ok: false, message: 'Failed to create request' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'GearGuard API is running' });
});

// Test maintenance route
app.get('/api/maintenance/test', (req, res) => {
  res.json({ ok: true, message: 'Maintenance routes are working' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
    server.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});