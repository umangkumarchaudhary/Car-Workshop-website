const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Model for user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ['customer', 'staff'],
        default: 'customer', // Default role is customer
    },
});

const User = mongoose.model('User', userSchema);

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Middleware to check for customer role
const isCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ msg: 'Access restricted to customers only' });
    }
    next();
};

// Middleware to check for staff role
const isStaff = (req, res, next) => {
    if (req.user.role !== 'staff') {
        return res.status(403).json({ msg: 'Access restricted to staff only' });
    }
    next();
};

// Register a user
router.post('/signup', [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            phone,
            role: role || 'customer', // Assign role if provided
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).json({ token, role: user.role }); // Include role in the response
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).json({ token, role: user.role }); // Include role in the response
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get user's profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Customer-only route example
router.get('/customer/dashboard', authenticateToken, isCustomer, async (req, res) => {
    res.json({ msg: 'Welcome to the customer dashboard' });
});

// Staff-only route example
router.get('/staff/dashboard', authenticateToken, isStaff, async (req, res) => {
    res.json({ msg: 'Welcome to the staff dashboard' });
});

module.exports = router;
