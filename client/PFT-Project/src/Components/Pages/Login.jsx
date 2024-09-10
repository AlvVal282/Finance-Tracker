import React, { useState, useEffect } from 'react';
import '../Styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../Assets/Header.jsx";

const Login = ({setUser}) => {

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({
        ...formData,
        [name]: value
    })
  };

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUser({username: "", user_id: ""})
  }, [setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const userData = {
          username: formData.username,
          password: formData.password
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
            setUser({username: userData.username, id: data.user_id});
            console.log(data.user_id);
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
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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
