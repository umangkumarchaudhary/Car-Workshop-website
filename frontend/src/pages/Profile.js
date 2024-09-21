import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            axios.get('http://localhost:5000/api/auth/profile', {
                headers: { 'auth-token': token },
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch profile:', error);
            });
        }
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
        </div>
    );
};

export default Profile;
