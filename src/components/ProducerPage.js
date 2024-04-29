// src/components/ProducerPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProducerPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();const User = require('../models/User');
const Producer = require('../models/Producer'); 


  const handleLogin = async () => {
    try {
      // Aggiorna l'URL per puntare all'endpoint corretto
      const response = await fetch('http://localhost:3001/api/producers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Login failed: ${errorText}`);
        return;
      }

      const data = await response.json();
      // Qui puoi gestire il token se necessario, e fare il redirect
      navigate('/admin-dashboard');
    } catch (error) {
      console.error(error);
      setError(`Network error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Producer Login</h1>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Log In</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ProducerPage;

