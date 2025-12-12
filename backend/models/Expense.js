// backend/models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Travel", "Food", "Accommodation", "Office Supplies", "Others"],
    required: true,
  },
  expenseDate: { type: Date, required: true },
  description: String,
  receipt: String,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  managerComment: String,
  submittedAt: { type: Date, default: Date.now },   // ← THIS IS CORRECT
});

export default mongoose.model("Expense", expenseSchema);