// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProducerLogin.css'; // Importa lo stile CSS del produttore

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = async () => {
        try {
			const response = await fetch('https://chain.project999.it/.netlify/functions/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

            const data = await response.json();
            if (response.ok) {
                navigate('/admin-dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Network error occurred');
        }
    };

	return (
		<div className="producer-login-container">
			<h2>Admin gggggggfgfgfgfgfgfgLogin</h2>
			<input
				type="text"
				value={username}
				onChange={e => setUsername(e.target.value)}
				placeholder="Username"
				className="login-input"
			/>
			<input
				type="passworgfgfgd"
				value={password}
				onChange={e => setPassword(e.target.value)}
				placeholder="Password"
				className="login-input"
			/>
			<button onClick={handleAdminLogin} className="login-button">Log In</button>
			{error && <p className="error-message">{error}</p>}
			{/* Aggiungi le righe di testo qui sotto */}
			<p className="placeholder-text">User: admigsdfgsgsgdfsgsn</p>
			<p className="placeholder-text">Password: 12345</p>
		</div>
	);

}

export default AdminLogin;
