const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Expense reports
router.get('/expenses', 
    authorize('manager', 'finance', 'admin'), 
    reportController.generateExpenseReport
);

// Reimbursement reports (finance only)
router.get('/reimbursements', 
    authorize('finance', 'admin'), 
    reportController.generateReimbursementReport
);

// Budget reports (finance/admin only)
router.get('/budget', 
    authorize('finance', 'admin'), 
    reportController.generateBudgetReport
);

module.exports = router;