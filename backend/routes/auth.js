import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Seed test users on startup
const seedUsers = async () => {
  const users = [
    { name: "Rahul Employee", email: "employee@example.com", password: "123456", role: "employee" },
    { name: "Priya Manager", email: "manager@example.com", password: "123456", role: "manager" }
  ];

  for (let user of users) {
    if (!await User.findOne({ email: user.email })) {
      user.password = await bcrypt.hash(user.password, 10);
      await User.create(user);
    }
  }
};
seedUsers();

router.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    bcrypt.compare(req.body.password, user.password, (err, match) => {
      if (!match) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    });
  });
});

export default router;