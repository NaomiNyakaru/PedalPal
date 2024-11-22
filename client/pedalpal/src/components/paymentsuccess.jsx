import React from 'react';
import { useNavigate } from 'react-router-dom';
import './paymentsuccess.css'

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success-page">
      <h1>Payment Successful!</h1>
      
      <p>Thank you for your payment! Your transaction has been successfully completed.</p>


      <p>Now, you're ready to pick a bike for your adventure. Here’s what you need to do:</p>
      
      <div className="bike-picking-instructions">
        <h3>Steps to Pick Your Bike:</h3>
        <ol>
          <li>Visit our location at Giraffe Park lane, Nairobi</li>
          <li>Provide your details to the attendant.</li>
          <li>Confirm the bike!</li>
          <li>Provide an ID to be returned when the bike is returned.</li>
         
        </ol>
      </div>

      <h2>Enjoy your ride! And remember to book with us again</h2>

      <h1>Thank you for choosing us</h1>

      <button className="btn" onClick={() => navigate('/bikes')}>Pick Another Bike</button>
      <button className="btn" onClick={() => navigate('/')}> Home</button>
    </div>
  );
};

export default PaymentSuccess;
