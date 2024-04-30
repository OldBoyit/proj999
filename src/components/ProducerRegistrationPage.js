import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProducerRegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/producers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password, 
                    walletAddress: walletAddress
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Produttore registrato correttamente');
                setTimeout(() => {
                    navigate('/admin-dashboard');
                }, 3000);
            } else {
                throw new Error(data.message || "Unable to register producer");
            }
        } catch (error) {
            console.error(error);
            setMessage(`Error registering producer: ${error.message}`);
        }
    };

    const handleBackToDashboard = () => {
        navigate('/admin-dashboard');
    };

    return (
        <div>
            <h1>Registra Produttore</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Wallet Address"
            />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleBackToDashboard} style={{ marginTop: '10px' }}>Back to Dashboard</button>
            {message && <p>{message}</p>}
            <p>Questa pagina permette all'amministratore di registrare nuovi produttori nel sistema.</p>
			<p>Ogni produttore deve fornire un username unico, una password, e un indirizzo Ethereum associato.</p> 
			<p>La registrazione riuscita integra i dettagli del produttore nel backend del sistema per l'autenticazione e il trattamento delle transazioni nelle operazioni blockchain future.</p>
        </div>
    );
}

export default ProducerRegistrationPage;


