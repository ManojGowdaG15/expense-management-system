const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth, authorize } = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Role-based dashboard routes
router.get('/employee', 
    authorize('employee'), 
    dashboardController.getEmployeeDashboard
);

router.get('/manager', 
    authorize('manager', 'admin'), 
    dashboardController.getManagerDashboard
);

router.get('/finance', 
    authorize('finance', 'admin'), 
    dashboardController.getFinanceDashboard
);

module.exports = router;