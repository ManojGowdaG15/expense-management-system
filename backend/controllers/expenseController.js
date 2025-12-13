// backend/controllers/expenseController.js
const Expense = require('../models/Expense');

// Submit new expense (Employee)
const submitExpense = async (req, res) => {
  try {
    const { amount, category, expenseDate, description, receiptDetails } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      userName: req.user.name,
      amount,
      category,
      expenseDate,
      description,
      receiptDetails
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee's expenses
const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ submittedDate: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all expenses (Manager)
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({})
      .sort({ submittedDate: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve/Reject (Manager)
const updateStatus = async (req, res) => {
  try {
    const { status, managerComments } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status, managerComments, approvedDate: new Date() },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    if (req.user.role === 'employee') {
      const expenses = await Expense.find({ userId: req.user.id });
      const totalSubmitted = expenses.reduce((sum, e) => sum + e.amount, 0);
      const approvedAmount = expenses
        .filter(e => e.status === 'Approved')
        .reduce((sum, e) => sum + e.amount, 0);
      const pendingCount = expenses.filter(e => e.status === 'Pending').length;

      res.json({ totalSubmitted, approvedAmount, pendingCount, recentExpenses: expenses.slice(0, 5) });
    } else {
      const allExpenses = await Expense.find({});
      const pending = allExpenses.filter(e => e.status === 'Pending');
      const totalPendingAmount = pending.reduce((sum, e) => sum + e.amount, 0);

      res.json({
        pendingCount: pending.length,
        totalPendingAmount,
        recentPending: pending.slice(0, 10)
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitExpense,
  getMyExpenses,
  getAllExpenses,
  updateStatus,
  getDashboardSummary
};