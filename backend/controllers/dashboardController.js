const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Get employee dashboard data
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
exports.getEmployeeDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Recent expenses (last 30 days)
        const recentExpenses = await Expense.find({
            userId,
            submissionDate: { $gte: thirtyDaysAgo }
        })
        .sort({ submissionDate: -1 })
        .limit(5)
        .select('expenseId category amount status submissionDate');

        // Expense statistics
        const expenseStats = await Expense.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    pendingCount: {
                        $sum: { $cond: [{ $in: ['$status', ['submitted', 'under_review']] }, 1, 0] }
                    },
                    pendingAmount: {
                        $sum: { $cond: [{ $in: ['$status', ['submitted', 'under_review']] }, '$amount', 0] }
                    },
                    approvedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    approvedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] }
                    },
                    reimbursedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'reimbursed'] }, 1, 0] }
                    },
                    reimbursedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'reimbursed'] }, '$amount', 0] }
                    }
                }
            }
        ]);

        // Monthly spending (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySpending = await Expense.aggregate([
            {
                $match: {
                    userId: userId,
                    expenseDate: { $gte: sixMonthsAgo }
                }
            },
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
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);

        // Category breakdown
        const categoryBreakdown = await Expense.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Upcoming approvals (if any)
        const pendingApprovals = await Expense.find({
            userId: userId,
            status: { $in: ['submitted', 'under_review'] }
        })
        .populate('approverId', 'name email')
        .select('expenseId amount category description submissionDate')
        .sort({ submissionDate: -1 })
        .limit(3);

        res.status(200).json({
            success: true,
            data: {
                summary: expenseStats[0] || {
                    totalExpenses: 0,
                    totalAmount: 0,
                    pendingCount: 0,
                    pendingAmount: 0,
                    approvedCount: 0,
                    approvedAmount: 0,
                    reimbursedCount: 0,
                    reimbursedAmount: 0
                },
                recentExpenses,
                monthlySpending: monthlySpending.map(item => ({
                    month: `${item._id.month}/${item._id.year}`,
                    amount: item.totalAmount,
                    count: item.count
                })),
                categoryBreakdown,
                pendingApprovals,
                quickStats: {
                    totalExpenses: expenseStats[0]?.totalExpenses || 0,
                    totalAmount: expenseStats[0]?.totalAmount || 0,
                    pendingClaims: expenseStats[0]?.pendingCount || 0,
                    avgClaimAmount: expenseStats[0]?.totalExpenses > 0 
                        ? (expenseStats[0]?.totalAmount / expenseStats[0]?.totalExpenses).toFixed(2)
                        : 0
                }
            }
        });
    } catch (error) {
        console.error('Get employee dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get manager dashboard data
// @route   GET /api/dashboard/manager
// @access  Private (Manager/Admin/Finance)
exports.getManagerDashboard = async (req, res) => {
    try {
        let teamFilter = {};
        
        // For managers, only show their team
        if (req.user.role === 'manager') {
            const teamMembers = await User.find({ managerId: req.user._id }).select('_id');
            const teamMemberIds = teamMembers.map(member => member._id);
            teamFilter = { userId: { $in: teamMemberIds } };
        }
        // For admin/finance, show all
        else if (['admin', 'finance'].includes(req.user.role)) {
            // No filter needed
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Pending approvals
        const pendingApprovals = await Expense.find({
            ...teamFilter,
            status: 'under_review'
        })
        .populate('userId', 'name email department')
        .select('expenseId amount category description submissionDate')
        .sort({ submissionDate: -1 })
        .limit(10);

        // Recent team expenses
        const recentTeamExpenses = await Expense.find({
            ...teamFilter,
            submissionDate: { $gte: thirtyDaysAgo }
        })
        .populate('userId', 'name email')
        .select('expenseId userId category amount status submissionDate')
        .sort({ submissionDate: -1 })
        .limit(10);

        // Team statistics
        const teamStats = await Expense.aggregate([
            { $match: teamFilter },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    pendingCount: {
                        $sum: { $cond: [{ $in: ['$status', ['submitted', 'under_review']] }, 1, 0] }
                    },
                    pendingAmount: {
                        $sum: { $cond: [{ $in: ['$status', ['submitted', 'under_review']] }, '$amount', 0] }
                    },
                    approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    approvedAmount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] } }
                }
            }
        ]);

        // Monthly team spending
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTeamSpending = await Expense.aggregate([
            {
                $match: {
                    ...teamFilter,
                    expenseDate: { $gte: sixMonthsAgo }
                }
            },
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
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ]);

        // Team member spending breakdown
        const teamMemberSpending = await Expense.aggregate([
            { $match: teamFilter },
            {
                $group: {
                    _id: '$userId',
                    totalAmount: { $sum: '$amount' },
                    expenseCount: { $sum: 1 },
                    pendingCount: {
                        $sum: { $cond: [{ $in: ['$status', ['submitted', 'under_review']] }, 1, 0] }
                    }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 10 }
        ]);

        // Populate user details for team member spending
        const teamMemberDetails = await Promise.all(
            teamMemberSpending.map(async (member) => {
                const user = await User.findById(member._id).select('name email department');
                return {
                    user,
                    totalAmount: member.totalAmount,
                    expenseCount: member.expenseCount,
                    pendingCount: member.pendingCount
                };
            })
        );

        // Category distribution
        const categoryDistribution = await Expense.aggregate([
            { $match: teamFilter },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Approval rate
        const approvalStats = await Expense.aggregate([
            { $match: teamFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalProcessed = approvalStats.reduce((sum, stat) => {
            if (['approved', 'rejected', 'reimbursed'].includes(stat._id)) {
                return sum + stat.count;
            }
            return sum;
        }, 0);

        const approvedCount = approvalStats.find(stat => stat._id === 'approved')?.count || 0;
        const approvalRate = totalProcessed > 0 ? (approvedCount / totalProcessed) * 100 : 0;

        res.status(200).json({
            success: true,
            data: {
                pendingApprovals: {
                    count: pendingApprovals.length,
                    expenses: pendingApprovals
                },
                recentTeamExpenses,
                teamStats: teamStats[0] || {
                    totalExpenses: 0,
                    totalAmount: 0,
                    pendingCount: 0,
                    pendingAmount: 0,
                    approvedCount: 0,
                    approvedAmount: 0
                },
                monthlyTeamSpending: monthlyTeamSpending.map(item => ({
                    month: `${item._id.month}/${item._id.year}`,
                    amount: item.totalAmount,
                    count: item.count
                })),
                teamMemberSpending: teamMemberDetails,
                categoryDistribution,
                metrics: {
                    approvalRate: approvalRate.toFixed(2),
                    avgProcessingTime: '2.5', // This would require additional tracking
                    topSpender: teamMemberDetails[0]?.user?.name || 'N/A',
                    highestCategory: categoryDistribution[0]?._id || 'N/A'
                }
            }
        });
    } catch (error) {
        console.error('Get manager dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get finance dashboard data
// @route   GET /api/dashboard/finance
// @access  Private (Finance/Admin)
exports.getFinanceDashboard = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Financial summaries
        const financialSummary = await Expense.aggregate([
            {
                $match: {
                    submissionDate: { $gte: ninetyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalExpenses: { $sum: 1 },
                    approvedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] }
                    },
                    approvedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    reimbursedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'reimbursed'] }, '$amount', 0] }
                    },
                    reimbursedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'reimbursed'] }, 1, 0] }
                    },
                    pendingReimbursementAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] }
                    },
                    pendingReimbursementCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Department-wise spending
        const departmentSpending = await Expense.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $group: {
                    _id: '$user.department',
                    totalAmount: { $sum: '$amount' },
                    expenseCount: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Monthly financial trends
        const monthlyTrends = await Expense.aggregate([
            {
                $match: {
                    submissionDate: { $gte: ninetyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$submissionDate' },
                        month: { $month: '$submissionDate' }
                    },
                    totalAmount: { $sum: '$amount' },
                    expenseCount: { $sum: 1 },
                    approvedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] }
                    },
                    reimbursedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'reimbursed'] }, '$amount', 0] }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Top expenses pending reimbursement
        const pendingReimbursement = await Expense.find({
            status: 'approved',
            submissionDate: { $gte: thirtyDaysAgo }
        })
        .populate('userId', 'name email department')
        .select('expenseId amount category description submissionDate')
        .sort({ amount: -1 })
        .limit(10);

        // Recent reimbursements
        const recentReimbursements = await Expense.find({
            status: 'reimbursed',
            reimbursementDate: { $gte: thirtyDaysAgo }
        })
        .populate('userId', 'name email department')
        .populate('financeApproverId', 'name email')
        .select('expenseId amount category reimbursementDate reimbursementMode')
        .sort({ reimbursementDate: -1 })
        .limit(10);

        // Category-wise spending
        const categorySpending = await Expense.aggregate([
            {
                $match: {
                    submissionDate: { $gte: ninetyDaysAgo }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    expenseCount: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 }
        ]);

        // Budget vs Actual (simplified - would need budget data)
        const currentMonth = new Date();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

        const currentMonthSpending = await Expense.aggregate([
            {
                $match: {
                    submissionDate: { $gte: firstDayOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    expenseCount: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                financialSummary: financialSummary[0] || {
                    totalAmount: 0,
                    totalExpenses: 0,
                    approvedAmount: 0,
                    approvedCount: 0,
                    reimbursedAmount: 0,
                    reimbursedCount: 0,
                    pendingReimbursementAmount: 0,
                    pendingReimbursementCount: 0
                },
                departmentSpending,
                monthlyTrends: monthlyTrends.map(item => ({
                    period: `${item._id.month}/${item._id.year}`,
                    totalAmount: item.totalAmount,
                    expenseCount: item.expenseCount,
                    approvedAmount: item.approvedAmount,
                    reimbursedAmount: item.reimbursedAmount
                })),
                pendingReimbursement: {
                    count: pendingReimbursement.length,
                    totalAmount: pendingReimbursement.reduce((sum, exp) => sum + exp.amount, 0),
                    expenses: pendingReimbursement
                },
                recentReimbursements,
                categorySpending,
                currentMonth: {
                    spending: currentMonthSpending[0]?.totalAmount || 0,
                    expenses: currentMonthSpending[0]?.expenseCount || 0,
                    // Assuming a monthly budget of $50,000 for demo
                    budget: 50000,
                    utilization: currentMonthSpending[0]?.totalAmount 
                        ? ((currentMonthSpending[0].totalAmount / 50000) * 100).toFixed(2)
                        : 0
                },
                keyMetrics: {
                    avgReimbursementTime: '3.2', // Would need tracking
                    topDepartment: departmentSpending[0]?._id || 'N/A',
                    mostCommonCategory: categorySpending[0]?._id || 'N/A',
                    approvalToReimbursementRatio: financialSummary[0]?.approvedCount > 0
                        ? ((financialSummary[0]?.reimbursedCount / financialSummary[0]?.approvedCount) * 100).toFixed(2)
                        : 0
                }
            }
        });
    } catch (error) {
        console.error('Get finance dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};