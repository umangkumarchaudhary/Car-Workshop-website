import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Thoughts = () => {
    const [thoughts, setThoughts] = useState([]);
    const [newThought, setNewThought] = useState('');
    const [editThoughtId, setEditThoughtId] = useState(null);
    const [editThoughtContent, setEditThoughtContent] = useState('');

    useEffect(() => {
        fetchThoughts();
    }, []);

    // Fetch all thoughts
    const fetchThoughts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/thoughts', {
                headers: { 'auth-token': localStorage.getItem('auth-token') },
            });
            setThoughts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Handle adding a new thought
    const handleAddThought = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/thoughts', { content: newThought }, {
                headers: { 'auth-token': localStorage.getItem('auth-token') },
            });
            setNewThought('');
            fetchThoughts(); // Refresh thoughts after adding
        } catch (error) {
            console.error(error);
        }
    };

    // Handle updating a thought
    const handleUpdateThought = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/thoughts/${editThoughtId}`, { content: editThoughtContent }, {
                headers: { 'auth-token': localStorage.getItem('auth-token') },
            });
            setEditThoughtId(null);
            setEditThoughtContent('');
            fetchThoughts(); // Refresh thoughts after updating
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Thoughts</h2>
            <form onSubmit={handleAddThought}>
                <input
                    type="text"
                    value={newThought}
                    onChange={(e) => setNewThought(e.target.value)}
                    placeholder="Add a new thought"
                    required
                />
                <button type="submit">Add Thought</button>
            </form>

            {thoughts.map((thought) => (
                <div key={thought._id} style={{ margin: '10px 0' }}>
                    <p><strong>{thought.userId.name}:</strong> {thought.content}</p>
                    {thought.userId._id === JSON.parse(localStorage.getItem('auth-user')).id && ( // Check if it's the user's thought
                        <>
                            <button onClick={() => {
                                setEditThoughtId(thought._id);
                                setEditThoughtContent(thought.content);
                            }}>
                                Edit
                            </button>
                            {editThoughtId === thought._id && (
                                <form onSubmit={handleUpdateThought}>
                                    <input
                                        type="text"
                                        value={editThoughtContent}
                                        onChange={(e) => setEditThoughtContent(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Update</button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Thoughts;
