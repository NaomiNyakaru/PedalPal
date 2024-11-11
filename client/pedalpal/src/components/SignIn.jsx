import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import './signin_up.css';

const SignIn = ({ onLogin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Admin credentials - in a real app, these would come from environment variables or backend
  const ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "admin123"
  };

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
    onSubmit: (values) => {
      // Check if the credentials match admin
      if (values.email === ADMIN_CREDENTIALS.email && 
          values.password === ADMIN_CREDENTIALS.password) {
        
        // Handle admin login
        const adminUser = {
          email: values.email,
          role: 'admin',
          name: 'Admin',
          isAdmin: true
        };
        
        // Store admin session
        sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
        setIsLoggedIn(true);
        
        // Redirect admin to admin dashboard
        navigate('/admin-dashboard');
        return;
      }

      // Check regular user credentials
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === values.email && u.password === values.password);

      if (user) {
        // Add role information to user
        const authenticatedUser = {
          ...user,
          role: 'user',
          isAdmin: false
        };
        
        // Store user session
        sessionStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        setIsLoggedIn(true);
        
        // Trigger login callback if provided
        if (onLogin) {
          onLogin(authenticatedUser);
        }

        // Redirect regular user to home page
        navigate('/');
      } else {
        alert('Invalid email or password');
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