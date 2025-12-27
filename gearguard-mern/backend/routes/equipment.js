const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentByDepartment
} = require('../controllers/equipmentController');

router.route('/')
  .get(getAllEquipment)
  .post(createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(updateEquipment)
  .delete(deleteEquipment);

router.get('/department/:department', getEquipmentByDepartment);

module.exports = router;
