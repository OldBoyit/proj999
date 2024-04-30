// src/components/AvailableKeysPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './css/AvailableKeysPage.css'; // Importa lo stile CSS per la pagina delle chiavi disponibili

function AvailableKeysPage() {
    const navigate = useNavigate(); // Utilizza useNavigate per la navigazione
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        fetch('/.netlify/functions/availableKeys')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setKeys(data))
            .catch(error => console.error('Error fetching available keys:', error));
    }, []);

    return (
        <div className="available-keys-container">
            <h1>Chiavi Disponibili</h1>
            <p>Numero di chiavi disponibili: {keys.length}</p>
            <div className="keys-grid">
                {keys.length > 0 ? (
                    keys.map((key, index) => (
                        <div key={index} className="key-item">
                            <p>Chiave Pubblica:</p>
                            <p>{key.publicKey}</p>
                        </div>
                    ))
                ) : (
                    <p>Nessuna chiave disponibile.</p>
                )}
            </div>
            <div className="navigation-button">
                <button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">
                    Dashboard del Produttore
                </button>
            </div>
        </div>
    );
}

export default AvailableKeysPage;
