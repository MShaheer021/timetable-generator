import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; 

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        if (!username || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        if (existingUsers.find(user => user.username === username)) {
            setError('Username already taken.');
            return;
        }

        const newUser  = { username, password };
        existingUsers.push(newUser );
        localStorage.setItem('users', JSON.stringify(existingUsers));

        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setError('');

        alert('User  created successfully! Redirecting to login...');
        navigate('/login');
    };

    return (
        <div className='signup-container'>
            <h2 className='text'>Sign Up</h2>
            <p>Please fill in the form to create an account.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                style={{borderRadius:"15px", width: "100%", outline:'none'}}
                className='user'
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
                <input
                className='password'
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <button className='button2' onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUp;