import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import '../styles/Navbar.css'

function Navbar() {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-text">TutorConnect</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About Us</Link>
        <Link to="/admin/login">Admin</Link>
        <div className="dropdown">
          <button 
            className="dropdown-btn"
            onMouseEnter={() => setShowLoginDropdown(true)}
            onMouseLeave={() => setShowLoginDropdown(false)}
          >
            Login
            {showLoginDropdown && (
              <div className="dropdown-content">
                <Link to="/login">Student Login</Link>
                <Link to="/login/tutor">Tutor Login</Link>
                <Link to="/admin/login">Admin Login</Link>
              </div>
            )}
          </button>
        </div>
        <div className="dropdown">
          <button 
            className="dropdown-btn register-btn"
            onMouseEnter={() => setShowRegisterDropdown(true)}
            onMouseLeave={() => setShowRegisterDropdown(false)}
          >
            Register
            {showRegisterDropdown && (
              <div className="dropdown-content">
                <Link to="/register">Student Registration</Link>
                <Link to="/register/tutor">Tutor Registration</Link>
              </div>
            )}
          </button>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {isDarkMode ? (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}

export default Navbar