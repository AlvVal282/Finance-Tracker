import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home.jsx';
import Login from './Components/Pages/Login.jsx';
import Register from './Components/Pages/Register.jsx';
import Dashboard from './Components/Pages/Dashboard.jsx';
// Import other components for different routes as needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Add more routes here */}
    </Routes>
  );
}

export default App;
