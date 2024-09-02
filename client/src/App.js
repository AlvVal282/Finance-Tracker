import React, { useState, useEffect } from 'react';
import {Routes, Route} from "react-router-dom"

import Home from "./Components/Pages/Home"
import Register from "./Components/Pages/Register"
import Login from "./Components/Pages/Login"
import Header from "./Components/Assets/Header"

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : {username: "", id: ""}
  })
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])


  return (
    <>
      <Header user={user} setUser={setUser}/>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login setUser={setUser}/>}/>
      </Routes>
    </>
  );
}

export default App;
