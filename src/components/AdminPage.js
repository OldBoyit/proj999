// src/components/AdminPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProducerLogin.css'; // Importa lo stile CSS del produttore

function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook per navigare

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
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
      navigate('/admin-dashboard');
    } catch (error) {
      console.error(error);
      setError(`Network error: ${error.message}`);
    }
  };

    const handleGoHome = () => {
        navigate('/');
    };

  return (
    <div className="producer-login-container">
      <h1>Admin Login</h1>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="login-input" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="login-input" />
      <button onClick={handleLogin} className="login-button">Log In</button>
      {error && <p className="error-message">{error}</p>}
      <div className="additional-info"> {/* Nuovo div per le scritte e il bottone */}
        <p className="info-text">User: Admin</p>
        <p className="info-text">Password: password123</p>
        <center><button onClick={handleGoHome} className="home-button">Home</button></center>
      </div>
    </div>
  );
}

export default AdminPage;
