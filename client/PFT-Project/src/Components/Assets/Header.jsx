import React from 'react';
import { Link } from 'react-router-dom';
import logo from './PersonalLogoAVID150x150.png';
import { useNavigate } from 'react-router-dom';
import '../Styles/Basics.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
      navigate("/login");
  };
  return (
    <header>
      <nav className='header-nav-bar'>
        <div className="nav-left"></div> 
        <ul>
          <li><Link className="nav-link" to="/">Home</Link></li>
          <li><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
          <li><Link className="nav-link" to="/report">Report</Link></li>
          <li onClick={handleLogin}>Login</li>
        </ul>
        <div className="nav-right">
          <img className='logo' src={logo} alt='LOGO' />
        </div>
      </nav>
    </header>
  );
};

export default Header;
