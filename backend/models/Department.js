const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
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
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    budget: {
        type: Number,
        default: 0
    },
    monthlyLimit: {
        type: Number,
        default: 0
    },
    expenseCategories: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
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

// Generate department code
departmentSchema.pre('save', function(next) {
    if (!this.code) {
        const words = this.name.split(' ');
        this.code = words.map(word => word[0]).join('').toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Department', departmentSchema);