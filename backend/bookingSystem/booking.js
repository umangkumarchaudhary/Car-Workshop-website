const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware for user authentication (from your existing code)
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

// User Role Middleware (for Staff Authorization)
const authorizeStaff = (req, res, next) => {
    if (req.user.role !== 'staff') {
        return res.status(403).send('Access Denied. Staff only.');
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
});

const Booking = mongoose.model('Booking', bookingSchema);

// Create a new booking (Customer Route)
router.post('/book', [
    authenticateToken, // Ensure the user is authenticated
    body('carDetails').not().isEmpty().withMessage('Car details are required'),
    body('issues').not().isEmpty().withMessage('Car issues are required'),
    body('serviceDate').isDate().withMessage('Valid service date is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
        res.json({ message: 'Booking request created successfully', booking });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// View all bookings (Staff Route)
router.get('/bookings', authenticateToken, authorizeStaff, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('customer', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// View customer’s own bookings (Customer Route)
router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update booking status (Accept/Reject - Staff Route)
router.put('/booking/:id/status', authenticateToken, authorizeStaff, async (req, res) => {
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be "Accepted" or "Rejected".' });
    }

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: `Booking ${status.toLowerCase()} successfully`, booking });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

// In the main server file (e.g., app.js), include the routes
// const bookingRoutes = require('./bookingSystem');
// app.use('/api', bookingRoutes);

