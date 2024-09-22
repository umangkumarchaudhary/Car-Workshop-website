import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './../../AuthContext';

const CHeader = ({ isAuthenticated }) => {
  const { logout } = useAuth();

  return (
    <ul>
      {isAuthenticated ? (
        <>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/thoughts">Thoughts</Link></li>
          <li><Link to="/bookingSystem">Booking System</Link></li>
          <li><button onClick={logout}>Logout</button></li>
        </>
      ) : (
        <li><Link to="/">Login</Link></li>
      )}
    </ul>
  );
};

export default CHeader;