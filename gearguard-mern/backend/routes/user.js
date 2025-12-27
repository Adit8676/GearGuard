const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  getUserById,
  getTechnicians
} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);
router.get('/technicians', getTechnicians);
router.get('/:id', getUserById);

module.exports = router;
