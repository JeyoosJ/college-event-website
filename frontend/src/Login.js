import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ handleLoginSuccess }) => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [user_level, setUserLevel] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        axios.post('http://localhost:8081/login', { username: loginUsername, password: loginPassword })
            .then(response => {
                if (response.status === 200) {
                    // Login successful, redirect or perform other actions
                    console.log('Login successful');
                    alert('Login successful')
                    const user = response.data.user;
                    handleLoginSuccess(user); // Update user state in App component
                    if (user.user_level === 'admin') {
                        navigate(`/admin`, { state: { user: user } }); // Redirect to admin page
                    } else if (user.user_level === 'student') {
                        navigate(`/student`, { state: { user: user } }); // Redirect to student page
                    }
                } else {
                    // Login failed, display error message
                    console.error('Login failed');
                    alert('Login failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed');
            });
    };

    const handleRegister = () => {
        axios.post('http://localhost:8081/register', { username: registerUsername, password: registerPassword, user_level })
            .then(response => {
                if (response.status === 200) {
                    // Registration successful, display success message
                    console.log('Registration successful');
                    alert('Registration successful');
                } else {
                    // Registration failed, display error message
                    console.error('Registration failed');
                    alert('Registration failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Registration failed');
            });
    };

    return (
        <div>
            <div>
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
            <div>
                <h1>Register</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="student, admin or super_admin"
                    value={user_level}
                    onChange={(e) => setUserLevel(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
};

export default Login;
