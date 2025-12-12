const Expense = require('../models/Expense');
const User = require('../models/User');
const ExpenseCategory = require('../models/ExpenseCategory');
const path = require('path');
const fs = require('fs');

// @desc    Create new expense claim (with file upload)
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
    try {
        const {
            projectCode,
            expenseDate,
            category,
            subCategory,
            amount,
            currency,
            description,
            vendorName,
            paymentMethod,
            receiptNumber,
            taxAmount,
            isBillable,
            clientName,
            tags,
            notes
        } = req.body;

        // Validate required fields
        if (!expenseDate || !category || !amount || !description) {
            return res.status(400).json({
                success: false,
                message: 'Expense date, category, amount, and description are required'
            });
        }

        // Check category exists and is active
        const categoryExists = await ExpenseCategory.findOne({ 
            name: category.charAt(0).toUpperCase() + category.slice(1)
        });
        
        if (!categoryExists || !categoryExists.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or inactive expense category'
            });
        }

        // Check if receipt is required but not provided
        if (categoryExists.requiresReceipt && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Receipt is required for this category'
            });
        }

        // Create expense object
        const expenseData = {
            userId: req.user._id,
            projectCode: projectCode || '',
            expenseDate: new Date(expenseDate),
            category,
            subCategory: subCategory || '',
            amount: parseFloat(amount),
            currency: currency || 'USD',
            description,
            vendorName: vendorName || '',
            paymentMethod: paymentMethod || 'credit_card',
            receiptNumber: receiptNumber || '',
            taxAmount: taxAmount ? parseFloat(taxAmount) : 0,
            isBillable: isBillable === 'true' || isBillable === true,
            clientName: clientName || '',
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
            notes: notes || '',
            status: 'submitted'
        };

        // Handle file upload if exists
        if (req.file) {
            expenseData.receiptFile = req.file.filename;
            expenseData.receiptUrl = `/uploads/${req.user._id}/${req.file.filename}`;
            
            expenseData.attachments = [{
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype
            }];
        }

        // Check for approver based on amount or category
        if (parseFloat(amount) > 1000 || categoryExists.requiresApproval) {
            expenseData.status = 'under_review';
            
            // Find appropriate approver
            if (req.user.managerId) {
                expenseData.approverId = req.user.managerId;
            } else {
                // Find department manager
                const deptManager = await User.findOne({
                    department: req.user.department,
                    role: 'manager'
                });
                if (deptManager) {
                    expenseData.approverId = deptManager._id;
                }
            }
        }

        // Create expense
        const expense = await Expense.create(expenseData);

        // Add initial status history
        expense.statusHistory.push({
            status: expense.status,
            changedBy: req.user._id,
            comments: 'Expense submitted'
        });
        
        await expense.save();

        res.status(201).json({
            success: true,
            message: 'Expense claim submitted successfully',
            data: expense
        });
    } catch (error) {
        console.error('Create expense error:', error);
        
        // Clean up uploaded file if error occurs
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all expenses for logged in user with filters
// @route   GET /api/expenses
// @access  Private
exports.getUserExpenses = async (req, res) => {
    try {
        const {
            status,
            category,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            page = 1,
            limit = 10,
            sortBy = 'submissionDate',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { userId: req.user._id };
        
        if (status) {
            const statuses = status.split(',');
            filter.status = { $in: statuses };
        }
        
        if (category) {
            const categories = category.split(',');
            filter.category = { $in: categories };
        }
        
        if (startDate || endDate) {
            filter.expenseDate = {};
            if (startDate) filter.expenseDate.$gte = new Date(startDate);
            if (endDate) filter.expenseDate.$lte = new Date(endDate);
        }
        
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Sort configuration
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const expenses = await Expense.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('approverId', 'name email')
            .populate('financeApproverId', 'name email');

        const total = await Expense.countDocuments(filter);

        // Calculate summary statistics
        const summary = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalCount: { $sum: 1 },
                    avgAmount: { $avg: '$amount' },
                    minAmount: { $min: '$amount' },
                    maxAmount: { $max: '$amount' }
                }
            }
        ]);

        // Status distribution
        const statusDistribution = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        // Category distribution
        const categoryDistribution = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: expenses.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            data: expenses,
            summary: summary[0] || {
                totalAmount: 0,
                totalCount: 0,
                avgAmount: 0,
                minAmount: 0,
                maxAmount: 0
            },
            distributions: {
                status: statusDistribution,
                category: categoryDistribution
            }
        });
    } catch (error) {
        console.error('Get user expenses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
            .populate('userId', 'name email employeeId department')
            .populate('approverId', 'name email')
            .populate('financeApproverId', 'name email');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        const canView = expense.userId._id.toString() === req.user._id.toString() ||
                       req.user.role === 'admin' ||
                       req.user.role === 'finance' ||
                       (req.user.role === 'manager' && expense.userId.managerId?.toString() === req.user._id.toString());

        if (!canView) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this expense'
            });
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Get expense by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization - only owner can update pending expenses
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this expense'
            });
        }

        // Only allow updates for draft or submitted expenses
        if (!['draft', 'submitted'].includes(expense.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update expense in current status'
            });
        }

        // Update fields
        const updatableFields = [
            'projectCode', 'expenseDate', 'category', 'subCategory',
            'amount', 'currency', 'description', 'vendorName',
            'paymentMethod', 'receiptNumber', 'taxAmount',
            'isBillable', 'clientName', 'tags', 'notes'
        ];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                expense[field] = req.body[field];
            }
        });

        // Handle file upload if exists
        if (req.file) {
            // Delete old file if exists
            if (expense.receiptFile) {
                const oldFilePath = path.join(process.env.UPLOAD_PATH, req.user._id.toString(), expense.receiptFile);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            expense.receiptFile = req.file.filename;
            expense.receiptUrl = `/uploads/${req.user._id}/${req.file.filename}`;
            
            if (!expense.attachments) expense.attachments = [];
            expense.attachments.push({
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype
            });
        }

        await expense.save();

        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: expense
        });
    } catch (error) {
        console.error('Update expense error:', error);
        
        // Clean up uploaded file if error occurs
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization - only owner can delete draft expenses
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this expense'
            });
        }

        // Only allow deletion of draft expenses
        if (expense.status !== 'draft') {
            return res.status(400).json({
                success: false,
                message: 'Can only delete draft expenses'
            });
        }

        // Delete associated files
        if (expense.receiptFile) {
            const filePath = path.join(process.env.UPLOAD_PATH, req.user._id.toString(), expense.receiptFile);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Submit expense for approval
// @route   POST /api/expenses/:id/submit
// @access  Private
exports.submitExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        if (expense.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to submit this expense'
            });
        }

        // Only draft expenses can be submitted
        if (expense.status !== 'draft') {
            return res.status(400).json({
                success: false,
                message: 'Only draft expenses can be submitted'
            });
        }

        // Validate required fields
        if (!expense.receiptFile && expense.category !== 'others') {
            return res.status(400).json({
                success: false,
                message: 'Receipt is required for submission'
            });
        }

        // Update status
        expense.status = 'submitted';
        
        // Check if approval is needed
        const category = await ExpenseCategory.findOne({ 
            name: expense.category.charAt(0).toUpperCase() + expense.category.slice(1)
        });
        
        if (expense.amount > 1000 || (category && category.requiresApproval)) {
            expense.status = 'under_review';
            
            // Assign approver
            if (req.user.managerId) {
                expense.approverId = req.user.managerId;
            } else {
                // Find department manager
                const deptManager = await User.findOne({
                    department: req.user.department,
                    role: 'manager'
                });
                if (deptManager) {
                    expense.approverId = deptManager._id;
                }
            }
        }

        expense.statusHistory.push({
            status: expense.status,
            changedBy: req.user._id,
            comments: 'Expense submitted for approval'
        });

        await expense.save();

        res.status(200).json({
            success: true,
            message: 'Expense submitted successfully',
            data: expense
        });
    } catch (error) {
        console.error('Submit expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get pending expenses for manager/finance
// @route   GET /api/expenses/pending
// @access  Private (Manager/Finance/Admin)
exports.getPendingExpenses = async (req, res) => {
    try {
        let filter = { status: 'under_review' };

        // If user is manager, only show expenses from their team
        if (req.user.role === 'manager') {
            // Get all employees under this manager
            const teamMembers = await User.find({ 
                managerId: req.user._id 
            }).select('_id');
            
            const teamMemberIds = teamMembers.map(member => member._id);
            filter.userId = { $in: teamMemberIds };
            filter.approverId = req.user._id;
        }
        // If user is finance, show all pending finance approval
        else if (req.user.role === 'finance') {
            filter.status = { $in: ['approved', 'under_review'] };
        }

        const {
            page = 1,
            limit = 10,
            sortBy = 'submissionDate',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const expenses = await Expense.find(filter)
            .populate('userId', 'name email employeeId department')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Expense.countDocuments(filter);

        // Calculate summary
        const summary = await Expense.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalCount: { $sum: 1 },
                    byCategory: {
                        $push: {
                            category: '$category',
                            amount: '$amount'
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: expenses.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            data: expenses,
            summary: summary[0] || {
                totalAmount: 0,
                totalCount: 0,
                byCategory: []
            }
        });
    } catch (error) {
        console.error('Get pending expenses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Approve expense
// @route   PUT /api/expenses/:id/approve
// @access  Private (Manager/Finance/Admin)
exports.approveExpense = async (req, res) => {
    try {
        const { comments } = req.body;
        const expense = await Expense.findById(req.params.id)
            .populate('userId', 'managerId department');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization based on role
        let canApprove = false;
        
        if (req.user.role === 'admin') {
            canApprove = true;
        } 
        else if (req.user.role === 'manager') {
            // Manager can approve if they are the assigned approver
            canApprove = expense.approverId?.toString() === req.user._id.toString() ||
                        expense.userId.managerId?.toString() === req.user._id.toString();
        }
        else if (req.user.role === 'finance') {
            // Finance can approve any approved expense for reimbursement
            canApprove = expense.status === 'approved';
        }

        if (!canApprove) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to approve this expense'
            });
        }

        // Update status based on role
        if (req.user.role === 'finance') {
            expense.status = 'reimbursed';
            expense.financeApproverId = req.user._id;
            expense.reimbursementDate = new Date();
            expense.reimbursementMode = req.body.reimbursementMode || 'bank_transfer';
        } else {
            expense.status = 'approved';
            expense.approverId = req.user._id;
            expense.approvalDate = new Date();
        }

        expense.statusHistory.push({
            status: expense.status,
            changedBy: req.user._id,
            comments: comments || 'Approved'
        });

        await expense.save();

        res.status(200).json({
            success: true,
            message: `Expense ${req.user.role === 'finance' ? 'reimbursed' : 'approved'} successfully`,
            data: expense
        });
    } catch (error) {
        console.error('Approve expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Reject expense
// @route   PUT /api/expenses/:id/reject
// @access  Private (Manager/Finance/Admin)
exports.rejectExpense = async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const expense = await Expense.findById(req.params.id)
            .populate('userId', 'managerId department');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        let canReject = false;
        
        if (req.user.role === 'admin') {
            canReject = true;
        } 
        else if (req.user.role === 'manager') {
            canReject = expense.approverId?.toString() === req.user._id.toString() ||
                        expense.userId.managerId?.toString() === req.user._id.toString();
        }
        else if (req.user.role === 'finance') {
            canReject = expense.status === 'approved' || expense.status === 'under_review';
        }

        if (!canReject) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this expense'
            });
        }

        // Update expense
        expense.status = 'rejected';
        expense.rejectionReason = reason;
        
        if (req.user.role === 'finance') {
            expense.financeApproverId = req.user._id;
        } else {
            expense.approverId = req.user._id;
        }

        expense.statusHistory.push({
            status: 'rejected',
            changedBy: req.user._id,
            comments: reason
        });

        await expense.save();

        res.status(200).json({
            success: true,
            message: 'Expense rejected successfully',
            data: expense
        });
    } catch (error) {
        console.error('Reject expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Download receipt file
// @route   GET /api/expenses/:id/receipt
// @access  Private
exports.downloadReceipt = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        const canView = expense.userId.toString() === req.user._id.toString() ||
                       req.user.role === 'admin' ||
                       req.user.role === 'finance' ||
                       (req.user.role === 'manager' && 
                        expense.userId.toString() === req.user.managedTeam?.includes(expense.userId.toString()));

        if (!canView) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this receipt'
            });
        }

        if (!expense.receiptFile) {
            return res.status(404).json({
                success: false,
                message: 'Receipt file not found'
            });
        }

        const filePath = path.join(
            process.env.UPLOAD_PATH,
            expense.userId.toString(),
            expense.receiptFile
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Receipt file not found on server'
            });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Download receipt error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};