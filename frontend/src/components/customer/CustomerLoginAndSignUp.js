import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../AuthContext';
import './CustomerLoginAndSignUp.css';

const CustomerLoginAndSignUp = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setMessage('');
        setFormData({ name: '', email: '', password: '', phone: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isLogin 
                ? 'http://localhost:5000/api/customer/login' 
                : 'http://localhost:5000/api/customer/signup';

            const response = await axios.post(url, formData);
            setMessage(`Success: ${response.data.msg || 'Logged in!'}`);
            login(response.data.token);

            if (isLogin) {
                navigate('/customer-dashboard');
            } else {
                setTimeout(() => {
                    navigate('/customer/login');
                }, 2000);
            }
        } catch (error) {
            setMessage(`Error: ${error.response.data.msg || 'Something went wrong'}`);
        }
    };

    return (
        <div className="container">
            <h2>{isLogin ? 'Customer Login' : 'Customer Signup'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {!isLogin && (
                    <div>
                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <p>{message}</p>
            <button onClick={handleToggle}>
                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default CustomerLoginAndSignUp;
