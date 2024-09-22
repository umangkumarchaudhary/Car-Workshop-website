import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer', // Default role
    });
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [user, setUser] = useState(null); // Store logged-in user data
    const [token, setToken] = useState(localStorage.getItem('auth-token')); // Store token
    const navigate = useNavigate();

    // Handle input change
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login/signup form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, phone, role } = formData;
        try {
            if (isLogin) {
                // Login request
                const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                localStorage.setItem('auth-token', res.data.token); // Store token in localStorage
                setToken(res.data.token);
                handleRoleBasedRedirect(res.data.role); // Handle redirect based on role
            } else {
                // Signup request
                const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password, phone, role });
                localStorage.setItem('auth-token', res.data.token); // Store token in localStorage
                setToken(res.data.token);
                handleRoleBasedRedirect(res.data.role); // Handle redirect based on role
            }
        } catch (err) {
            console.error(err);
            alert('Error occurred during authentication.');
        }
    };

    // Handle role-based redirection
    const handleRoleBasedRedirect = (role) => {
        if (role === 'customer') {
            navigate('/customer-dashboard'); // Redirect to customer dashboard
        } else if (role === 'staff') {
            navigate('/staff-dashboard'); // Redirect to staff dashboard
        } else {
            alert('Unknown role. Please contact support.');
        }
    };

    // Fetch profile data for logged-in user
    const fetchProfile = async () => {
        try {
            const storedToken = localStorage.getItem('auth-token'); // Get the token from localStorage
            if (!storedToken) {
                throw new Error('No token found, please login again.');
            }

            const res = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: {
                    'auth-token': storedToken, // Ensure token is sent in the header
                },
            });
            setUser(res.data); // Store user data if successful
        } catch (err) {
            console.error(err);
            alert('Failed to fetch profile data. Please login again.');
        }
    };

    // Redirect to login or profile based on the presence of a token
    useEffect(() => {
        if (token) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="auth-container">
            {user ? (
                // Profile Page
                <div className="profile">
                    <h2>Welcome, {user.name}</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('auth-token');
                            setToken(null);
                            setUser(null);
                            navigate('/'); // Redirect to home after logout
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                // Authentication Form (Login or Signup)
                <div className="auth-form">
                    <h2>{isLogin ? 'Login' : 'Signup'}</h2>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="role">Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={onChange}
                                        required
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                    </form>
                    <p onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Don’t have an account? Sign up' : 'Already have an account? Login'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Authentication;
