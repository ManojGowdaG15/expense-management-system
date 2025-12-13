// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const { seedUsers } = require('./controllers/authController');

const app = express();

// Connect to MongoDB
connectDB();

// Seed test users on startup (safe for production with check)
seedUsers();

// === BULLETPROOF CORS CONFIGURATION ===
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
const allowedOrigins = [
  'https://expense-management-system-eosin.vercel.app',      // Your production URL
  'https://expense-management-system-jzld0ph3k-manoj-gowda-gs-projects.vercel.app', // Your preview URL
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];
    
    // Log all incoming origins for debugging
    console.log('Incoming origin:', origin);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// === END FIX ===

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Expense Management API Running ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});