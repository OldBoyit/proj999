import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProducerLogin.css'; // Importa lo stile CSS

function ProducerLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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

            const data = await response.json();
            console.log("Data received on login:", data);
            
            if (response.ok) {
                console.log("Navigating to producer dashboard...");
                navigate('/producer-dashboard');
            } else {
                console.log("Login failed or invalid role:", data);
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError('Network error occurred');
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="producer-login-container">
            <h2>Producer Login</h2>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="login-input"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="login-input"
            />
            <button onClick={handleProducerLogin} className="login-button">Log In</button>
            {error && <p className="error-message">{error}</p>}
            {/* Aggiungi le righe di testo qui sotto */}
            <p className="placeholder-text">User: produttore</p>
            <p className="placeholder-text">Password: 12345</p>
            {/* Aggiungi il bottone Home qui sotto */}
           <center> <button onClick={handleGoHome} className="home-button">Home</button></center>
        </div>
    );
}

export default ProducerLogin;

