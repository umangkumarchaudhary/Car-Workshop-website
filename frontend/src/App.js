import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';

import Home from './pages/Home'; // Import the Home page
import Profile from './pages/Profile'; // Import the Profile page
import CustomerLoginAndSignUp from './components/customer/CustomerLoginAndSignUp';
import StaffLoginAndSignUp from './components/staff/StaffLoginAndSignUp';
import Thoughts from './pages/Thoughts';
import BookingSystem from './pages/BookingSystem';
import StaffDashboard from './components/staff/StaffDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CHeader from './components/customer/CHeader';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <CHeader isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<CustomerLoginAndSignUp />} />
        <Route path="/staff" element={<StaffLoginAndSignUp />} />
        <Route path="/thoughts" element={<Thoughts />} />
        <Route path="/bookingsystem" element={<BookingSystem />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;