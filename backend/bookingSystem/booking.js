const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware for user authentication (same as before)
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

// Middleware for role-based authorization
const authorizeStaff = (req, res, next) => {
    if (req.user.role !== 'staff') {
        return res.status(403).json({ success: false, message: 'Access Denied. Staff only.' });
    }
    next();
};

// Booking Schema
const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carDetails: {
        type: String,
        required: true
    },
    issues: {
        type: String,
        required: true
    },
    serviceDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    repairSteps: [
        {
            step: String,
            completed: Boolean,
            timestamp: Date
        }
    ],
    repairCost: {
        type: Number,
        default: 0
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Customer: Create a new booking
router.post('/book', [
    authenticateToken,
    body('carDetails').not().isEmpty().withMessage('Car details are required'),
    body('issues').not().isEmpty().withMessage('Car issues are required'),
    body('serviceDate').isDate().withMessage('Valid service date is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { carDetails, issues, serviceDate } = req.body;

    try {
        const booking = new Booking({
            customer: req.user.id,
            carDetails,
            issues,
            serviceDate
        });
        await booking.save();
        res.status(201).json({ success: true, message: 'Booking request created successfully', booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Staff: View all bookings
router.get('/bookings', authenticateToken, authorizeStaff, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('customer', 'name email');
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Customer: View own bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id });
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Staff: Update booking status (Accept/Reject)
router.put('/booking/:id/status', authenticateToken, authorizeStaff, async (req, res) => {
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status. Must be "Accepted" or "Rejected".' });
    }

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: `Booking ${status.toLowerCase()} successfully`, booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

// In the main server file (app.js), include the routes
// const bookingRoutes = require('./bookingSystem');
// app.use('/api', bookingRoutes);
