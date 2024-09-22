import React, { useState } from 'react';
import axios from 'axios';

const StaffLoginAndSignUp = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');

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
            const url = isLogin ? '/api/staff/login' : '/api/staff/signup';
            const response = await axios.post(url, formData);
            setMessage(`Success: ${response.data.msg || 'Logged in!'}`);
            localStorage.setItem('token', response.data.token); // Save token in local storage
        } catch (error) {
            setMessage(`Error: ${error.response.data.msg || 'Something went wrong'}`);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Staff Login' : 'Staff Signup'}</h2>
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

export default StaffLoginAndSignUp;
