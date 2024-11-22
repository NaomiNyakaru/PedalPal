import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './payment.css';


const PaymentPage = () => {
  const [duration, setDuration] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hourlyRate, setHourlyRate] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_SERVER_URL;

  const rates = {
    standard: 20, // KSH 1 per hour
  };

  const calculateTotal = () => {
    return (rates[hourlyRate] * duration).toFixed(2);
  };

  const handleRateChange = (e) => {
    setHourlyRate(e.target.value);
  };

  const handleDurationChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setDuration(value);
  };

  const formatPhoneNumber = (number) => {
    // Remove any non-digit characters
    let cleaned = number.replace(/\D/g, '');
    
    // If number starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    }
    
    // If number starts with +, replace with empty string
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.slice(1);
    }
    
    // If number doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  const validatePhoneNumber = (number) => {
    const cleaned = formatPhoneNumber(number);
    const phoneRegex = /^254[17][0-9]{8}$/;
    return phoneRegex.test(cleaned);
  };

  const handlePayment = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Validate phone number
      if (!phoneNumber) {
        setError('Please enter a phone number');
        return;
      }

      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!validatePhoneNumber(formattedPhone)) {
        setError('Please enter a valid Safaricom phone number');
        return;
      }

      const amount = calculateTotal();
      
      if (amount <= 0) {
        setError('Amount must be greater than 0');
        return;
      }

      console.log('Sending payment request:', {
        amount,
        phone_number: formattedPhone,
        hours: duration,
        rate_type: hourlyRate
      });

      const response = await axios.post(`${serverURL}/initiate-payment`, {
        amount: parseInt(amount),
        phone_number: formattedPhone,
        hours: duration,
        rate_type: hourlyRate
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Payment response:', response.data);

      if (response.data.success || response.data.ResponseCode === "0") {
        alert('Please check your phone for the M-PESA payment prompt and enter your PIN');
        
        // Optional: Poll for payment status
        // startPollingPaymentStatus(response.data.CheckoutRequestID);
        
        // For now, we'll just navigate after alert
        setTimeout(() => {
          navigate('/payment-success');
        }, 3000);
      } else {
        setError(response.data.error || 'Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Choose Your Rate</h2>
      
      {error && <div className="error-message">{error}</div>}
      
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
          <span className="plan-price">KSH {rates.standard}/hour</span>
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

      <div className="phone-input-container">
        <label>
          M-PESA Phone Number:
          <input
            type="tel"
            className="phone-input"
            placeholder="e.g., 0712345678"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </label>
        <small>Enter your Safaricom number in format: 0712345678</small>
      </div>

      <button 
        className="pay-button" 
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Pay with M-PESA'}
      </button>
    </div>
  );
};

export default PaymentPage;