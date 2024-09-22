import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; 
        return Date.now() >= exp; 
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            if (isTokenExpired(token)) {
                localStorage.removeItem('auth-token');
                navigate('/');
            } else {
                axios.get('http://localhost:5000/api/customer/profile', {
                    headers: { 'auth-token': token },
                })
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        localStorage.removeItem('auth-token');
                        navigate('/');
                    } else {
                        console.error('Failed to fetch profile:', error);
                    }
                });
            }
        }
    }, [navigate]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Profile;
