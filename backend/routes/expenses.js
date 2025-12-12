import express from "express";
import Expense from "../models/Expense.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token & attach user
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Submit expense (Employee only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "employee") return res.status(403).json({ msg: "Access denied" });

  try {
    const expense = new Expense({
      ...req.body,
      user: req.user.id,
      submittedAt: new Date()
    });
    await expense.save();
    await expense.populate("user", "name email");
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get my expenses
router.get("/my", auth, async (req, res) => {
  if (req.user.role !== "employee") return res.status(403).json({ msg: "Access denied" });

  const expenses = await Expense.find({ user: req.user.id })
    .populate("user", "name")
    .sort({ submittedAt: -1 });
  res.json(expenses);
});

// Get all pending (Manager only)
router.get("/pending", auth, async (req, res) => {
  if (req.user.role !== "manager") return res.status(403).json({ msg: "Access denied" });

  const expenses = await Expense.find({ status: "Pending" })
    .populate("user", "name email")
    .sort({ submittedAt: -1 });
  res.json(expenses);
});

// Approve or Reject
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "manager") return res.status(403).json({ msg: "Access denied" });

  const { status, managerComment } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status, managerComment, approvedAt: status === "Approved" ? new Date() : null },
      { new: true }
    ).populate("user", "name");

    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
});

export default router;