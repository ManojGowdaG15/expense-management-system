const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const User = require('../models/User');
const { protect, managerOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Not authorized
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const user = req.user;
    
    let matchQuery = {};
    let teamStats = null;
    
    if (user.role === 'employee') {
      matchQuery = { user: user._id };
    } else if (user.role === 'manager') {
      // Get manager's team members
      const teamMembers = await User.find({ managerId: user._id });
      const teamMemberIds = teamMembers.map(member => member._id);
      
      matchQuery = { user: { $in: teamMemberIds } };
      
      // Team statistics
      teamStats = {
        totalTeamMembers: teamMembers.length,
        pendingRequests: await Expense.countDocuments({ 
          user: { $in: teamMemberIds },
          status: 'Pending'
        })
      };
    }

    // Total statistics
    const totalExpenses = await Expense.countDocuments(matchQuery);
    const totalAmount = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Status-wise statistics
    const statusStats = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { 
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }},
      { $sort: { count: -1 } }
    ]);

    // Category-wise statistics
    const categoryStats = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { 
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }},
      { $sort: { totalAmount: -1 } }
    ]);

    // Recent expenses
    const recentExpenses = await Expense.find(matchQuery)
      .populate('user', 'name email department')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Expense.aggregate([
      { 
        $match: { 
          ...matchQuery,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      success: true,
      data: {
        totalExpenses,
        totalAmount: totalAmount[0]?.total || 0,
        statusStats,
        categoryStats,
        recentExpenses,
        monthlyTrend,
        teamStats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard statistics' 
    });
  }
});

/**
 * @swagger
 * /api/dashboard/manager-summary:
 *   get:
 *     summary: Get manager dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manager dashboard summary
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Manager access required
 */
router.get('/manager-summary', protect, managerOnly, async (req, res) => {
  try {
    const user = req.user;
    
    // Get team members
    const teamMembers = await User.find({ managerId: user._id });
    const teamMemberIds = teamMembers.map(member => member._id);
    
    // Pending expenses by team
    const pendingExpenses = await Expense.find({
      user: { $in: teamMemberIds },
      status: 'Pending'
    })
    .populate('user', 'name department')
    .sort({ createdAt: -1 })
    .limit(10);

    // Department-wise spending
    const departmentStats = await Expense.aggregate([
      { $match: { user: { $in: teamMemberIds } } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.department',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Approval rate
    const approvalStats = await Expense.aggregate([
      { $match: { user: { $in: teamMemberIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProcessed = approvalStats.reduce((sum, stat) => {
      if (stat._id !== 'Pending') sum += stat.count;
      return sum;
    }, 0);
    
    const approvedCount = approvalStats.find(stat => stat._id === 'Approved')?.count || 0;
    const approvalRate = totalProcessed > 0 ? (approvedCount / totalProcessed) * 100 : 0;

    res.json({
      success: true,
      data: {
        teamSize: teamMembers.length,
        pendingExpensesCount: pendingExpenses.length,
        pendingExpenses,
        departmentStats,
        approvalRate: Math.round(approvalRate),
        approvalStats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching manager summary' 
    });
  }
});

module.exports = router;