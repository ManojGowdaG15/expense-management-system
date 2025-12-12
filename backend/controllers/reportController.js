const Expense = require('../models/Expense');
const User = require('../models/User');
const ExpenseCategory = require('../models/ExpenseCategory');
const ExcelJS = require('exceljs');

// @desc    Generate expense reports
// @route   GET /api/reports/expenses
// @access  Private (Manager/Finance/Admin)
exports.generateExpenseReport = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            department,
            category,
            status,
            userId,
            format = 'json'
        } = req.query;

        // Build filter
        const filter = {};

        if (startDate || endDate) {
            filter.expenseDate = {};
            if (startDate) filter.expenseDate.$gte = new Date(startDate);
            if (endDate) filter.expenseDate.$lte = new Date(endDate);
        }

        if (category) {
            filter.category = { $in: category.split(',') };
        }

        if (status) {
            filter.status = { $in: status.split(',') };
        }

        if (userId) {
            filter.userId = { $in: userId.split(',') };
        }

        // Apply role-based filters
        if (req.user.role === 'manager') {
            const teamMembers = await User.find({ managerId: req.user._id }).select('_id');
            const teamMemberIds = teamMembers.map(member => member._id);
            
            if (filter.userId) {
                // Intersect with team members
                const requestedIds = userId.split(',');
                const authorizedIds = requestedIds.filter(id => 
                    teamMemberIds.some(teamId => teamId.toString() === id)
                );
                filter.userId = { $in: authorizedIds };
            } else {
                filter.userId = { $in: teamMemberIds };
            }
        }

        // Apply department filter
        if (department && req.user.role !== 'manager') {
            const deptUsers = await User.find({ department }).select('_id');
            const deptUserIds = deptUsers.map(user => user._id);
            
            if (filter.userId) {
                const currentIds = Array.isArray(filter.userId.$in) 
                    ? filter.userId.$in 
                    : [filter.userId.$in];
                const combinedIds = [...new Set([...currentIds, ...deptUserIds])];
                filter.userId = { $in: combinedIds };
            } else {
                filter.userId = { $in: deptUserIds };
            }
        }

        // Get expenses with user details
        const expenses = await Expense.find(filter)
            .populate('userId', 'name email employeeId department')
            .populate('approverId', 'name email')
            .populate('financeApproverId', 'name email')
            .sort({ expenseDate: -1 });

        // Generate summary statistics
        const summary = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalExpenses: { $sum: 1 },
                    avgAmount: { $avg: '$amount' },
                    minAmount: { $min: '$amount' },
                    maxAmount: { $max: '$amount' }
                }
            }
        ]);

        // Category breakdown
        const categoryBreakdown = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Status breakdown
        const statusBreakdown = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Monthly trend
        const monthlyTrend = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        year: { $year: '$expenseDate' },
                        month: { $month: '$expenseDate' }
                    },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // User-wise spending
        const userSpending = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$userId',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 10 }
        ]);

        // Get user details for user spending
        const userSpendingWithDetails = await Promise.all(
            userSpending.map(async (item) => {
                const user = await User.findById(item._id).select('name email department');
                return {
                    user,
                    totalAmount: item.totalAmount,
                    count: item.count,
                    avgAmount: item.avgAmount
                };
            })
        );

        // Prepare report data
        const reportData = {
            metadata: {
                generatedAt: new Date(),
                generatedBy: req.user.email,
                filters: {
                    startDate,
                    endDate,
                    department,
                    category,
                    status,
                    userId
                },
                recordCount: expenses.length
            },
            summary: summary[0] || {
                totalAmount: 0,
                totalExpenses: 0,
                avgAmount: 0,
                minAmount: 0,
                maxAmount: 0
            },
            breakdowns: {
                category: categoryBreakdown,
                status: statusBreakdown,
                monthly: monthlyTrend.map(item => ({
                    period: `${item._id.month}/${item._id.year}`,
                    totalAmount: item.totalAmount,
                    count: item.count
                })),
                users: userSpendingWithDetails
            },
            expenses: expenses.map(expense => ({
                expenseId: expense.expenseId,
                employee: expense.userId?.name,
                department: expense.userId?.department,
                expenseDate: expense.expenseDate,
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                currency: expense.currency,
                status: expense.status,
                approver: expense.approverId?.name,
                approvalDate: expense.approvalDate,
                reimbursementDate: expense.reimbursementDate
            }))
        };

        // Return in requested format
        if (format === 'excel') {
            // Generate Excel report
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Expense Report');

            // Add headers
            worksheet.columns = [
                { header: 'Expense ID', key: 'expenseId', width: 15 },
                { header: 'Employee', key: 'employee', width: 20 },
                { header: 'Department', key: 'department', width: 15 },
                { header: 'Date', key: 'expenseDate', width: 12 },
                { header: 'Category', key: 'category', width: 15 },
                { header: 'Description', key: 'description', width: 30 },
                { header: 'Amount', key: 'amount', width: 12 },
                { header: 'Status', key: 'status', width: 12 },
                { header: 'Approver', key: 'approver', width: 20 },
                { header: 'Approval Date', key: 'approvalDate', width: 15 }
            ];

            // Add data rows
            reportData.expenses.forEach(expense => {
                worksheet.addRow(expense);
            });

            // Add summary sheet
            const summarySheet = workbook.addWorksheet('Summary');
            summarySheet.columns = [
                { header: 'Metric', key: 'metric', width: 25 },
                { header: 'Value', key: 'value', width: 20 }
            ];

            summarySheet.addRow({ metric: 'Total Expenses', value: reportData.summary.totalExpenses });
            summarySheet.addRow({ metric: 'Total Amount', value: reportData.summary.totalAmount });
            summarySheet.addRow({ metric: 'Average Amount', value: reportData.summary.avgAmount });
            summarySheet.addRow({ metric: 'Minimum Amount', value: reportData.summary.minAmount });
            summarySheet.addRow({ metric: 'Maximum Amount', value: reportData.summary.maxAmount });

            // Set response headers for Excel
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=expense-report-${Date.now()}.xlsx`);

            // Write to response
            await workbook.xlsx.write(res);
            res.end();
        } else {
            // Return JSON response
            res.status(200).json({
                success: true,
                data: reportData
            });
        }
    } catch (error) {
        console.error('Generate expense report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Generate reimbursement report
// @route   GET /api/reports/reimbursements
// @access  Private (Finance/Admin)
exports.generateReimbursementReport = async (req, res) => {
    try {
        const { startDate, endDate, department, reimbursementMode } = req.query;

        const filter = { status: 'reimbursed' };

        if (startDate || endDate) {
            filter.reimbursementDate = {};
            if (startDate) filter.reimbursementDate.$gte = new Date(startDate);
            if (endDate) filter.reimbursementDate.$lte = new Date(endDate);
        }

        if (reimbursementMode) {
            filter.reimbursementMode = reimbursementMode;
        }

        // Apply department filter
        if (department) {
            const deptUsers = await User.find({ department }).select('_id');
            const deptUserIds = deptUsers.map(user => user._id);
            filter.userId = { $in: deptUserIds };
        }

        const reimbursements = await Expense.find(filter)
            .populate('userId', 'name email department employeeId')
            .populate('financeApproverId', 'name email')
            .sort({ reimbursementDate: -1 });

        // Generate summary
        const summary = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalCount: { $sum: 1 },
                    byMode: {
                        $push: {
                            mode: '$reimbursementMode',
                            amount: '$amount'
                        }
                    },
                    byDepartment: {
                        $push: {
                            department: '$userId.department',
                            amount: '$amount'
                        }
                    }
                }
            }
        ]);

        // Process mode breakdown
        const modeBreakdown = {};
        if (summary[0]?.byMode) {
            summary[0].byMode.forEach(item => {
                if (!modeBreakdown[item.mode]) {
                    modeBreakdown[item.mode] = { amount: 0, count: 0 };
                }
                modeBreakdown[item.mode].amount += item.amount;
                modeBreakdown[item.mode].count += 1;
            });
        }

        // Process department breakdown
        const departmentBreakdown = {};
        if (summary[0]?.byDepartment) {
            summary[0].byDepartment.forEach(item => {
                if (item.department) {
                    if (!departmentBreakdown[item.department]) {
                        departmentBreakdown[item.department] = { amount: 0, count: 0 };
                    }
                    departmentBreakdown[item.department].amount += item.amount;
                    departmentBreakdown[item.department].count += 1;
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                reimbursements,
                summary: {
                    totalAmount: summary[0]?.totalAmount || 0,
                    totalCount: summary[0]?.totalCount || 0,
                    modeBreakdown,
                    departmentBreakdown
                },
                metrics: {
                    avgReimbursementAmount: summary[0]?.totalCount > 0 
                        ? (summary[0]?.totalAmount / summary[0]?.totalCount).toFixed(2)
                        : 0,
                    mostCommonMode: Object.keys(modeBreakdown).reduce((a, b) => 
                        modeBreakdown[a].count > modeBreakdown[b].count ? a : b, 'N/A'
                    ),
                    topDepartment: Object.keys(departmentBreakdown).reduce((a, b) => 
                        departmentBreakdown[a].amount > departmentBreakdown[b].amount ? a : b, 'N/A'
                    )
                }
            }
        });
    } catch (error) {
        console.error('Generate reimbursement report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Generate budget vs actual report
// @route   GET /api/reports/budget
// @access  Private (Finance/Admin)
exports.generateBudgetReport = async (req, res) => {
    try {
        const { year = new Date().getFullYear(), department } = req.query;

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const filter = {
            expenseDate: { $gte: startDate, $lte: endDate }
        };

        // Apply department filter
        if (department) {
            const deptUsers = await User.find({ department }).select('_id');
            const deptUserIds = deptUsers.map(user => user._id);
            filter.userId = { $in: deptUserIds };
        }

        // Monthly spending
        const monthlySpending = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { month: { $month: '$expenseDate' } },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    approvedAmount: {
                        $sum: { $cond: [{ $in: ['$status', ['approved', 'reimbursed']] }, '$amount', 0] }
                    },
                    pendingAmount: {
                        $sum: { $cond: [{ $in: ['$status', ['submitted', 'under_review']] }, '$amount', 0] }
                    }
                }
            },
            { $sort: { '_id.month': 1 } }
        ]);

        // Category-wise spending
        const categorySpending = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Department-wise spending (if no department filter)
        let departmentSpending = [];
        if (!department) {
            departmentSpending = await Expense.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                { $match: filter },
                {
                    $group: {
                        _id: '$user.department',
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { totalAmount: -1 } }
            ]);
        }

        // Budget data (static for demo - in real app, this would come from a budget model)
        const monthlyBudget = 50000; // $50,000 per month
        const annualBudget = monthlyBudget * 12;

        const totalSpending = monthlySpending.reduce((sum, month) => sum + month.totalAmount, 0);
        const budgetUtilization = (totalSpending / annualBudget) * 100;

        // Forecast (simple linear forecast)
        const currentMonth = new Date().getMonth() + 1;
        const monthsPassed = Math.min(currentMonth, 12);
        const avgMonthlySpending = totalSpending / monthsPassed;
        const forecastedAnnual = avgMonthlySpending * 12;

        res.status(200).json({
            success: true,
            data: {
                period: year,
                budget: {
                    monthly: monthlyBudget,
                    annual: annualBudget,
                    spent: totalSpending,
                    remaining: annualBudget - totalSpending,
                    utilization: budgetUtilization.toFixed(2)
                },
                monthlyBreakdown: Array.from({ length: 12 }, (_, i) => {
                    const monthData = monthlySpending.find(m => m._id.month === i + 1);
                    return {
                        month: i + 1,
                        budget: monthlyBudget,
                        spent: monthData?.totalAmount || 0,
                        approved: monthData?.approvedAmount || 0,
                        pending: monthData?.pendingAmount || 0,
                        variance: monthlyBudget - (monthData?.totalAmount || 0)
                    };
                }),
                categoryBreakdown: categorySpending,
                departmentBreakdown: departmentSpending,
                forecast: {
                    avgMonthlySpending: avgMonthlySpending.toFixed(2),
                    forecastedAnnual: forecastedAnnual.toFixed(2),
                    varianceFromBudget: ((forecastedAnnual - annualBudget) / annualBudget * 100).toFixed(2)
                },
                recommendations: budgetUtilization > 80 ? [
                    'Consider reviewing expense policies',
                    'Monitor high-spending categories',
                    'Plan for budget adjustment if needed'
                ] : [
                    'Budget utilization is within normal range',
                    'Continue current spending patterns'
                ]
            }
        });
    } catch (error) {
        console.error('Generate budget report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};