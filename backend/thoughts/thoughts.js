const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define a Thought model
const ThoughtSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
}, { timestamps: true });

const Thought = mongoose.model('Thought', ThoughtSchema);

// POST route to add a new thought
router.post('/', async (req, res) => {
    try {
        const newThought = new Thought({
            userId: req.user.id, // Assuming you have user ID from middleware
            content: req.body.content,
        });
        const savedThought = await newThought.save();
        res.status(201).json(savedThought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET route to get all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find().populate('userId', 'name email');
        res.status(200).json(thoughts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT route to update a thought
router.put('/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        // Check if the user is the owner of the thought
        if (thought.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own thoughts' });
        }

        thought.content = req.body.content;
        const updatedThought = await thought.save();
        res.status(200).json(updatedThought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the router
module.exports = router;
