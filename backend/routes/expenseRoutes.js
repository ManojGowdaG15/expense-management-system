const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { auth, authorize, canApproveExpenses } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { expenseValidationRules, paginationValidationRules, validate } = require('../middleware/validation');

// All routes are protected
router.use(auth);

// Employee routes
router.post('/', 
    uploadSingle('receipt'), 
    expenseValidationRules(), 
    validate, 
    expenseController.createExpense
);

router.get('/', 
    paginationValidationRules(), 
    validate, 
    expenseController.getUserExpenses
);

// IMPORTANT: PUT THIS BEFORE THE '/:id' ROUTE
router.get('/pending', 
    authorize('manager', 'finance', 'admin'), 
    paginationValidationRules(), 
    validate, 
    expenseController.getPendingExpenses
);

// Now the '/:id' route won't catch '/pending'
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', uploadSingle('receipt'), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.post('/:id/submit', expenseController.submitExpense);
router.get('/:id/receipt', expenseController.downloadReceipt);

// Manager/Finance/Admin approval routes
router.put('/:id/approve', 
    authorize('manager', 'finance', 'admin'), 
    expenseController.approveExpense
);

router.put('/:id/reject', 
    authorize('manager', 'finance', 'admin'), 
    expenseController.rejectExpense
);

module.exports = router;