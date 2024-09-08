import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home';
// Import other components for different routes as needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Define other routes here */}
    </Routes>
  );
}

export default App;
