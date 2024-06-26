import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ViewAssignedKeysPage.css';

function ViewRetiredKeys() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/retiredKeys')
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Retrieved keys:", data);
        setKeys(data);
      })
      .catch(error => {
        console.error('Failed to fetch retired keys:', error);
        console.log(error);
      });
  }, []);

  return (
    <div className="retired-keys-container">
      <h1>Chiavi Ritirate</h1>
      {keys.length > 0 ? (
        <ul className="key-list">
          {keys.map((key) => (
            <li key={key._id} className="key-item">
              <p>Chiave Pubblica: {key.publicKey}</p>
              <p>Stato: {key.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>  Questa pagina mostra le chiavi NFC che sono state ritirate dal sistema. Le chiavi ritirate sono state precedentemente associate a prodotti ma sono state rimosse per varie ragioni, come la fine della validità del prodotto o segnalazioni di contraffazione. La visibilità di queste chiavi aiuta a mantenere la trasparenza nel sistema di tracciabilità e permette un'adeguata gestione delle chiavi nel sistema.</p>
      )}
      <button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">Dashboard</button>
    </div>
  );
}

export default ViewRetiredKeys;
