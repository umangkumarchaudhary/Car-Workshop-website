import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Import the Header component
import Home from './pages/Home'; // Import the Home page
import Profile from './pages/Profile'; // Import the Profile page
import Authentication from './pages/Authentication'; // Assuming this handles login/signup
import Thoughts from './pages/Thoughts';
import BookingSystem from './pages/BookingSystem';

const App = () => {
    return (
        <Router>
            <Header /> {/* Header stays common on all pages */}
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Authentication />} /> {/* Default route */}
                <Route path="/thoughts" element={<Thoughts />} />
                <Route path="/bookingsystem" element={<BookingSystem />} />
            </Routes>
        </Router>
    );
};

export default App;
