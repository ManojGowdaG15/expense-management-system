const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        uppercase: true
    },
    description: {
        type: String,
        default: ''
    },
    limit: {
        type: Number,
        default: 0
    },
    requiresApproval: {
        type: Boolean,
        default: true
    },
    requiresReceipt: {
        type: Boolean,
        default: true
    },
    allowedPaymentMethods: [{
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'online', 'corporate_card']
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    departmentSpecific: {
        type: Boolean,
        default: false
    },
    allowedDepartments: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

// Generate category code before saving
expenseCategorySchema.pre('save', function(next) {
    if (!this.code) {
        this.code = this.name.toUpperCase().replace(/\s+/g, '_');
    }
    next();
});

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);