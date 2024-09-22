import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/login');
    };

    return (
        <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/thoughts">Thoughts</Link></li>
            <li><Link to="/bookingSystem">Booking System</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
    );
};

export default CHeader;
