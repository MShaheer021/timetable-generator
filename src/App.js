import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import './App.css';

const App = () => {
    return (
        <div className='main'>
            <Router>
                <Routes>
                    <Route path="/" element={<HomeWithButton />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
};

const HomeWithButton = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className='center'>
            <h1>Welcome to the Time Table Generator</h1>
            <button className='button1' onClick={handleLoginClick}>Go to Login</button>
        </div>
    );
};

export default App;