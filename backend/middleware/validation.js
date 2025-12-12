const { body, validationResult, param, query } = require('express-validator');

// Common validation rules
const expenseValidationRules = () => {
    return [
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Amount must be a positive number'),
        body('category')
            .isIn(['travel', 'food', 'accommodation', 'office_supplies', 'others'])
            .withMessage('Invalid category'),
        body('expenseDate')
            .isISO8601()
            .withMessage('Invalid date format'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters')
    ];
};

const loginValidationRules = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ];
};

const paginationValidationRules = () => {
    return [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ];
};

// Validation result handler
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));
    
    return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: extractedErrors
    });
};

module.exports = {
    expenseValidationRules,
    loginValidationRules,
    paginationValidationRules,
    validate
};