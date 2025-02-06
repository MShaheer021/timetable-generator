import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home'
import './App.css';

const App = () => {
    return (
        <div className='main'>

        <Router>
            <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/home" element={<Home/>} />
            </Routes>
        </Router>

        </div>
    );
};

export default App;