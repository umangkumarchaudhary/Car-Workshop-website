import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: {
            'auth-token': authToken,
          },
        });
        setBookings(response.data.bookings); // Access the bookings array within the response object
      } catch (err) {
        console.error('Error fetching bookings', err);
      }
    }
  };
  
  

  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to update booking status
  const handleUpdateStatus = async (id, status) => {
    const authToken = localStorage.getItem('auth-token');
    try {
      await axios.put(
        `http://localhost:5000/api/booking/${id}/status`,
        { status: status.charAt(0).toUpperCase() + status.slice(1) }, // Update status to 'Accepted' or 'Rejected'
        {
          headers: {
            'auth-token': authToken,
          },
        }
      );
      setMessage(`Booking ${status} successfully`);
      fetchBookings(); // Refresh bookings after update
    } catch (err) {
      console.error('Error updating booking status', err);
      setMessage('Failed to update booking status');
    }
  };
  
  return (
    <div>
      <h1>Staff Dashboard</h1>
      {message && <p>{message}</p>}
      {bookings.length === 0 ? (
        <p>No bookings available</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <strong>Car:</strong> {booking.carDetails} <br />
              <strong>Issues:</strong> {booking.issues} <br />
              <strong>Service Date:</strong> {new Date(booking.serviceDate).toLocaleDateString()} <br />
              <strong>Status:</strong> {booking.status} <br />
              <button onClick={() => handleUpdateStatus(booking._id, 'accepted')}>
                Accept
              </button>
              <button onClick={() => handleUpdateStatus(booking._id, 'rejected')}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffDashboard;
