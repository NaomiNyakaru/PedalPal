import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


// Creating dummy data for payment methods
const paymentMethods = [
  { id: 1, name: 'Visa', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-kIqA-9wBxUDDSp5W_P3xPIGxnTJJst3iMA&s' },
  { id: 2, name: 'MasterCard', image: 'https://media.wired.com/photos/5926dea77034dc5f91bece36/master/w_1600%2Cc_limit/Mastercard3-1.jpg' },
  { id: 3, name: 'PayPal', image: 'https://facts.net/wp-content/uploads/2023/09/15-facts-about-paypal-1694962132.jpg' },
  { id: 4, name: 'Google Pay', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjjSw-Gs99PAXujWKSCi-cLFFCpVM79SPGg&s' }
];

const PaymentOptions = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };
  const navigate = useNavigate();


 const notify = () => {
  toast.success(`Booking confirmed for ${duration} hours at ${location} using ${selectedMethod}.`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    onClose: () => navigate('/bikes'),
  });
}


  return (
    
    <div className="payment-options">
      
      <h2>Select Your Payment Method</h2>
      
      <div className="booking-details">
        <label>
          Duration (in hours):
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            placeholder="Enter duration"
          />
        </label>

        <label>
          Location:
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Enter location"
          />
        </label>
      </div>

      <div className="payment-grid">

        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-card ${selectedMethod === method.name ? 'selected' : ''}`}
            onClick={() => handleSelect(method.name)}
          >
            <img src={method.image} alt={method.name} className="payment-image" />
            <p>{method.name}</p>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="payment-summary">
          <h3>Enter Payment Details</h3>
         
          {selectedMethod !== 'PayPal' && selectedMethod !== 'Google Pay' && (
            <>
              <label>
                Card Number:
                <input 
                  type="text" 
                  name="cardNumber" 
                  value={cardDetails.cardNumber} 
                  onChange={handleInputChange} 
                  placeholder="1234 5678 9012 3456"
                />
              </label>

              <label>
                Expiration Date:
                <input 
                  type="text" 
                  name="expirationDate" 
                  value={cardDetails.expirationDate} 
                  onChange={handleInputChange} 
                  placeholder="MM/YY"
                />
              </label>

              <label>
                CVV:
                <input 
                  type="text" 
                  name="cvv" 
                  value={cardDetails.cvv} 
                  onChange={handleInputChange} 
                  placeholder="123"
                />
              </label>
            </>
          )}
          
          <button className="btn" onClick={() => notify()}>Proceed to Payment</button>
          <ToastContainer 
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
         
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
