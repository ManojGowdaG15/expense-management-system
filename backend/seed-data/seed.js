const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const { faker } = require('@faker-js/faker');

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
            name: 'Entertainment', 
            code: 'ENT', 
            description: 'Client entertainment expenses',
            limit: 1500,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['credit_card', 'corporate_card'],
            isActive: true
        },
        { 
            name: 'Internet/Phone', 
            code: 'COMM', 
            description: 'Communication expenses',
            limit: 1000,
            requiresApproval: false,
            requiresReceipt: true,
            allowedPaymentMethods: ['online', 'credit_card'],
            isActive: true
        },
        { 
            name: 'Equipment', 
            code: 'EQUIP', 
            description: 'Office equipment purchase',
            limit: 10000,
            requiresApproval: true,
            requiresReceipt: true,
            allowedPaymentMethods: ['corporate_card', 'online'],
            isActive: true
        },
        { 
            name: 'Miscellaneous', 
            code: 'MISC', 
            description: 'Other miscellaneous expenses',
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
        {
            name: 'Accounts Assistant',
            email: 'accounts.assistant@datasturdy.com',
            password: hashedFinancePassword,
            role: 'finance',
            department: 'Finance',
            designation: 'Accounts Assistant',
            employeeId: 'FIN003',
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
        {
            name: 'Operations Manager',
            email: 'opsmanager@datasturdy.com',
            password: hashedManagerPassword,
            role: 'manager',
            department: 'Operations',
            designation: 'Operations Manager',
            employeeId: 'MGR005',
            isActive: true
        },
        {
            name: 'Product Manager',
            email: 'productmanager@datasturdy.com',
            password: hashedManagerPassword,
            role: 'manager',
            department: 'Product',
            designation: 'Product Manager',
            employeeId: 'MGR006',
            isActive: true
        },

        // Engineering Team (8 employees)
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
        {
            name: 'Robert Backend',
            email: 'robert.backend@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'Backend Developer',
            employeeId: 'ENG005',
            isActive: true
        },
        {
            name: 'Emily Mobile',
            email: 'emily.mobile@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'Mobile Developer',
            employeeId: 'ENG006',
            isActive: true
        },
        {
            name: 'David Architect',
            email: 'david.architect@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'Solutions Architect',
            employeeId: 'ENG007',
            isActive: true
        },
        {
            name: 'Jessica Database',
            email: 'jessica.database@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Engineering',
            designation: 'Database Administrator',
            employeeId: 'ENG008',
            isActive: true
        },

        // Sales Team (6 employees)
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
        {
            name: 'Sophia Corporate',
            email: 'sophia.corporate@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Sales',
            designation: 'Corporate Sales',
            employeeId: 'SAL004',
            isActive: true
        },
        {
            name: 'Kevin Regional',
            email: 'kevin.regional@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Sales',
            designation: 'Regional Sales Head',
            employeeId: 'SAL005',
            isActive: true
        },
        {
            name: 'Megan Inside',
            email: 'megan.inside@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Sales',
            designation: 'Inside Sales',
            employeeId: 'SAL006',
            isActive: true
        },

        // Marketing Team (5 employees)
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
        {
            name: 'Sophie Digital',
            email: 'sophie.digital@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Marketing',
            designation: 'Digital Marketing',
            employeeId: 'MRK003',
            isActive: true
        },
        {
            name: 'Ryan SEO',
            email: 'ryan.seo@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Marketing',
            designation: 'SEO Specialist',
            employeeId: 'MRK004',
            isActive: true
        },
        {
            name: 'Laura Social',
            email: 'laura.social@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Marketing',
            designation: 'Social Media Manager',
            employeeId: 'MRK005',
            isActive: true
        },

        // HR Team (4 employees)
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
        },
        {
            name: 'Michael Payroll',
            email: 'michael.payroll@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Human Resources',
            designation: 'Payroll Executive',
            employeeId: 'HR003',
            isActive: true
        },
        {
            name: 'Jennifer Training',
            email: 'jennifer.training@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Human Resources',
            designation: 'Training Coordinator',
            employeeId: 'HR004',
            isActive: true
        },

        // Operations Team (5 employees)
        {
            name: 'Brian Operations',
            email: 'brian.operations@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Operations',
            designation: 'Operations Executive',
            employeeId: 'OPS001',
            isActive: true
        },
        {
            name: 'Karen Logistics',
            email: 'karen.logistics@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Operations',
            designation: 'Logistics Manager',
            employeeId: 'OPS002',
            isActive: true
        },
        {
            name: 'Thomas Facility',
            email: 'thomas.facility@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Operations',
            designation: 'Facility Manager',
            employeeId: 'OPS003',
            isActive: true
        },
        {
            name: 'Nancy Admin',
            email: 'nancy.admin@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Operations',
            designation: 'Administrative Assistant',
            employeeId: 'OPS004',
            isActive: true
        },
        {
            name: 'Gary Support',
            email: 'gary.support@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Operations',
            designation: 'Support Executive',
            employeeId: 'OPS005',
            isActive: true
        },

        // Product Team (4 employees)
        {
            name: 'Chris Product',
            email: 'chris.product@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Product',
            designation: 'Product Analyst',
            employeeId: 'PROD001',
            isActive: true
        },
        {
            name: 'Amanda UX',
            email: 'amanda.ux@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Product',
            designation: 'UX Designer',
            employeeId: 'PROD002',
            isActive: true
        },
        {
            name: 'Daniel Research',
            email: 'daniel.research@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Product',
            designation: 'Market Researcher',
            employeeId: 'PROD003',
            isActive: true
        },
        {
            name: 'Patricia Strategy',
            email: 'patricia.strategy@datasturdy.com',
            password: hashedEmployeePassword,
            role: 'employee',
            department: 'Product',
            designation: 'Product Strategist',
            employeeId: 'PROD004',
            isActive: true
        }
    ];

    try {
        const createdUsers = await User.insertMany(users);
        console.log(`✅ ${createdUsers.length} users created`);

        // Set manager relationships for all departments
        const managerMap = {
            'Engineering': 'engmanager@datasturdy.com',
            'Sales': 'salesmanager@datasturdy.com',
            'Marketing': 'marketingmanager@datasturdy.com',
            'Human Resources': 'hrmanager@datasturdy.com',
            'Operations': 'opsmanager@datasturdy.com',
            'Product': 'productmanager@datasturdy.com',
            'Finance': 'finance@datasturdy.com',
            'Administration': 'admin@datasturdy.com'
        };

        for (const [department, managerEmail] of Object.entries(managerMap)) {
            const manager = createdUsers.find(u => u.email === managerEmail);
            if (manager) {
                await User.updateMany(
                    { 
                        department: department, 
                        role: 'employee',
                        email: { $ne: managerEmail }
                    },
                    { managerId: manager._id }
                );
                console.log(`✅ Set manager for ${department} department`);
            }
        }

        return createdUsers;
    } catch (error) {
        console.error('Error seeding users:', error);
        return [];
    }
};

