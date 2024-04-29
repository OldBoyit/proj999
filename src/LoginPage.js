// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [type, setType] = useState('admin'); // Inizializza 'type' a 'admin'
    const navigate = useNavigate();

	const handleProducerLogin = async () => {
		try {
			const response = await fetch('http://localhost:3001/api/producers/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				// Handle HTTP errors
				console.log("Login failed:", response.status);
				setError("Login failed: " + response.statusText);
				return;
			}

			const data = await response.json();
			console.log("Data received on login:", data);
			if (data.role === 'producer') {
				console.log("Navigating to producer dashboard...");
				navigate('/producer-dashboard');
			} else {
				console.log("Unauthorized or incorrect role");
				setError("Unauthorized access or incorrect role");
			}
		} catch (err) {
			console.error("Error during login:", err);
			setError('Network error occurred');
		}
	};

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />
            <select
                value={type}
                onChange={e => setType(e.target.value)}  // Aggiorna 'type' quando l'utente sceglie un'opzione
            >
                <option value="admin">Admin</option>
                <option value="producer">Producer</option>
            </select>
            <button onClick={() => handleLogin(type)}>Log In</button>  // Passa 'type' a 'handleLogin'
            {error && <p>{error}</p>}
        </div>
    );
}

export default LoginPage;



