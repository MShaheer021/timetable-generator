import React, { useState } from 'react';
import './ForgotPassword.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = () => {
        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }
        setMessage(`A password reset link has been sent to ${email}.`);
        setEmail('');
    };

    return (
        <div className='forgot-password-container'>
            <h2 className='text'>Forgot Password</h2>
            <p>Please enter your email address to receive a password reset link.</p>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <div>
                <input
                className='email'
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button className='button' onClick={handleReset}>Send Reset Link</button>
        </div>
    );
};

export default ForgotPassword;