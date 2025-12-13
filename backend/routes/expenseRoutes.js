// backend/routes/expenseRoutes.js
const express = require('express');
const {
  submitExpense,
  getMyExpenses,
  getAllExpenses,
  updateStatus,
  getDashboardSummary
} = require('../controllers/expenseController');
const { protect, managerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/submit', submitExpense);
router.get('/my', getMyExpenses);
router.get('/all', managerOnly, getAllExpenses);
router.patch('/:id/status', managerOnly, updateStatus);
router.get('/dashboard', getDashboardSummary);

module.exports = router;