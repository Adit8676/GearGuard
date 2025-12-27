const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  getRequestsByStage,
  getRequestStats
} = require('../controllers/requestController');

router.route('/')
  .get(getAllRequests)
  .post(createRequest);

router.get('/stats', getRequestStats);

router.route('/:id')
  .get(getRequestById)
  .put(updateRequest)
  .delete(deleteRequest);

router.get('/stage/:stage', getRequestsByStage);

module.exports = router;
