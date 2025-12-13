const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const User = require('../models/User');
const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');
const Department = require('../models/Department');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected for seeding...');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clear existing data
const clearDatabase = async () => {
    try {
        await User.deleteMany({});
        await Expense.deleteMany({});
        await ExpenseCategory.deleteMany({});
        await Department.deleteMany({});
        console.log('🗑️  Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

// Create departments
const seedDepartments = async () => {
    const departments = [
        { name: 'Engineering', code: 'ENG', budget: 500000, monthlyLimit: 41666 },
        { name: 'Sales', code: 'SAL', budget: 300000, monthlyLimit: 25000 },
        { name: 'Marketing', code: 'MRK', budget: 200000, monthlyLimit: 16666 },
        { name: 'Human Resources', code: 'HR', budget: 150000, monthlyLimit: 12500 },
        { name: 'Finance', code: 'FIN', budget: 250000, monthlyLimit: 20833 },
        { name: 'Operations', code: 'OPS', budget: 180000, monthlyLimit: 15000 },
        { name: 'Product', code: 'PROD', budget: 220000, monthlyLimit: 18333 },
        { name: 'Administration', code: 'ADMIN', budget: 100000, monthlyLimit: 8333 }
    ];

    try {
        const createdDepartments = await Department.insertMany(departments);
        console.log(`✅ ${createdDepartments.length} departments created`);
        return createdDepartments;
    } catch (error) {
        console.error('Error seeding departments:', error);
        return [];
    }
};

// Create expense categories
const seedCategories = async () => {
    const categories = [
        { 
            name: 'Travel', 
            code: 'TRAVEL', 
            description: 'Business travel expenses',
            limit: 5000,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['corporate_card', 'credit_card', 'online'],
            isActive: true
        },
        { 
            name: 'Food', 
            code: 'FOOD', 
            description: 'Food and dining expenses',
            limit: 1000,
            requiresApproval: false,
            requiresReceipt: true,
            allowedPaymentMethods: ['credit_card', 'debit_card', 'cash'],
            isActive: true
        },
        { 
            name: 'Accommodation', 
            code: 'ACCOM', 
            description: 'Hotel and accommodation expenses',
            limit: 3000,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['corporate_card', 'credit_card'],
            isActive: true
        },
        { 
            name: 'Office Supplies', 
            code: 'OFFICE', 
            description: 'Office equipment and supplies',
            limit: 2000,
            requiresApproval: false,
            requiresReceipt: true,
            allowedPaymentMethods: ['corporate_card', 'credit_card', 'online'],
            isActive: true
        },
        { 
            name: 'Others', 
            code: 'OTHER', 
            description: 'Miscellaneous expenses',
            limit: 500,
            requiresApproval: false,
            requiresReceipt: false,
            allowedPaymentMethods: ['cash', 'credit_card', 'debit_card'],
            isActive: true
        }
    ];

    try {
        const createdCategories = await ExpenseCategory.insertMany(categories);
        console.log(`✅ ${createdCategories.length} categories created`);
        return createdCategories;
    } catch (error) {
        console.error('Error seeding categories:', error);
        return [];
    }
};

// Create users with different roles
const seedUsers = async (departments) => {
    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedManagerPassword = await bcrypt.hash('manager123', 10);
    const hashedFinancePassword = await bcrypt.hash('finance123', 10);
    const hashedEmployeePassword = await bcrypt.hash('employee123', 10);

    const users = [
        // Admin users
        {
            name: 'System Admin',
            email: 'admin@datasturdy.com',
            password: hashedAdminPassword,
            role: 'admin',
            department: 'Administration',
            designation: 'System Administrator',
            employeeId: 'ADM001',
            isActive: true
        },

        // Finance users
        {
            name: 'Finance Manager',
            email: 'finance@datasturdy.com',
            password: hashedFinancePassword,
            role: 'finance',
            department: 'Finance',
            designation: 'Finance Manager',
            employeeId: 'FIN001',
            isActive: true
        },

        // Department Managers
        {
            name: 'Engineering Manager',
            email: 'engmanager@datasturdy.com',
            password: hashedManagerPassword,
            role: 'manager',
            department: 'Engineering',
            designation: 'Engineering Manager',
            employeeId: 'MGR001',
            isActive: true
        },
        {
            name: 'Sales Manager',
            email: 'salesmanager@datasturdy.com',
            password: hashedManagerPassword,
            role: 'manager',
            department: 'Sales',
            designation: 'Sales Manager',
            employeeId: 'MGR002',
            isActive: true
        },

        // Engineering Employees
        {
            name: 'John Developer',
            email: 'john.developer@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'Senior Software Engineer',
            employeeId: 'ENG001',
            isActive: true
        },
        {
            name: 'Sarah Engineer',
            email: 'sarah.engineer@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'Frontend Developer',
            employeeId: 'ENG002',
            isActive: true
        },
        {
            name: 'Mike Tester',
            email: 'mike.tester@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'QA Engineer',
            employeeId: 'ENG003',
            isActive: true
        },

        // Sales Employees
        {
            name: 'Alex Sales',
            email: 'alex.sales@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Sales',
            designation: 'Sales Executive',
            employeeId: 'SAL001',
            isActive: true
        },
        {
            name: 'Emma Client',
            email: 'emma.client@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Sales',
            designation: 'Account Manager',
            employeeId: 'SAL002',
            isActive: true
        }
    ];

    try {
        const createdUsers = await User.insertMany(users);
        console.log(`✅ ${createdUsers.length} users created`);

        // Set manager relationships
        const engineeringManager = createdUsers.find(u => u.email === 'engmanager@datasturdy.com');
        const salesManager = createdUsers.find(u => u.email === 'salesmanager@datasturdy.com');

        // Update employees with their manager IDs
        await User.updateMany(
            { 
                department: 'Engineering', 
                role: 'employee'
            },
            { managerId: engineeringManager._id }
        );

        await User.updateMany(
            { 
                department: 'Sales', 
                role: 'employee'
            },
            { managerId: salesManager._id }
        );

        console.log('✅ Manager relationships set');
        return createdUsers;
    } catch (error) {
        console.error('Error seeding users:', error);
        return [];
    }
};

// Counter for generating unique expense IDs
let expenseCounter = 1;

// Helper to generate unique expense ID
const generateExpenseId = () => {
    const year = new Date().getFullYear();
    const id = `EXP${year}${String(expenseCounter).padStart(5, '0')}`;
    expenseCounter++;
    return id;
};

// Generate realistic expense data
const seedExpenses = async (users) => {
    const expenses = [];
    const statuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed', 'paid'];
    const paymentMethods = ['cash', 'credit_card', 'debit_card', 'online', 'corporate_card'];
    const categoriesArray = ['travel', 'food', 'accommodation', 'office_supplies', 'others'];
    
    const employees = users.filter(u => u.role === 'employee');
    const managers = users.filter(u => u.role === 'manager');
    const financeUsers = users.filter(u => u.role === 'finance');

    // Helper function to get random date within last 7 days
    const getRandomRecentDate = () => {
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        
        return new Date(oneWeekAgo.getTime() + Math.random() * (today.getTime() - oneWeekAgo.getTime()));
    };

    // Generate 5-8 expenses per employee
    for (const employee of employees) {
        const employeeManager = managers.find(m => 
            m.department === employee.department && m.role === 'manager'
        );

        const expenseCount = Math.floor(Math.random() * 4) + 5; // 5-8 expenses per employee

        for (let i = 0; i < expenseCount; i++) {
            const category = categoriesArray[Math.floor(Math.random() * categoriesArray.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Generate amount based on category
            let amount;
            switch(category) {
                case 'travel': amount = Math.floor(Math.random() * 4500) + 500; break;
                case 'food': amount = Math.floor(Math.random() * 800) + 200; break;
                case 'accommodation': amount = Math.floor(Math.random() * 2500) + 1000; break;
                case 'office_supplies': amount = Math.floor(Math.random() * 1500) + 500; break;
                default: amount = Math.floor(Math.random() * 400) + 100;
            }
            
            const expenseDate = getRandomRecentDate();
            const submissionDate = new Date(expenseDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
            
            const expenseData = {
                expenseId: generateExpenseId(),
                userId: employee._id,
                expenseDate,
                submissionDate,
                category,
                amount,
                currency: 'INR',
                description: getExpenseDescription(category, employee.department),
                vendorName: getVendorName(category),
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                receiptNumber: `REC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
                receiptFile: `receipt_${employee._id}_${i}.pdf`,
                status,
                tags: [category, employee.department.toLowerCase()],
                notes: getRandomNotes(status),
                statusHistory: []
            };

            // Add status history based on status
            if (status !== 'draft') {
                expenseData.statusHistory.push({
                    status: 'submitted',
                    changedBy: employee._id,
                    comments: 'Expense submitted',
                    changedAt: submissionDate
                });
            }

            if (['under_review', 'approved', 'rejected', 'reimbursed', 'paid'].includes(status)) {
                const reviewDate = new Date(submissionDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
                expenseData.statusHistory.push({
                    status: 'under_review',
                    changedBy: employeeManager?._id || employee._id,
                    comments: 'Under review by manager',
                    changedAt: reviewDate
                });
                if (employeeManager) {
                    expenseData.approverId = employeeManager._id;
                }
            }

            if (['approved', 'reimbursed', 'paid'].includes(status)) {
                const approvalDate = new Date(submissionDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
                expenseData.statusHistory.push({
                    status: 'approved',
                    changedBy: employeeManager?._id || employee._id,
                    comments: 'Approved by manager',
                    changedAt: approvalDate
                });
                expenseData.approvalDate = approvalDate;
            }

            if (status === 'rejected') {
                const rejectionDate = new Date(submissionDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
                expenseData.statusHistory.push({
                    status: 'rejected',
                    changedBy: employeeManager?._id || employee._id,
                    comments: 'Rejected - policy violation',
                    changedAt: rejectionDate
                });
                expenseData.rejectionReason = getRejectionReason(category, amount);
            }

            if (status === 'reimbursed' || status === 'paid') {
                const reimbursementDate = new Date(submissionDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
                const financeUser = financeUsers[Math.floor(Math.random() * financeUsers.length)];
                expenseData.statusHistory.push({
                    status: status,
                    changedBy: financeUser._id,
                    comments: `${status === 'reimbursed' ? 'Reimbursement' : 'Payment'} processed`,
                    changedAt: reimbursementDate
                });
                expenseData.financeApproverId = financeUser._id;
                expenseData.reimbursementDate = reimbursementDate;
                expenseData.reimbursementMode = ['bank_transfer', 'cheque'][Math.floor(Math.random() * 2)];
            }

            expenses.push(expenseData);
        }
        
        console.log(`✅ Generated ${expenseCount} expenses for ${employee.name}`);
    }

    try {
        // Insert expenses in batches
        const batchSize = 50;
        for (let i = 0; i < expenses.length; i += batchSize) {
            const batch = expenses.slice(i, i + batchSize);
            await Expense.insertMany(batch);
            console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(expenses.length/batchSize)}`);
        }
        console.log(`✅ ${expenses.length} expenses created`);
    } catch (error) {
        console.error('Error seeding expenses:', error);
        throw error;
    }
};

// Helper functions
function getExpenseDescription(category, department) {
    const descriptions = {
        travel: {
            Engineering: ['Client meeting travel', 'Conference attendance', 'Team offsite'],
            Sales: ['Sales trip', 'Client visit', 'Business development travel'],
            default: ['Business travel', 'Work-related travel']
        },
        food: {
            Engineering: ['Team lunch', 'Working dinner', 'Conference meals'],
            Sales: ['Client lunch', 'Business dinner', 'Entertainment'],
            default: ['Business meal', 'Team dining']
        },
        accommodation: {
            Engineering: ['Hotel for conference', 'Training accommodation'],
            Sales: ['Hotel for client visit', 'Sales trip accommodation'],
            default: ['Business accommodation', 'Hotel stay']
        },
        office_supplies: {
            default: ['Office stationery', 'Printer supplies', 'Team materials']
        },
        others: {
            default: ['Miscellaneous expense', 'Other business cost']
        }
    };

    const deptDescriptions = descriptions[category]?.[department] || descriptions[category]?.default;
    return deptDescriptions ? deptDescriptions[Math.floor(Math.random() * deptDescriptions.length)] : 'Business expense';
}

function getVendorName(category) {
    const vendors = {
        travel: ['Uber Corporate', 'Ola Business', 'MakeMyTrip', 'Air India'],
        food: ['Swiggy Corporate', 'Zomato Business', 'Dominos', 'Local Restaurant'],
        accommodation: ['Taj Hotels', 'Marriott', 'OYO Business', 'Radisson'],
        office_supplies: ['Amazon Business', 'Flipkart Wholesale', 'Office Depot'],
        others: ['Vendor Inc', 'Local Store', 'Online Platform']
    };
    return vendors[category] ? vendors[category][Math.floor(Math.random() * vendors[category].length)] : 'Vendor Inc';
}

function getRandomNotes(status) {
    const notes = {
        draft: ['Need to add receipt', 'Pending documentation'],
        submitted: ['Awaiting manager review', 'Submitted for approval'],
        under_review: ['Being reviewed', 'Verification in progress'],
        approved: ['Approved for payment', 'Ready for reimbursement'],
        rejected: ['Policy violation', 'Missing documentation'],
        reimbursed: ['Payment processed', 'Bank transfer completed'],
        paid: ['Payment issued', 'Transaction complete']
    };
    return notes[status] ? notes[status][Math.floor(Math.random() * notes[status].length)] : 'Expense note';
}

function getRejectionReason(category, amount) {
    const reasons = [
        `Expense exceeds ${category} limit of ${category === 'travel' ? '₹5000' : category === 'accommodation' ? '₹3000' : category === 'food' ? '₹1000' : 'category limit'}`,
        'Missing or unclear receipt',
        'Expense not business-related',
        'Insufficient documentation',
        'Violation of company policy'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
}

// Assignment-specific test data
const seedAssignmentTestData = async (users) => {
    console.log('\n📝 Creating assignment-specific test data...');

    const employeeUser = users.find(u => u.email === 'john.developer@datasturdy.com');
    const managerUser = users.find(u => u.email === 'engmanager@datasturdy.com');
    const financeUser = users.find(u => u.email === 'finance@datasturdy.com');
    const salesEmployee = users.find(u => u.email === 'alex.sales@datasturdy.com');
    const salesManager = users.find(u => u.email === 'salesmanager@datasturdy.com');

    if (!employeeUser || !managerUser || !financeUser || !salesEmployee || !salesManager) {
        console.error('❌ Required users not found for assignment test data');
        return;
    }

    const assignmentExpenses = [];

    // Get current date and dates for last 7 days
    const today = new Date();
    const dates = {
        today: new Date(),
        yesterday: new Date(today.setDate(today.getDate() - 1)),
        twoDaysAgo: new Date(today.setDate(today.getDate() - 2)),
        threeDaysAgo: new Date(today.setDate(today.getDate() - 3)),
        fourDaysAgo: new Date(today.setDate(today.getDate() - 4)),
        fiveDaysAgo: new Date(today.setDate(today.getDate() - 5))
    };

    // Test scenarios
    const testExpenses = [
        // Draft expense
        {
            expenseId: generateExpenseId(),
            userId: employeeUser._id,
            expenseDate: dates.twoDaysAgo,
            submissionDate: dates.twoDaysAgo,
            category: 'travel',
            amount: 3500,
            currency: 'INR',
            description: 'Draft travel expense for review',
            vendorName: 'Uber Corporate',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC-TEST-001',
            receiptFile: 'draft_receipt.pdf',
            status: 'draft',
            tags: ['travel', 'test'],
            notes: 'Need to add hotel receipt',
            statusHistory: []
        },
        // Submitted expense
        {
            expenseId: generateExpenseId(),
            userId: employeeUser._id,
            expenseDate: dates.threeDaysAgo,
            submissionDate: dates.yesterday,
            category: 'food',
            amount: 850,
            currency: 'INR',
            description: 'Team lunch during sprint review',
            vendorName: 'Dominos',
            paymentMethod: 'credit_card',
            receiptNumber: 'REC-TEST-002',
            receiptFile: 'food_receipt.pdf',
            status: 'submitted',
            tags: ['food', 'team', 'test'],
            notes: 'Submitted for manager approval',
            statusHistory: [{
                status: 'submitted',
                changedBy: employeeUser._id,
                comments: 'Team lunch expense submitted',
                changedAt: dates.yesterday
            }]
        },
        // Under review
        {
            expenseId: generateExpenseId(),
            userId: employeeUser._id,
            expenseDate: dates.fourDaysAgo,
            submissionDate: dates.twoDaysAgo,
            category: 'office_supplies',
            amount: 1200,
            currency: 'INR',
            description: 'Office stationery purchase',
            vendorName: 'Amazon Business',
            paymentMethod: 'online',
            receiptNumber: 'REC-TEST-003',
            receiptFile: 'office_receipt.pdf',
            status: 'under_review',
            approverId: managerUser._id,
            tags: ['office-supplies', 'test'],
            notes: 'Under manager review',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Office supplies expense submitted',
                    changedAt: dates.twoDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Reviewing stationery purchase',
                    changedAt: dates.yesterday
                }
            ]
        },
        // Approved expense
        {
            expenseId: generateExpenseId(),
            userId: employeeUser._id,
            expenseDate: dates.fiveDaysAgo,
            submissionDate: dates.threeDaysAgo,
            category: 'travel',
            amount: 4200,
            currency: 'INR',
            description: 'Client meeting travel',
            vendorName: 'Ola Business',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC-TEST-004',
            receiptFile: 'travel_approved.pdf',
            status: 'approved',
            approverId: managerUser._id,
            approvalDate: dates.yesterday,
            tags: ['travel', 'client', 'approved', 'test'],
            notes: 'Approved for reimbursement',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Client travel expense submitted',
                    changedAt: dates.threeDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Reviewing client travel',
                    changedAt: dates.twoDaysAgo
                },
                {
                    status: 'approved',
                    changedBy: managerUser._id,
                    comments: 'Approved - valid business expense',
                    changedAt: dates.yesterday
                }
            ]
        },
        // Rejected expense
        {
            expenseId: generateExpenseId(),
            userId: employeeUser._id,
            expenseDate: dates.fiveDaysAgo,
            submissionDate: dates.threeDaysAgo,
            category: 'accommodation',
            amount: 6500,
            currency: 'INR',
            description: 'Hotel stay during conference',
            vendorName: 'Taj Hotel',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC-TEST-005',
            receiptFile: 'hotel_rejected.pdf',
            status: 'rejected',
            approverId: managerUser._id,
            rejectionReason: 'Hotel expense exceeds daily limit of ₹5000 as per company policy',
            tags: ['accommodation', 'rejected', 'test'],
            notes: 'Rejected due to policy violation',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Conference accommodation submitted',
                    changedAt: dates.threeDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Checking accommodation policy',
                    changedAt: dates.twoDaysAgo
                },
                {
                    status: 'rejected',
                    changedBy: managerUser._id,
                    comments: 'Rejected - exceeds accommodation limit',
                    changedAt: dates.yesterday
                }
            ]
        },
        // Reimbursed expense
        {
            expenseId: generateExpenseId(),
            userId: employeeUser._id,
            expenseDate: new Date('2024-11-25'),
            submissionDate: new Date('2024-11-26'),
            category: 'travel',
            amount: 3800,
            currency: 'INR',
            description: 'Flight ticket for training',
            vendorName: 'Air India',
            paymentMethod: 'online',
            receiptNumber: 'REC-TEST-006',
            receiptFile: 'flight_reimbursed.pdf',
            status: 'reimbursed',
            approverId: managerUser._id,
            financeApproverId: financeUser._id,
            approvalDate: new Date('2024-11-28'),
            reimbursementDate: new Date('2024-12-01'),
            reimbursementMode: 'bank_transfer',
            tags: ['travel', 'training', 'reimbursed', 'test'],
            notes: 'Reimbursement processed successfully',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Training travel expense submitted',
                    changedAt: new Date('2024-11-26')
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Reviewing training travel',
                    changedAt: new Date('2024-11-27')
                },
                {
                    status: 'approved',
                    changedBy: managerUser._id,
                    comments: 'Approved for reimbursement',
                    changedAt: new Date('2024-11-28')
                },
                {
                    status: 'reimbursed',
                    changedBy: financeUser._id,
                    comments: 'Bank transfer completed',
                    changedAt: new Date('2024-12-01')
                }
            ]
        },
        // Sales team expense
        {
            expenseId: generateExpenseId(),
            userId: salesEmployee._id,
            expenseDate: dates.threeDaysAgo,
            submissionDate: dates.twoDaysAgo,
            category: 'travel',
            amount: 2800,
            currency: 'INR',
            description: 'Client visit in Delhi',
            vendorName: 'Air India',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC-TEST-007',
            receiptFile: 'sales_travel.pdf',
            status: 'approved',
            approverId: salesManager._id,
            approvalDate: dates.yesterday,
            tags: ['travel', 'sales', 'client-visit', 'test'],
            notes: 'Sales travel approved',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: salesEmployee._id,
                    comments: 'Sales travel expense submitted',
                    changedAt: dates.twoDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: salesManager._id,
                    comments: 'Reviewing sales travel',
                    changedAt: dates.yesterday
                },
                {
                    status: 'approved',
                    changedBy: salesManager._id,
                    comments: 'Approved - client meeting',
                    changedAt: dates.yesterday
                }
            ]
        }
    ];

    assignmentExpenses.push(...testExpenses);

    // Insert assignment test expenses
    try {
        await Expense.insertMany(assignmentExpenses);
        console.log(`✅ ${assignmentExpenses.length} assignment-specific expenses created`);
        
        // Print test credentials
        console.log('\n📋 TEST CREDENTIALS:');
        console.log('====================');
        console.log('\n👨‍💻 Engineering Employee:');
        console.log('Email: john.developer@datasturdy.com');
        console.log('Password: employee123');
        
        console.log('\n👨‍💼 Engineering Manager:');
        console.log('Email: engmanager@datasturdy.com');
        console.log('Password: manager123');
        
        console.log('\n💰 Finance User:');
        console.log('Email: finance@datasturdy.com');
        console.log('Password: finance123');
        
        console.log('\n👑 Admin User:');
        console.log('Email: admin@datasturdy.com');
        console.log('Password: admin123');
        
        console.log('\n💼 Sales Employee:');
        console.log('Email: alex.sales@datasturdy.com');
        console.log('Password: employee123');
        
        console.log('\n📊 Sales Manager:');
        console.log('Email: salesmanager@datasturdy.com');
        console.log('Password: manager123');
        
        console.log('\n📝 Test Data Summary:');
        console.log('1. Draft Travel Expense (₹3500) - Status: Draft');
        console.log('2. Submitted Food Expense (₹850) - Status: Submitted');
        console.log('3. Under Review Office Supplies (₹1200) - Status: Under Review');
        console.log('4. Approved Travel (₹4200) - Status: Approved');
        console.log('5. Rejected Accommodation (₹6500) - Status: Rejected');
        console.log('6. Reimbursed Travel (₹3800) - Status: Reimbursed');
        console.log('7. Sales Travel (₹2800) - Status: Approved (Sales Team)');
        
    } catch (error) {
        console.error('Error creating assignment test data:', error);
        throw error;
    }
};

