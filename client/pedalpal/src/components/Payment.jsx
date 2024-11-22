import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './payment.css';

const PaymentPage = () => {
  const [duration, setDuration] = useState(1); // Default to 1 hour
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hourlyRate, setHourlyRate] = useState('standard'); // 'standard' or 'premium'
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_SERVER_URL;

  // Define hourly rates
  const rates = {
    standard: 1, // KSH 1 per hour
    premium: 2,  // KSH 2 per hour
  };

  const calculateTotal = () => {
    return (rates[hourlyRate] * duration).toFixed(2);
  };

  const handleRateChange = (e) => {
    setHourlyRate(e.target.value);
  };

  const handleDurationChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure minimum 1 hour
    setDuration(value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePayment = async () => {
    const amount = calculateTotal();
    try {
      const response = await axios.post(`${serverURL}/initiate-payment`, {
        amount,
        phone_number: phoneNumber,
        hours: duration,
        rate_type: hourlyRate
      });

      if (response.status === 200) {
        alert('Payment prompt sent to your phone. Please check and enter your PIN.');
        navigate('/signin');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('There was an issue with your payment. Please try again.');
    }
  };

  return (
    <div className="payment-page">
      <h2>Choose Your Rate</h2>
      <div className="plan-options">
        <label className="plan-option">
          <input
            type="radio"
            name="rate"
            value="standard"
            checked={hourlyRate === 'standard'}
            onChange={handleRateChange}
          />
          <span>Standard Rate</span>
          
          <span className="plan-price"> KSH {rates.standard}/hour</span>
        </label>
        
      </div>

      <div className="duration-input">
        <label>
          Duration (hours):
          <input
            type="number"
            min="1"
            value={duration}
            onChange={handleDurationChange}
            className="duration-field"
          />
        </label>
      </div>

      <div className="total-amount">
        Total Amount: KSH {calculateTotal()}
      </div>

      <input
        type="text"
        className="phone-input"
        placeholder="Enter phone number..."
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />

      <button className="pay-button" onClick={handlePayment}>
        PAY
      </button>
    </div>
  );
};

export default PaymentPage;
