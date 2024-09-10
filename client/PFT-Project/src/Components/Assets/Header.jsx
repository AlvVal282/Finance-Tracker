import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './PersonalLogoAVID150x150.png';
import '../Styles/Basics.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return user !== null && user.username !== "";
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser({ username: "", id: "" }); // Clear user state
    navigate('/'); // Navigate to home page
  };

  return (
    <header>
      <nav className='header-nav-bar'>
        <div className="nav-left"></div>
        <ul>
          <li><Link className="nav-link" to="/">Home</Link></li>
          <li><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
          <li><Link className="nav-link" to="/report">Report</Link></li>
          {isLoggedIn() ? (
            <li><Link className="nav-link" onClick={handleLogout} to="/">Logout</Link></li>
          ) : (
            <li><Link className="nav-link" to="/login">Login</Link></li>
          )}
        </ul>
        <div className="nav-right">
          <img className='logo' src={logo} alt='LOGO' />
        </div>
      </nav>
    </header>
  );
};

export default Header;
