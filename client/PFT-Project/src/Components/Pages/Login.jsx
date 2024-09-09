import React, { useState } from 'react';
import '../Styles/Login.css'; // Make sure the path is correct
import { Link, useNavigate } from 'react-router-dom';
import Header from "../Assets/Header.jsx";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation after successful login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const userData = {
          username,
          password
        };
        const response = await fetch('http://localhost:5001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message);
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } else {
            // Handle login error
            setError(data.message);
            console.error(data.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <div className="register-link">
            <p>Don't have an account? <Link className="nav-link" to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
