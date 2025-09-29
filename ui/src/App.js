import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/ForgotPassword';
import Home from './Components/Home';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home username={username} registerNumber={registerNumber} setUsername={setUsername} setRegisterNumber={setRegisterNumber} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/signin" element={<SignIn setUsername={setUsername} setRegisterNumber={setRegisterNumber} />} />
      </Routes>
    </Router>
  );
}

export default App;
