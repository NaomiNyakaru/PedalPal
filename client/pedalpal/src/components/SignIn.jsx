import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signin_up.css';

const SignIn = ({ onLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const serverURL = import.meta.env.VITE_SERVER_URL;


  // // Admin credentials - in a real app, these would come from environment variables or backend
  // const ADMIN_CREDENTIALS = {
  //   email: "admin@example.com",
  //   password: "admin123"
  // };

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
    onSubmit:async (values) => {
      // Check if the credentials match admin
      try {
        // Check if the credentials match an admin
        if (values.username === 'admin' && values.password === 'adminpassword') {
          const res = await axios.post(`${serverURL}/admin-dashboard`, values);
          console.log('Admin login successful:', res.data);
          navigate('/admin-dashboard');
        } else {
          // Regular user login
          const res = await axios.post(`${serverURL}/login`, values);
          console.log('User login successful:', res.data);
          navigate('/bike/:id');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setErrorMessage(error.response?.data?.message || 'Login failed! Please try again.');
      }
    },
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