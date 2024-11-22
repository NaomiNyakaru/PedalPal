import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Home from "./components/Home";
import NavBar from './components/NavBar';
import BikesPage from './components/BikesPage';
import PaymentOptions from './components/Payment';
import SignIn from './components/SignIn';
import Signup from './components/SignUp';
import BikeDetails from './components/BikeDetails';
import Admin from './components/Admin';

// Import ToastContainer from react-toastify
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS
import OrganizerPage from './components/events';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', false);
  };

  return (
    <Router>
      <AuthProvider>
        <div className='App'>
          <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <Routes>
            <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
            <Route path="/" element={<Home />} />
            <Route path="/bikes" element={<BikesPage />} />
            <Route path="/payments" element={<PaymentOptions />} />
            <Route path="/bike/:id" element={<BikeDetails />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/admin-dashboard" element={<Admin />} />
            <Route path="/events" element={<OrganizerPage/>}/>
          </Routes>
        </div>
        {/* Add ToastContainer here to render toasts */}
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

function handleSignup(newUser) {
  console.log('New user:', newUser);
}

export default App;
