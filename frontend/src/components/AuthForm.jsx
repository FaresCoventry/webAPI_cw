import React, { useState } from 'react';
import axios from 'axios';
import './authform.css'

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:5000/api/users/${isLogin ? 'login' : 'register'}`;
        const payload = { username, password };

        try {
            const response = await axios.post(url, payload);
            console.log('Response:', response.data);
            alert(`Success! User ${isLogin ? 'logged in' : 'registered'} successfully.`);
        } catch (error) {
            console.error('Authentication error:', error);
            alert(`Failed to ${isLogin ? 'login' : 'register'}.`);
        }
    };

    return (
        <div className='AuthForm'>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need to register? Click here.' : 'Already registered? Click to login.'}
            </button>
        </div>
    );
}

export default AuthForm;
