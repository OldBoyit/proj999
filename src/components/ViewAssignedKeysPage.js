// src/components/ViewAssignedKeysPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ViewAssignedKeysPage.css';

function ViewAssignedKeys() {
    const navigate = useNavigate();
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        fetch('/.netlify/functions/assignedKeys')
        .then(response => response.json())
        .then(data => setKeys(data))
        .catch(error => console.error('Failed to fetch assigned keys:', error));
    }, []);

    return (
        <div className="assigned-keys-container">
            <h1>Chiavi Assegnate</h1>
            {keys.length > 0 ? (
                <ul className="key-list">
                {keys.map((key) => (
                    <li key={key._id} className="key-item">
                        <p>Chiave Pubblica: {key.publicKey}</p>
                        <p>Chiave Privata: {key.privateKey}</p> {/* Aggiunto */}
                        <p>Stato: {key.status}</p> {/* Aggiunto */}
                        <p>Attiva: {key.isActive ? 'Sì' : 'No'}</p> {/* Aggiunto */}
                    </li>
                ))}
                </ul>
            ) : (
                <p>Nessuna chiave assegnata.</p>
            )}
            <button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">Dashboard</button>
        </div>
    );
}

export default ViewAssignedKeys;
