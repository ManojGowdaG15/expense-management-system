const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create test users (for development/demo)
// @route   POST /api/auth/create-test-users
// @access  Public
exports.createTestUsers = async (req, res) => {
    try {
        const users = [
            {
                name: 'Admin User',
                email: 'admin@company.com',
                password: 'admin123',
                role: 'admin',
                department: 'Administration'
            },
            {
                name: 'Finance Manager',
                email: 'finance@company.com',
                password: 'finance123',
                role: 'finance',
                department: 'Finance'
            },
            {
                name: 'Department Manager',
                email: 'manager@company.com',
                password: 'manager123',
                role: 'manager',
                department: 'Engineering'
            },
            {
                name: 'Regular Employee',
                email: 'employee@company.com',
                password: 'employee123',
                role: 'employee',
                department: 'Engineering',
                managerId: null // Will be set after manager creation
            },
            {
                name: 'Another Employee',
                email: 'employee2@company.com',
                password: 'employee123',
                role: 'employee',
                department: 'Sales',
                managerId: null
            }
        ];

        const createdUsers = [];
        
        for (let userData of users) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            
            if (!existingUser) {
                // Hash password
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashedPassword;
                
                const user = await User.create(userData);
                createdUsers.push({
                    email: user.email,
                    password: userData.password.replace(hashedPassword, userData.password.split('123')[0] + '123'),
                    role: user.role
                });
            }
        }

        // Set manager IDs for employees
        const manager = await User.findOne({ email: 'manager@company.com' });
        if (manager) {
            await User.updateMany(
                { department: 'Engineering', role: 'employee' },
                { managerId: manager._id }
            );
        }

        res.status(201).json({
            success: true,
            message: createdUsers.length > 0 ? 'Test users created successfully' : 'Users already exist',
            users: createdUsers
        });
    } catch (error) {
        console.error('Create test users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        // In a real application, you might want to blacklist the token
        // For now, we'll just send a success response
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        // Get user with password
        const user = await User.findById(req.user._id).select('+password');
        
        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};