const User = require('../models/user.model');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json({ ok: true, users });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async upgradeUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validate role
      const validRoles = ['user', 'technician', 'manager'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ ok: false, message: 'Invalid role' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      // Prevent downgrading admin
      if (user.role === 'admin') {
        return res.status(403).json({ ok: false, message: 'Cannot modify admin role' });
      }

      // Update user role
      user.role = role;
      await user.save();

      const updatedUser = await User.findById(userId).select('-password');
      res.json({ ok: true, user: updatedUser, message: `User role upgraded to ${role}` });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
  async disableUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      // Prevent disabling admin
      if (user.role === 'admin') {
        return res.status(403).json({ ok: false, message: 'Cannot disable admin user' });
      }

      // Update user status
      user.status = 'disabled';
      await user.save();

      const updatedUser = await User.findById(userId).select('-password');
      res.json({ ok: true, user: updatedUser, message: 'User disabled successfully' });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async enableUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      // Update user status
      user.status = 'active';
      await user.save();

      const updatedUser = await User.findById(userId).select('-password');
      res.json({ ok: true, user: updatedUser, message: 'User enabled successfully' });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
}

module.exports = new UserController();