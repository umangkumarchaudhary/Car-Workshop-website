const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Staff Model
const staffSchema = new mongoose.Schema({
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
        enum: ['staff'],
        default: 'staff',
    },
});

const Staff = mongoose.model('Staff', staffSchema);

// Staff Authentication Middleware
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

// Middleware to check for staff role
const isStaff = (req, res, next) => {
    if (req.user.role !== 'staff') {
        return res.status(403).json({ msg: 'Access restricted to staff only' });
    }
    next();
};

// Register staff
router.post('/signup', [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    try {
        let user = await Staff.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new Staff({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            phone,
            role: 'staff',
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).json({ token, role: user.role });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Staff login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Staff.findOne({ email });
        if (!user || user.role !== 'staff') {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).json({ token, role: user.role });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Staff dashboard
router.get('/dashboard', authenticateToken, isStaff, (req, res) => {
    res.json({ msg: 'Welcome to the staff dashboard' });
});

module.exports = router;
