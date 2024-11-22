import React, { useState, useContext } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signin_up.css';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';  // Import toast

// Import styles for react-toastify
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_SERVER_URL;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${serverURL}/login`, values);
        const userData = res.data;
    
        // Check if the returned user is an admin based on the backend response
        if (userData.is_admin) {
          console.log('Admin login successful:', userData);
          toast.success('Admin login successful!');  // Success toast
          navigate('/admin-dashboard');
        } else {
          console.log('User login successful:', userData);
          login();  // Assuming login function updates the AuthContext
          toast.success('User login successful!');  // Success toast
          navigate('/bikes');
        }
      } catch (error) {
        console.error('Login failed:', error.response || error.message);
        setErrorMessage(error.response?.data?.message || 'Login failed! Please try again.');
        toast.error('Login failed! Please try again.');  // Error toast
      }
    }
  });

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Welcome back!</h2>
      <form onSubmit={formik.handleSubmit} className="signup-form">
        <input
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your email"
          className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="signup-error">{formik.errors.email}</div>
        )}

        <input
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your password"
          className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="signup-error">{formik.errors.password}</div>
        )}

        {errorMessage && (
          <div className="signup-error">{errorMessage}</div>
        )}

        <button 
          type="submit" 
          style={{ 
            marginTop: "25px",
            marginBottom: "25px", 
            backgroundColor: "#ff5733", 
            color: "white", 
            border: "none", 
            padding: "10px", 
            cursor: "pointer", 
            borderRadius: "5px", 
            fontSize: "16px", 
            fontWeight: "bold" 
          }}
          disabled={!(formik.isValid && formik.dirty)}
        >
          SIGN IN
        </button>
      </form>
      <p className="signup-login-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
