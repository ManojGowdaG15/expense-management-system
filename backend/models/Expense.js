// backend/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Travel', 'Food', 'Accommodation', 'Office Supplies', 'Others']
  },
  expenseDate: { type: Date, required: true },
  description: String,
  receiptDetails: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  managerComments: String,
  submittedDate: { type: Date, default: Date.now },
  approvedDate: Date
});

module.exports = mongoose.model('Expense', expenseSchema);