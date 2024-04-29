// src/components/ViewAssignedKeysPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ViewAssignedKeysPage.css'; // Importa lo stile CSS per la pagina delle chiavi assegnate

function ViewAssignedKeys() {
  const navigate = useNavigate(); // Per la navigazione
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/keys/assigned')
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
              <p>Chiave Pubblica:</p>
              <p>{key.publicKey}</p>
              <p>Prodotti Assegnati:</p>
              <ul className="assigned-products-list">
                {key.assignedProducts.map((product, index) => (
                  <li key={index}>{product.name}</li>
                ))}
              </ul>
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