// Main seeding function
const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('🚀 Starting database seeding...\n');
        
        // Clear existing data
        await clearDatabase();
        
        // Reset expense counter
        expenseCounter = 1;
        
        // Seed in order
        const departments = await seedDepartments();
        const categories = await seedCategories();
        const users = await seedUsers(departments);
        
        // Generate expenses
        await seedExpenses(users);
        
        // Create assignment-specific test data
        await seedAssignmentTestData(users);
        
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Database Statistics:');
        console.log(`   Departments: ${departments.length}`);
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Users: ${users.length}`);
        
        // Get expense count
        const expenseCount = await Expense.countDocuments();
        console.log(`   Expenses: ${expenseCount}`);
        
        // Get expense breakdown by status
        const statusCounts = await Expense.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        console.log('\n📈 Expense Status Breakdown:');
        statusCounts.forEach(stat => {
            console.log(`   - ${stat._id}: ${stat.count} expenses`);
        });
        
        // Get expense breakdown by department
        const expenseByDept = await Expense.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $group: { _id: "$user.department", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } }
        ]);
        
        console.log('\n🏢 Department-wise Expense Summary:');
        expenseByDept.forEach(dept => {
            console.log(`   - ${dept._id}: ${dept.count} expenses (₹${dept.totalAmount})`);
        });
        
        console.log('\n🎉 Your Expense Management System is ready with test data!');
        console.log('\n🔗 API Base URL: http://localhost:5000');
        console.log('\n⚠️  IMPORTANT: Use the test credentials above for testing');
        console.log('   • Employee flow: Submit expenses, view history');
        console.log('   • Manager flow: Review pending, approve/reject');
        console.log('   • Finance flow: Process reimbursements');
        console.log('   • Admin flow: Full system access');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during database seeding:', error);
        process.exit(1);
    }
};

// Run the seeding
seedDatabase();