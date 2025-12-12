const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expenseId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectCode: {
        type: String,
        default: ''
    },
    expenseDate: {
        type: Date,
        required: [true, 'Expense date is required']
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['travel', 'food', 'accommodation', 'office_supplies', 'others'],
        required: [true, 'Category is required']
    },
    subCategory: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true
    },
    convertedAmount: {
        type: Number
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    vendorName: {
        type: String,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'online', 'corporate_card'],
        default: 'credit_card'
    },
    receiptNumber: {
        type: String
    },
    receiptFile: {
        type: String,
        default: ''
    },
    receiptUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed', 'paid'],
        default: 'draft'
    },
    statusHistory: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: String,
        changedAt: {
            type: Date,
            default: Date.now
        }
    }],
    approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    financeApproverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    reimbursementDate: {
        type: Date
    },
    reimbursementMode: {
        type: String,
        enum: ['bank_transfer', 'cheque', 'cash', 'wallet'],
        default: 'bank_transfer'
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number
    },
    isBillable: {
        type: Boolean,
        default: false
    },
    clientName: {
        type: String,
        default: ''
    },
    attachments: [{
        filename: String,
        originalname: String,
        path: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String
    }],
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate expense ID before saving
expenseSchema.pre('save', async function(next) {
    if (this.isNew) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Expense').countDocuments({
            createdAt: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        });
        this.expenseId = `EXP${year}${String(count + 1).padStart(5, '0')}`;
    }
    
    // Calculate total amount
    if (this.amount && this.taxAmount) {
        this.totalAmount = this.amount + this.taxAmount;
    } else {
        this.totalAmount = this.amount;
    }
    
    next();
});

// Add to status history on status change
expenseSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        if (!this.statusHistory) {
            this.statusHistory = [];
        }
        this.statusHistory.push({
            status: this.status,
            changedBy: this.modifiedPaths().includes('approverId') ? this.approverId : this.userId,
            comments: this.status === 'rejected' ? this.rejectionReason : 'Status updated'
        });
    }
    this.updatedAt = Date.now();
    next();
});

// Indexes for better performance
expenseSchema.index({ userId: 1, status: 1 });
expenseSchema.index({ expenseDate: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);