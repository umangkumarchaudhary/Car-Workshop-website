import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingSystem = () => {
  const [carDetails, setCarDetails] = useState('');
  const [issues, setIssues] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async () => {
    const authToken = localStorage.getItem('auth-token'); // Get token directly from localStorage
    if (authToken) {
      try {
        const response = await axios.get('http://localhost:5000/api/my-bookings', {
          headers: {
            'auth-token': authToken,
          },
        });
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings', err);
      }
    }
  };

  useEffect(() => {
    fetchBookings(); // Fetch bookings when the component mounts
  }, []); // No dependency needed here since we're calling fetchBookings directly

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const authToken = localStorage.getItem('auth-token'); // Get token directly from localStorage
    try {
      await axios.post(
        'http://localhost:5000/api/book',
        {
          carDetails,
          issues,
          serviceDate,
        },
        {
          headers: {
            'auth-token': authToken,
          },
        }
      );
      setMessage('Booking request created successfully');
      setCarDetails('');
      setIssues('');
      setServiceDate('');
      fetchBookings(); // Refresh bookings after new booking is added
    } catch (err) {
      console.error('Error creating booking', err);
      setMessage('Failed to create booking');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Booking System</h1>
      {!localStorage.getItem('auth-token') ? (
        <p>Please log in to create and view bookings.</p>
      ) : (
        <>
          <div>
            <h2>Create a New Booking</h2>
            <form onSubmit={handleBookingSubmit}>
              <div>
                <label>Car Details:</label>
                <input
                  type="text"
                  value={carDetails}
                  onChange={(e) => setCarDetails(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Issues:</label>
                <textarea
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label>Service Date:</label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Booking...' : 'Submit Booking'}
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>

          <div>
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <ul>
                {bookings.map((booking) => (
                  <li key={booking._id}>
                    <strong>Car:</strong> {booking.carDetails} <br />
                    <strong>Issues:</strong> {booking.issues} <br />
                    <strong>Service Date:</strong> {new Date(booking.serviceDate).toLocaleDateString()} <br />
                    <strong>Status:</strong> {booking.status} <br />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingSystem;