// Enhanced expense generation with realistic data
const seedExpenses = async (users, categories) => {
    const expenses = [];
    const statuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed'];
    const paymentMethods = ['cash', 'credit_card', 'debit_card', 'online', 'corporate_card'];
    
    const employees = users.filter(u => u.role === 'employee');
    const managers = users.filter(u => u.role === 'manager');
    const financeUsers = users.filter(u => u.role === 'finance');

    // Helper function to get random date within last 30 days
    const getRandomRecentDate = () => {
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 30); // Last 30 days
        
        return new Date(oneWeekAgo.getTime() + Math.random() * (today.getTime() - oneWeekAgo.getTime()));
    };

    // Get category limits map
    const categoryLimits = {
        'travel': 5000,
        'food': 1000,
        'accommodation': 3000,
        'office_supplies': 2000,
        'software': 5000,
        'training': 3000,
        'entertainment': 1500,
        'internet/phone': 1000,
        'equipment': 10000,
        'miscellaneous': 500
    };

    // Generate 15-20 expenses per employee (more realistic)
    for (const employee of employees) {
        const employeeManager = managers.find(m => 
            m.department === employee.department && m.role === 'manager'
        );
        
        const expenseCount = Math.floor(Math.random() * 6) + 15; // 15-20 expenses per employee

        for (let i = 0; i < expenseCount; i++) {
            const category = Object.keys(categoryLimits)[Math.floor(Math.random() * Object.keys(categoryLimits).length)];
            const categoryLimit = categoryLimits[category];
            
            // Determine status based on realistic workflow
            let status;
            const rand = Math.random();
            if (rand < 0.1) status = 'draft'; // 10% drafts
            else if (rand < 0.3) status = 'submitted'; // 20% submitted
            else if (rand < 0.5) status = 'under_review'; // 20% under review
            else if (rand < 0.8) status = 'approved'; // 30% approved
            else if (rand < 0.9) status = 'rejected'; // 10% rejected
            else status = 'reimbursed'; // 10% reimbursed
            
            // Generate amount based on category limit
            const amount = Math.floor(Math.random() * (categoryLimit * 0.8)) + (categoryLimit * 0.2);
            
            const expenseDate = getRandomRecentDate();
            const submissionDate = new Date(expenseDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
            
            // Generate realistic descriptions
            const descriptions = {
                travel: ['Client meeting in Mumbai', 'Conference travel to Delhi', 'Sales trip to Bangalore', 'Team offsite travel', 'Customer visit'],
                food: ['Team lunch meeting', 'Client dinner', 'Working lunch during project', 'Conference meals', 'Coffee meeting with vendor'],
                accommodation: ['Hotel stay for conference', 'Client visit accommodation', 'Training accommodation', 'Business trip hotel'],
                office_supplies: ['Office stationery', 'Printer cartridges', 'Whiteboard markers', 'Notebooks and pens', 'Desk organizer'],
                software: ['Software license renewal', 'Cloud subscription', 'Development tools', 'Design software', 'Project management tool'],
                training: ['Online course subscription', 'Workshop registration', 'Certification exam fee', 'Training materials'],
                entertainment: ['Client entertainment dinner', 'Team building activity', 'Corporate event', 'Business lunch'],
                'internet/phone': ['Mobile phone bill', 'Internet subscription', 'Data pack recharge', 'Conference call charges'],
                equipment: ['New laptop purchase', 'Monitor upgrade', 'Headset for calls', 'Office chair', 'Standing desk'],
                miscellaneous: ['Professional membership', 'Books and materials', 'Parking charges', 'Courier services']
            };
            
            const vendors = {
                travel: ['Uber Corporate', 'Ola Business', 'MakeMyTrip', 'IRCTC', 'Air India'],
                food: ['Swiggy Corporate', 'Zomato Business', 'Dominos', 'KFC', 'Local Restaurant'],
                accommodation: ['Taj Hotels', 'Marriott', 'Airbnb', 'OYO Business', 'Radisson'],
                office_supplies: ['Amazon Business', 'Flipkart Wholesale', 'Staples', 'Office Depot', 'Local Store'],
                software: ['Microsoft', 'Adobe', 'GitHub', 'Atlassian', 'Slack'],
                training: ['Coursera', 'Udemy', 'LinkedIn Learning', 'Pluralsight', 'Local Institute'],
                entertainment: ['PVR Cinemas', 'Bowling Alley', 'Restaurant Chain', 'Event Venue'],
                'internet/phone': ['Airtel', 'Jio', 'Vodafone', 'ACT Fibernet', 'BSNL'],
                equipment: ['Apple Store', 'HP Store', 'Dell Store', 'Lenovo', 'Amazon'],
                miscellaneous: ['Professional Body', 'Courier Service', 'Local Vendor', 'Online Platform']
            };
            
            const expenseData = {
                userId: employee._id,
                expenseDate,
                submissionDate,
                category,
                amount,
                currency: 'INR',
                description: `${descriptions[category] ? descriptions[category][Math.floor(Math.random() * descriptions[category].length)] : 'Business expense'}`,
                vendorName: vendors[category] ? vendors[category][Math.floor(Math.random() * vendors[category].length)] : 'Vendor Inc',
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                receiptNumber: `REC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
                receiptFile: `receipt_${employee._id}_${i}.pdf`,
                status,
                tags: [category, employee.department.toLowerCase(), employee.designation.toLowerCase().replace(' ', '_')],
                notes: getRandomNotes(status),
                statusHistory: []
            };

            // Add status history based on realistic workflow
            if (status !== 'draft') {
                expenseData.statusHistory.push({
                    status: 'submitted',
                    changedBy: employee._id,
                    comments: 'Expense submitted by employee',
                    changedAt: submissionDate
                });
            }

            if (['under_review', 'approved', 'rejected', 'reimbursed'].includes(status)) {
                const reviewDate = new Date(submissionDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
                if (employeeManager) {
                    expenseData.statusHistory.push({
                        status: 'under_review',
                        changedBy: employeeManager._id,
                        comments: `Under review by ${employeeManager.name}`,
                        changedAt: reviewDate
                    });
                    expenseData.approverId = employeeManager._id;
                }
            }

            if (['approved', 'reimbursed'].includes(status)) {
                const approvalDate = new Date(submissionDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
                if (employeeManager) {
                    expenseData.statusHistory.push({
                        status: 'approved',
                        changedBy: employeeManager._id,
                        comments: amount > 5000 ? 'Approved - requires finance review' : 'Approved by manager',
                        changedAt: approvalDate
                    });
                    expenseData.approvalDate = approvalDate;
                    
                    // If amount > 5000, require finance approval
                    if (amount > 5000) {
                        const financeReviewDate = new Date(approvalDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
                        const financeUser = financeUsers[Math.floor(Math.random() * financeUsers.length)];
                        expenseData.statusHistory.push({
                            status: 'under_review',
                            changedBy: financeUser._id,
                            comments: 'Under finance review for high amount',
                            changedAt: financeReviewDate
                        });
                    }
                }
            }

            if (status === 'rejected') {
                const rejectionDate = new Date(submissionDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
                if (employeeManager) {
                    const rejectionReasons = [
                        'Expense exceeds category limit',
                        'Insufficient documentation',
                        'Non-compliant with company policy',
                        'Missing receipt',
                        'Expense not business related'
                    ];
                    expenseData.statusHistory.push({
                        status: 'rejected',
                        changedBy: employeeManager._id,
                        comments: rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)],
                        changedAt: rejectionDate
                    });
                    expenseData.rejectionReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
                }
            }

            if (status === 'reimbursed') {
                const reimbursementDate = new Date(submissionDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
                const financeUser = financeUsers[Math.floor(Math.random() * financeUsers.length)];
                expenseData.statusHistory.push({
                    status: 'reimbursed',
                    changedBy: financeUser._id,
                    comments: 'Reimbursement processed via bank transfer',
                    changedAt: reimbursementDate
                });
                expenseData.financeApproverId = financeUser._id;
                expenseData.reimbursementDate = reimbursementDate;
                expenseData.reimbursementMode = ['bank_transfer', 'cheque', 'wallet'][Math.floor(Math.random() * 3)];
            }

            expenses.push(expenseData);
        }
        
        console.log(`✅ Generated ${expenseCount} expenses for ${employee.name}`);
    }

    try {
        // Insert in smaller batches to avoid memory issues
        const batchSize = 50;
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

function getRandomNotes(status) {
    const notes = {
        draft: ['Need to add receipt', 'Verify amounts', 'Check policy compliance', 'Pending documentation'],
        submitted: ['Submitted for approval', 'Awaiting manager review', 'Documentation complete', 'Ready for review'],
        under_review: ['Being reviewed by manager', 'Additional info requested', 'Policy compliance check', 'Verification in progress'],
        approved: ['Approved per policy', 'Ready for reimbursement', 'All checks passed', 'Approved for payment'],
        rejected: ['Exceeds limit', 'Missing documentation', 'Non-compliant with policy', 'Requires clarification'],
        reimbursed: ['Payment processed', 'Reimbursement completed', 'Bank transfer done', 'Cheque issued']
    };
    return notes[status] ? notes[status][Math.floor(Math.random() * notes[status].length)] : 'Expense note';
}

// Enhanced assignment-specific test data
const seedAssignmentTestData = async (users) => {
    console.log('\n📝 Creating enhanced assignment-specific test data...');

    // Get specific users for assignment scenarios
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
        today: today,
        yesterday: new Date(today.setDate(today.getDate() - 1)),
        twoDaysAgo: new Date(today.setDate(today.getDate() - 2)),
        threeDaysAgo: new Date(today.setDate(today.getDate() - 3)),
        fourDaysAgo: new Date(today.setDate(today.getDate() - 4)),
        fiveDaysAgo: new Date(today.setDate(today.getDate() - 5)),
        sixDaysAgo: new Date(today.setDate(today.getDate() - 6)),
        weekAgo: new Date(today.setDate(today.getDate() - 7))
    };

    // SCENARIO 1: Employee submits multiple expenses (Engineering Team)
    const engineeringExpenses = [
        {
            userId: employeeUser._id,
            expenseDate: dates.threeDaysAgo,
            submissionDate: dates.twoDaysAgo,
            category: 'travel',
            amount: 4500,
            currency: 'INR',
            description: 'Travel to client site in Pune for project demo',
            vendorName: 'Uber Corporate',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC2024001',
            receiptFile: 'travel_pune_001.pdf',
            status: 'submitted',
            tags: ['travel', 'client-meeting', 'engineering', 'urgent'],
            notes: 'Urgent travel for client presentation',
            statusHistory: [{
                status: 'submitted',
                changedBy: employeeUser._id,
                comments: 'Submitted for manager approval',
                changedAt: dates.twoDaysAgo
            }]
        },
        {
            userId: employeeUser._id,
            expenseDate: dates.fourDaysAgo,
            submissionDate: dates.threeDaysAgo,
            category: 'food',
            amount: 850,
            currency: 'INR',
            description: 'Team lunch during sprint planning',
            vendorName: 'Domino\'s Pizza',
            paymentMethod: 'credit_card',
            receiptNumber: 'REC2024002',
            receiptFile: 'food_team_lunch.pdf',
            status: 'under_review',
            approverId: managerUser._id,
            tags: ['food', 'team-lunch', 'sprint-planning'],
            notes: 'Team building during sprint planning',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Food expense submitted',
                    changedAt: dates.threeDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Reviewing team lunch expense',
                    changedAt: dates.twoDaysAgo
                }
            ]
        },
        {
            userId: employeeUser._id,
            expenseDate: dates.fiveDaysAgo,
            submissionDate: dates.fourDaysAgo,
            category: 'software',
            amount: 3500,
            currency: 'INR',
            description: 'JetBrains IDE license renewal',
            vendorName: 'JetBrains',
            paymentMethod: 'online',
            receiptNumber: 'REC2024003',
            receiptFile: 'software_license.pdf',
            status: 'approved',
            approverId: managerUser._id,
            approvalDate: dates.threeDaysAgo,
            tags: ['software', 'development', 'license', 'engineering'],
            notes: 'Essential development tool renewal',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Software license renewal submitted',
                    changedAt: dates.fourDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Checking license validity',
                    changedAt: dates.threeDaysAgo
                },
                {
                    status: 'approved',
                    changedBy: managerUser._id,
                    comments: 'Approved - essential development tool',
                    changedAt: dates.threeDaysAgo
                }
            ]
        },
        {
            userId: employeeUser._id,
            expenseDate: dates.sixDaysAgo,
            submissionDate: dates.fiveDaysAgo,
            category: 'accommodation',
            amount: 7500,
            currency: 'INR',
            description: 'Hotel stay during tech conference',
            vendorName: 'Taj Hotel',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC2024004',
            receiptFile: 'hotel_conference.pdf',
            status: 'rejected',
            approverId: managerUser._id,
            rejectionReason: 'Hotel expense exceeds daily limit of ₹5000. Please book budget accommodation as per policy.',
            tags: ['accommodation', 'conference', 'tech-event'],
            notes: 'Rejected due to policy violation',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Conference accommodation submitted',
                    changedAt: dates.fiveDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Checking accommodation policy',
                    changedAt: dates.fourDaysAgo
                },
                {
                    status: 'rejected',
                    changedBy: managerUser._id,
                    comments: 'Rejected - exceeds accommodation limit',
                    changedAt: dates.threeDaysAgo
                }
            ]
        },
        {
            userId: employeeUser._id,
            expenseDate: dates.weekAgo,
            submissionDate: dates.sixDaysAgo,
            category: 'training',
            amount: 4200,
            currency: 'INR',
            description: 'AWS Certification training course',
            vendorName: 'Udemy',
            paymentMethod: 'online',
            receiptNumber: 'REC2024005',
            receiptFile: 'training_aws.pdf',
            status: 'reimbursed',
            approverId: managerUser._id,
            financeApproverId: financeUser._id,
            approvalDate: dates.fourDaysAgo,
            reimbursementDate: dates.yesterday,
            reimbursementMode: 'bank_transfer',
            tags: ['training', 'certification', 'aws', 'skill-development'],
            notes: 'Skill development for project requirements',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: employeeUser._id,
                    comments: 'Training course expense submitted',
                    changedAt: dates.sixDaysAgo
                },
                {
                    status: 'under_review',
                    changedBy: managerUser._id,
                    comments: 'Reviewing training relevance',
                    changedAt: dates.fiveDaysAgo
                },
                {
                    status: 'approved',
                    changedBy: managerUser._id,
                    comments: 'Approved - relevant skill development',
                    changedAt: dates.fourDaysAgo
                },
                {
                    status: 'reimbursed',
                    changedBy: financeUser._id,
                    comments: 'Bank transfer completed to employee account',
                    changedAt: dates.yesterday
                }
            ]
        }
    ];

    // SCENARIO 2: Sales Team Expenses (different department)
    const salesExpenses = [
        {
            userId: salesEmployee._id,
            expenseDate: dates.twoDaysAgo,
            submissionDate: dates.yesterday,
            category: 'entertainment',
            amount: 2800,
            currency: 'INR',
            description: 'Client dinner at fine dining restaurant',
            vendorName: 'Fine Dining Restaurant',
            paymentMethod: 'credit_card',
            receiptNumber: 'REC2024006',
            receiptFile: 'client_dinner.pdf',
            status: 'under_review',
            approverId: salesManager._id,
            tags: ['entertainment', 'client-meeting', 'sales', 'business-development'],
            notes: 'Entertainment for potential client acquisition',
            statusHistory: [
                {
                    status: 'submitted',
                    changedBy: salesEmployee._id,
                    comments: 'Client entertainment expense submitted',
                    changedAt: dates.yesterday
                },
                {
                    status: 'under_review',
                    changedBy: salesManager._id,
                    comments: 'Reviewing client entertainment policy',
                    changedAt: dates.today
                }
            ]
        },
        {
            userId: salesEmployee._id,
            expenseDate: dates.threeDaysAgo,
            submissionDate: dates.twoDaysAgo,
            category: 'travel',
            amount: 6200,
            currency: 'INR',
            description: 'Flight to Delhi for sales pitch',
            vendorName: 'Air India',
            paymentMethod: 'corporate_card',
            receiptNumber: 'REC2024007',
            receiptFile: 'flight_delhi.pdf',
            status: 'approved',
            approverId: salesManager._id,
            approvalDate: dates.yesterday,
            tags: ['travel', 'sales-pitch', 'client-visit', 'high-value'],
            notes: 'Travel for important sales presentation',
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
                    comments: 'Reviewing high-value travel request',
                    changedAt: dates.yesterday
                },
                {
                    status: 'approved',
                    changedBy: salesManager._id,
                    comments: 'Approved - important client meeting',
                    changedAt: dates.yesterday
                }
            ]
        }
    ];

    assignmentExpenses.push(...engineeringExpenses, ...salesExpenses);

    // Insert assignment test expenses
    try {
        await Expense.insertMany(assignmentExpenses);
        console.log(`✅ ${assignmentExpenses.length} assignment-specific expenses created`);
        
        // Print enhanced test credentials
        console.log('\n📋 ENHANCED TEST CREDENTIALS:');
        console.log('================================');
        console.log('\n👨‍💻 Engineering Team:');
        console.log('Employee: john.developer@datasturdy.com / employee123');
        console.log('Manager: engmanager@datasturdy.com / manager123');
        
        console.log('\n💼 Sales Team:');
        console.log('Employee: alex.sales@datasturdy.com / employee123');
        console.log('Manager: salesmanager@datasturdy.com / manager123');
        
        console.log('\n📈 Marketing Team:');
        console.log('Employee: olivia.marketing@datasturdy.com / employee123');
        console.log('Manager: marketingmanager@datasturdy.com / manager123');
        
        console.log('\n👥 HR Team:');
        console.log('Employee: sophia.hr@datasturdy.com / employee123');
        console.log('Manager: hrmanager@datasturdy.com / manager123');
        
        console.log('\n💰 Finance Team:');
        console.log('User: finance@datasturdy.com / finance123');
        console.log('User: accounts@datasturdy.com / finance123');
        
        console.log('\n👑 Admin Users:');
        console.log('Admin: admin@datasturdy.com / admin123');
        console.log('Super Admin: superadmin@datasturdy.com / admin123');
        
        console.log('\n📊 Department Breakdown:');
        console.log('- Engineering: 8 employees');
        console.log('- Sales: 6 employees');
        console.log('- Marketing: 5 employees');
        console.log('- HR: 4 employees');
        console.log('- Operations: 5 employees');
        console.log('- Product: 4 employees');
        console.log('- Finance: 3 employees');
        console.log('- Admin: 2 admins');
        
    } catch (error) {
        console.error('Error creating assignment test data:', error);
    }
};

// Enhanced main seeding function
const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('🚀 Starting enhanced database seeding...\n');
        
        // Clear existing data
        await clearDatabase();
        
        // Seed in order
        const departments = await seedDepartments();
        const categories = await seedCategories();
        const users = await seedUsers(departments);
        
        // Generate bulk expenses
        await seedExpenses(users, categories);
        
        // Create enhanced assignment-specific test data
        await seedAssignmentTestData(users);
        
        // Get final statistics
        console.log('\n✅ Enhanced database seeding completed successfully!');
        console.log('\n📊 FINAL DATABASE STATISTICS:');
        console.log('=============================');
        console.log(`   Departments: ${departments.length}`);
        console.log(`   Expense Categories: ${categories.length}`);
        console.log(`   Total Users: ${users.length}`);
        console.log(`   - Employees: ${users.filter(u => u.role === 'employee').length}`);
        console.log(`   - Managers: ${users.filter(u => u.role === 'manager').length}`);
        console.log(`   - Finance: ${users.filter(u => u.role === 'finance').length}`);
        console.log(`   - Admins: ${users.filter(u => u.role === 'admin').length}`);
        
        const expenseCount = await Expense.countDocuments();
        console.log(`   Total Expenses: ${expenseCount}`);
        
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
            { $group: { _id: "$user.department", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } }
        ]);
        
        console.log('\n🏢 Department-wise Expense Summary:');
        expenseByDept.forEach(dept => {
            console.log(`   - ${dept._id}: ${dept.count} expenses (₹${dept.totalAmount})`);
        });
        
        console.log('\n🎉 Enhanced Expense Management System is ready!');
        console.log('\n🔗 API Base URL: http://localhost:5000');
        console.log('📚 Test all user flows with different roles');
        console.log('\n⚠️  IMPORTANT: Use the test credentials above to test different scenarios');
        console.log('   • Employee → Manager approval flow');
        console.log('   • High-value → Finance approval flow');
        console.log('   • Team expense viewing (Manager dashboard)');
        console.log('   • Reimbursement processing (Finance dashboard)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during database seeding:', error);
        process.exit(1);
    }
};

// Run the enhanced seeding
