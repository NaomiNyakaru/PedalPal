import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { CiLogin,CiLogout } from "react-icons/ci";
import { GiDutchBike } from "react-icons/gi";
import logo from '../assets/LOGO.jpeg';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode === 'true') {
      setDarkMode(true);
    }
  }, []);



  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <img src={logo} alt="Pedal Pal Logo" className="logo" style={{ width: '90px', height: 'auto' }} />
      <div className="navbar-logo">
        <Link to="/">Pedal Pal</Link>
        <p>For whenever you're wheely-tired</p>
      </div>
      <ul className="navbar-links">
        <li><Link to="/"><FaHome /></Link></li>
        <li><Link to="/bikes"><GiDutchBike /></Link></li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="button-link"><CiLogout /></button>
          </li>
        ) : (
          <li><Link to="/login"><CiLogin /></Link></li>
        )}
      </ul>

    </nav>
  );
};

export default Navbar;