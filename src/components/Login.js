import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    }, []);

    const handleLogin = () => {
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
            console.log('Logging in with:', username, password);
            navigate('/home'); // Redirect to home page after successful login
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className='login-container'>
            <h2 className='text'>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='input-container'>
                <input
                    className='username'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className='password'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin} className='button'>Login</button>
            <div className='forgotpass'>
                <a href="/forgot-password">Forgot Password?</a>
            </div>
            <div className='signup'>
                <a href="/sign-up">Sign Up</a>
            </div>
        </div>
    );
};

export default Login;