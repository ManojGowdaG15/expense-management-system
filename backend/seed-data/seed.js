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
        },
        { 
            name: 'Training', 
            code: 'TRAIN', 
            description: 'Training and development expenses',
            limit: 3000,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['corporate_card', 'online'],
            isActive: true
        },
        { 
            name: 'Software', 
            code: 'SW', 
            description: 'Software subscriptions and licenses',
            limit: 5000,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['corporate_card', 'online'],
            isActive: true
        },
        { 
            name: 'Entertainment', 
            code: 'ENT', 
            description: 'Client entertainment expenses',
            limit: 1500,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['credit_card', 'corporate_card'],
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
        {
            name: 'Super Admin',
            email: 'superadmin@datasturdy.com',
            password: hashedAdminPassword,
            role: 'admin',
            department: 'Administration',
            designation: 'Super Administrator',
            employeeId: 'ADM002',
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
        {
            name: 'Accounts Executive',
            email: 'accounts@datasturdy.com',
            password: hashedFinancePassword,
            role: 'finance',
            department: 'Finance',
            designation: 'Accounts Executive',
            employeeId: 'FIN002',
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
        {
            name: 'Marketing Manager',
            email: 'marketingmanager@datasturdy.com',
            password: hashedManagerPassword,
            role: 'manager',
            department: 'Marketing',
            designation: 'Marketing Manager',
            employeeId: 'MGR003',
            isActive: true
        },
        {
            name: 'HR Manager',
            email: 'hrmanager@datasturdy.com',
            password: hashedManagerPassword,
            role: 'manager',
            department: 'Human Resources',
            designation: 'HR Manager',
            employeeId: 'MGR004',
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
        {
            name: 'Lisa DevOps',
            email: 'lisa.devops@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'DevOps Engineer',
            employeeId: 'ENG004',
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
        },
        {
            name: 'David Relations',
            email: 'david.relations@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Sales',
            designation: 'Business Development',
            employeeId: 'SAL003',
            isActive: true
        },

        // Marketing Employees
        {
            name: 'Olivia Marketing',
            email: 'olivia.marketing@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Marketing',
            designation: 'Marketing Specialist',
            employeeId: 'MRK001',
            isActive: true
        },
        {
            name: 'James Content',
            email: 'james.content@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Marketing',
            designation: 'Content Writer',
            employeeId: 'MRK002',
            isActive: true
        },

        // HR Employees
        {
            name: 'Sophia HR',
            email: 'sophia.hr@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Human Resources',
            designation: 'HR Executive',
            employeeId: 'HR001',
            isActive: true
        },
        {
            name: 'Robert Recruiter',
            email: 'robert.recruiter@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Human Resources',
            designation: 'Recruitment Specialist',
            employeeId: 'HR002',
            isActive: true
        }
    ];

    try {
        const createdUsers = await User.insertMany(users);
        console.log(`✅ ${createdUsers.length} users created`);

        // Set manager relationships
        const engineeringManager = createdUsers.find(u => u.email === 'engmanager@datasturdy.com');
        const salesManager = createdUsers.find(u => u.email === 'salesmanager@datasturdy.com');
        const marketingManager = createdUsers.find(u => u.email === 'marketingmanager@datasturdy.com');
        const hrManager = createdUsers.find(u => u.email === 'hrmanager@datasturdy.com');

        // Update employees with their manager IDs
        await User.updateMany(
            { 
                department: 'Engineering', 
                role: 'employee',
                email: { $ne: 'engmanager@datasturdy.com' }
            },
            { managerId: engineeringManager._id }
        );

        await User.updateMany(
            { 
                department: 'Sales', 
                role: 'employee',
                email: { $ne: 'salesmanager@datasturdy.com' }
            },
            { managerId: salesManager._id }
        );

        await User.updateMany(
            { 
                department: 'Marketing', 
                role: 'employee',
                email: { $ne: 'marketingmanager@datasturdy.com' }
            },
            { managerId: marketingManager._id }
        );

        await User.updateMany(
            { 
                department: 'Human Resources', 
                role: 'employee',
                email: { $ne: 'hrmanager@datasturdy.com' }
            },
            { managerId: hrManager._id }
        );

        console.log('✅ Manager relationships set');
        return createdUsers;
    } catch (error) {
        console.error('Error seeding users:', error);
        return [];
    }
};

// Generate realistic expense data
const seedExpenses = async (users, categories) => {
    const expenses = [];
    const statuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed'];
    const paymentMethods = ['cash', 'credit_card', 'debit_card', 'online', 'corporate_card'];
    const categoriesArray = ['travel', 'food', 'accommodation', 'office_supplies', 'others'];
    
    const employees = users.filter(u => u.role === 'employee');
    const managers = users.filter(u => u.role === 'manager');
    const financeUsers = users.filter(u => u.role === 'finance');

    // Helper function to get random date within range
    const randomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Helper function to get random element from array
    const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Generate 50 expenses per employee (for testing)
    for (const employee of employees) {
        const employeeManager = managers.find(m => 
            m.department === employee.department && m.role === 'manager'
        );

        for (let i = 0; i < 50; i++) {
            const category = randomElement(categoriesArray);
            const status = randomElement(statuses);
            const amount = Math.floor(Math.random() * 5000) + 100;
            const expenseDate = randomDate(new Date(2024, 0, 1), new Date());
            const submissionDate = new Date(expenseDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
            
            const expenseData = {
                userId: employee._id,
                expenseDate,
                submissionDate,
                category,
                amount,
                currency: 'USD',
                description: `Expense for ${category} - ${getExpenseDescription(category)}`,
                vendorName: getVendorName(category),
                paymentMethod: randomElement(paymentMethods),
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

            if (['under_review', 'approved', 'rejected', 'reimbursed'].includes(status)) {
                const reviewDate = new Date(submissionDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
                expenseData.statusHistory.push({
                    status: 'under_review',
                    changedBy: employeeManager?._id || employee._id,
                    comments: 'Under review by manager',
                    changedAt: reviewDate
                });
                expenseData.approverId = employeeManager?._id;
            }

            if (['approved', 'reimbursed'].includes(status)) {
                const approvalDate = new Date(submissionDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
                expenseData.statusHistory.push({
                    status: 'approved',
                    changedBy: employeeManager?._id || employee._id,
                    comments: 'Approved by manager',
                    changedAt: approvalDate
                });
                expenseData.approvalDate = approvalDate;
            }

            if (status === 'rejected') {
                const rejectionDate = new Date(submissionDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
                expenseData.statusHistory.push({
                    status: 'rejected',
                    changedBy: employeeManager?._id || employee._id,
                    comments: 'Rejected - exceeds policy limits',
                    changedAt: rejectionDate
                });
                expenseData.rejectionReason = 'Expense exceeds policy limits or insufficient documentation';
            }

            if (status === 'reimbursed') {
                const reimbursementDate = new Date(submissionDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
                const financeUser = randomElement(financeUsers);
                expenseData.statusHistory.push({
                    status: 'reimbursed',
                    changedBy: financeUser._id,
                    comments: 'Reimbursement processed',
                    changedAt: reimbursementDate
                });
                expenseData.financeApproverId = financeUser._id;
                expenseData.reimbursementDate = reimbursementDate;
                expenseData.reimbursementMode = randomElement(['bank_transfer', 'cheque', 'wallet']);
            }

            expenses.push(expenseData);
        }
    }

    try {
        // Insert in batches to avoid memory issues
        const batchSize = 100;
        for (let i = 0; i < expenses.length; i += batchSize) {
            const batch = expenses.slice(i, i + batchSize);
            await Expense.insertMany(batch);
            console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(expenses.length/batchSize)}`);
        }
        console.log(`✅ ${expenses.length} expenses created`);
    } catch (error) {
        console.error('Error seeding expenses:', error);
    }
};

// Helper functions for generating realistic data
function getExpenseDescription(category) {
    const descriptions = {
        travel: ['Client meeting travel', 'Conference attendance', 'Business trip to client site', 'Team offsite travel'],
        food: ['Client lunch meeting', 'Team dinner', 'Conference meals', 'Working lunch'],
        accommodation: ['Hotel stay for conference', 'Client visit accommodation', 'Training program stay'],
        office_supplies: ['Laptop accessories', 'Stationery purchase', 'Office furniture', 'Team supplies'],
        others: ['Professional membership', 'Software subscription', 'Books and materials', 'Certification fee']
    };
    return descriptions[category] ? descriptions[category][Math.floor(Math.random() * descriptions[category].length)] : 'Business expense';
}

function getVendorName(category) {
    const vendors = {
        travel: ['Uber Corporate', 'Airline Corp', 'Railway Services', 'Taxi Company'],
        food: ['Restaurant Chain', 'Food Delivery Service', 'Cafeteria', 'Fine Dining'],
        accommodation: ['Hotel Chain', 'Airbnb Business', 'Serviced Apartments'],
        office_supplies: ['Office Depot', 'Amazon Business', 'Local Stationery', 'Tech Store'],
        others: ['Software Inc', 'Training Provider', 'Professional Body', 'Online Platform']
    };
    return vendors[category] ? vendors[category][Math.floor(Math.random() * vendors[category].length)] : 'Vendor Inc';
}

function getRandomNotes(status) {
    const notes = {
        draft: ['Need to add receipt', 'Verify amounts', 'Check policy compliance'],
        submitted: ['Submitted for approval', 'Awaiting manager review', 'Documentation complete'],
        under_review: ['Being reviewed by manager', 'Additional info requested', 'Policy compliance check'],
        approved: ['Approved per policy', 'Ready for reimbursement', 'All checks passed'],
        rejected: ['Exceeds limit', 'Missing documentation', 'Non-compliant with policy'],
        reimbursed: ['Payment processed', 'Reimbursement completed', 'Bank transfer done']
    };
    return notes[status] ? notes[status][Math.floor(Math.random() * notes[status].length)] : 'Expense note';
}

// Assignment-specific test data
const seedAssignmentTestData = async (users) => {
    console.log('\n📝 Creating assignment-specific test data...');

    // Get specific users for assignment scenarios
    const employeeUser = users.find(u => u.email === 'john.developer@datasturdy.com');
    const managerUser = users.find(u => u.email === 'engmanager@datasturdy.com');
    const financeUser = users.find(u => u.email === 'finance@datasturdy.com');

    if (!employeeUser || !managerUser || !financeUser) {
        console.error('❌ Required users not found for assignment test data');
        return;
    }

    const assignmentExpenses = [];

    // SCENARIO 1: Employee submits travel expense (5000 INR for Travel)
    const travelExpense = {
        userId: employeeUser._id,
        expenseId: `EXP2024ASSIGN001`,
        expenseDate: new Date('2024-12-10'),
        submissionDate: new Date('2024-12-10'),
        category: 'travel',
        amount: 5000,
        currency: 'INR',
        description: 'Travel expense for client meeting in Mumbai',
        vendorName: 'Uber Corporate',
        paymentMethod: 'corporate_card',
        receiptNumber: 'REC123456',
        receiptFile: 'travel_receipt_001.pdf',
        status: 'submitted',
        tags: ['travel', 'client-meeting', 'assignment'],
        notes: 'Travel to client site for project discussion',
        statusHistory: [{
            status: 'submitted',
            changedBy: employeeUser._id,
            comments: 'Travel expense submitted as per assignment requirement',
            changedAt: new Date('2024-12-10')
        }]
    };
    assignmentExpenses.push(travelExpense);

    // SCENARIO 2: Employee submits food expense (pending approval)
    const foodExpense = {
        userId: employeeUser._id,
        expenseId: `EXP2024ASSIGN002`,
        expenseDate: new Date('2024-12-11'),
        submissionDate: new Date('2024-12-11'),
        category: 'food',
        amount: 2500,
        currency: 'INR',
        description: 'Team lunch during project milestone',
        vendorName: 'Restaurant Chain',
        paymentMethod: 'credit_card',
        receiptNumber: 'REC123457',
        receiptFile: 'food_receipt_002.pdf',
        status: 'under_review',
        approverId: managerUser._id,
        tags: ['food', 'team-lunch', 'assignment'],
        notes: 'Team celebration for project completion',
        statusHistory: [
            {
                status: 'submitted',
                changedBy: employeeUser._id,
                comments: 'Food expense submitted',
                changedAt: new Date('2024-12-11')
            },
            {
                status: 'under_review',
                changedBy: managerUser._id,
                comments: 'Under review by manager',
                changedAt: new Date('2024-12-11')
            }
        ]
    };
    assignmentExpenses.push(foodExpense);

    // SCENARIO 3: Manager approves an expense
    const approvedExpense = {
        userId: employeeUser._id,
        expenseId: `EXP2024ASSIGN003`,
        expenseDate: new Date('2024-12-05'),
        submissionDate: new Date('2024-12-05'),
        category: 'office_supplies',
        amount: 3500,
        currency: 'INR',
        description: 'Purchase of office stationery and supplies',
        vendorName: 'Office Depot',
        paymentMethod: 'debit_card',
        receiptNumber: 'REC123458',
        receiptFile: 'office_receipt_003.pdf',
        status: 'approved',
        approverId: managerUser._id,
        approvalDate: new Date('2024-12-07'),
        tags: ['office-supplies', 'stationery', 'assignment'],
        notes: 'Approved by manager as per policy',
        statusHistory: [
            {
                status: 'submitted',
                changedBy: employeeUser._id,
                comments: 'Office supplies expense submitted',
                changedAt: new Date('2024-12-05')
            },
            {
                status: 'under_review',
                changedBy: managerUser._id,
                comments: 'Under review',
                changedAt: new Date('2024-12-06')
            },
            {
                status: 'approved',
                changedBy: managerUser._id,
                comments: 'Approved - within policy limits',
                changedAt: new Date('2024-12-07')
            }
        ]
    };
    assignmentExpenses.push(approvedExpense);

    // SCENARIO 4: Manager rejects an expense
    const rejectedExpense = {
        userId: employeeUser._id,
        expenseId: `EXP2024ASSIGN004`,
        expenseDate: new Date('2024-12-03'),
        submissionDate: new Date('2024-12-03'),
        category: 'accommodation',
        amount: 8500,
        currency: 'INR',
        description: 'Hotel stay during conference',
        vendorName: 'Hotel Chain',
        paymentMethod: 'corporate_card',
        receiptNumber: 'REC123459',
        receiptFile: 'hotel_receipt_004.pdf',
        status: 'rejected',
        approverId: managerUser._id,
        rejectionReason: 'Hotel expense exceeds the daily limit of ₹5000 as per company policy',
        tags: ['accommodation', 'conference', 'assignment'],
        notes: 'Rejected due to policy violation',
        statusHistory: [
            {
                status: 'submitted',
                changedBy: employeeUser._id,
                comments: 'Hotel expense submitted',
                changedAt: new Date('2024-12-03')
            },
            {
                status: 'under_review',
                changedBy: managerUser._id,
                comments: 'Checking policy compliance',
                changedAt: new Date('2024-12-04')
            },
            {
                status: 'rejected',
                changedBy: managerUser._id,
                comments: 'Rejected - exceeds daily accommodation limit',
                changedAt: new Date('2024-12-05')
            }
        ]
    };
    assignmentExpenses.push(rejectedExpense);

    // SCENARIO 5: Finance processes reimbursement
    const reimbursedExpense = {
        userId: employeeUser._id,
        expenseId: `EXP2024ASSIGN005`,
        expenseDate: new Date('2024-11-20'),
        submissionDate: new Date('2024-11-20'),
        category: 'travel',
        amount: 4200,
        currency: 'INR',
        description: 'Flight ticket for training program',
        vendorName: 'Airline Corp',
        paymentMethod: 'online',
        receiptNumber: 'REC123460',
        receiptFile: 'flight_receipt_005.pdf',
        status: 'reimbursed',
        approverId: managerUser._id,
        financeApproverId: financeUser._id,
        approvalDate: new Date('2024-11-25'),
        reimbursementDate: new Date('2024-12-01'),
        reimbursementMode: 'bank_transfer',
        tags: ['travel', 'training', 'flight', 'assignment'],
        notes: 'Reimbursement processed successfully',
        statusHistory: [
            {
                status: 'submitted',
                changedBy: employeeUser._id,
                comments: 'Flight expense submitted',
                changedAt: new Date('2024-11-20')
            },
            {
                status: 'under_review',
                changedBy: managerUser._id,
                comments: 'Manager review in progress',
                changedAt: new Date('2024-11-22')
            },
            {
                status: 'approved',
                changedBy: managerUser._id,
                comments: 'Approved for reimbursement',
                changedAt: new Date('2024-11-25')
            },
            {
                status: 'reimbursed',
                changedBy: financeUser._id,
                comments: 'Bank transfer completed',
                changedAt: new Date('2024-12-01')
            }
        ]
    };
    assignmentExpenses.push(reimbursedExpense);

    // Insert assignment test expenses
    try {
        await Expense.insertMany(assignmentExpenses);
        console.log(`✅ ${assignmentExpenses.length} assignment-specific expenses created`);
        
        // Print test credentials for assignment
        console.log('\n📋 ASSIGNMENT TEST CREDENTIALS:');
        console.log('================================');
        console.log('\n👤 Employee Login:');
        console.log('Email: john.developer@datasturdy.com');
        console.log('Password: employee123');
        console.log('\n👨‍💼 Manager Login:');
        console.log('Email: engmanager@datasturdy.com');
        console.log('Password: manager123');
        console.log('\n💰 Finance Login:');
        console.log('Email: finance@datasturdy.com');
        console.log('Password: finance123');
        console.log('\n👑 Admin Login:');
        console.log('Email: admin@datasturdy.com');
        console.log('Password: admin123');
        console.log('\n📝 Assignment Test Data Summary:');
        console.log('1. Travel Expense (5000 INR) - Status: Submitted');
        console.log('2. Food Expense (2500 INR) - Status: Under Review');
        console.log('3. Office Supplies (3500 INR) - Status: Approved');
        console.log('4. Hotel Stay (8500 INR) - Status: Rejected');
        console.log('5. Flight Ticket (4200 INR) - Status: Reimbursed');
        
    } catch (error) {
        console.error('Error creating assignment test data:', error);
    }
};

// Main seeding function
const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('🚀 Starting database seeding...\n');
        
        // Clear existing data
        await clearDatabase();
        
        // Seed in order
        const departments = await seedDepartments();
        const categories = await seedCategories();
        const users = await seedUsers(departments);
        await seedExpenses(users, categories);
        
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
        
        console.log('\n🎉 Your Expense Management System is ready with test data!');
        console.log('\n🔗 API Base URL: http://localhost:5000');
        console.log('📚 API Documentation: Check README.md for endpoints');
        console.log('\n⚠️  IMPORTANT: Use the test credentials above for assignment testing');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during database seeding:', error);
        process.exit(1);
    }
};

// Run the seeding
seedDatabase();