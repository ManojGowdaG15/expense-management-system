// backend/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Expense = require('./models/Expense');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional — comment out if you want to keep old data)
    console.log('🗑️ Clearing old users and expenses...');
    await User.deleteMany({});
    await Expense.deleteMany({});

    // Create Manager
    console.log('👤 Creating Manager...');
    const managerPassword = await bcrypt.hash('mgr123', 10);
    const manager = await User.create({
      name: 'Priya Sharma',
      email: 'manager@example.com',
      password: managerPassword,
      role: 'manager'
    });

    // Create 6 Employees
    console.log('👥 Creating 6 Employees...');
    const employees = [
      { name: 'Amit Kumar', email: 'emp1@example.com', password: 'emp123' },
      { name: 'Sneha Patel', email: 'emp2@example.com', password: 'emp123' },
      { name: 'Rahul Singh', email: 'emp3@example.com', password: 'emp123' },
      { name: 'Ananya Gupta', email: 'emp4@example.com', password: 'emp123' },
      { name: 'Vikram Rao', email: 'emp5@example.com', password: 'emp123' },
      { name: 'Pooja Mehta', email: 'emp6@example.com', password: 'emp123' }
    ];

    const createdEmployees = [];
    for (let emp of employees) {
      const hashed = await bcrypt.hash(emp.password, 10);
      const user = await User.create({
        name: emp.name,
        email: emp.email,
        password: hashed,
        role: 'employee'
      });
      createdEmployees.push(user);
    }

    // Seed Sample Expenses
    console.log('💸 Creating sample expenses...');
    const sampleExpenses = [
      // Pending
      {
        userId: createdEmployees[0]._id,
        userName: createdEmployees[0].name,
        amount: 5200,
        category: 'Travel',
        expenseDate: new Date('2025-12-08'),
        description: 'Cab and flight for client visit in Mumbai',
        receiptDetails: 'Uber receipts + MakeMyTrip booking',
        status: 'Pending'
      },
      {
        userId: createdEmployees[1]._id,
        userName: createdEmployees[1].name,
        amount: 1800,
        category: 'Food',
        expenseDate: new Date('2025-12-10'),
        description: 'Dinner with team after project demo',
        receiptDetails: 'Restaurant bill attached',
        status: 'Pending'
      },
      {
        userId: createdEmployees[2]._id,
        userName: createdEmployees[2].name,
        amount: 9500,
        category: 'Accommodation',
        expenseDate: new Date('2025-12-05'),
        description: '3-night hotel stay for training',
        receiptDetails: 'OYO booking ID: OYO98765',
        status: 'Pending'
      },

      // Approved
      {
        userId: createdEmployees[3]._id,
        userName: createdEmployees[3].name,
        amount: 4200,
        category: 'Travel',
        expenseDate: new Date('2025-11-25'),
        description: 'Train tickets for team offsite',
        receiptDetails: 'IRCTC confirmed',
        status: 'Approved',
        managerComments: 'Approved - essential for team building',
        approvedDate: new Date('2025-11-27')
      },
      {
        userId: createdEmployees[4]._id,
        userName: createdEmployees[4].name,
        amount: 1200,
        category: 'Office Supplies',
        expenseDate: new Date('2025-11-18'),
        description: 'Printer ink and notebooks',
        receiptDetails: 'Amazon invoice #AMZ-45678',
        status: 'Approved',
        managerComments: 'Approved',
        approvedDate: new Date('2025-11-19')
      },

      // Rejected
      {
        userId: createdEmployees[5]._id,
        userName: createdEmployees[5].name,
        amount: 8000,
        category: 'Others',
        expenseDate: new Date('2025-11-12'),
        description: 'New laptop bag (personal use)',
        receiptDetails: 'Flipkart order',
        status: 'Rejected',
        managerComments: 'Rejected - personal item, not business expense',
        approvedDate: new Date('2025-11-13')
      }
    ];

    await Expense.insertMany(sampleExpenses);

    console.log('✅ Seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Manager: manager@example.com / mgr123');
    console.log('   Employees: emp1@example.com to emp6@example.com / emp123');
    console.log('\n   Now start your server with: npm run dev');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
};

seedData();