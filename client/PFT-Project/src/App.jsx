import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from './Components/Pages/Home.jsx';
import Login from './Components/Pages/Login.jsx';
import Register from './Components/Pages/Register.jsx';
import Dashboard from './Components/Pages/Dashboard.jsx';
import Report from './Components/Pages/Report.jsx';
import Header from './Components/Assets/Header.jsx';

function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : {username: "", user_id: ""}
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user]);

  return (
    <>
    <Header user={user} setUser={setUser}/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setUser={setUser}/>}/>   
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      <Route path="/report" element={<Report />} />
    </Routes>
    </>
  );
}

export default App;
