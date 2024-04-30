// src/components/ViewNFCTokensPage.js
import React, { useState, useEffect } from 'react';

function ViewNFCTokensPage() {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    fetch('/.netlify/functions/getAssignedKeys') // Assumi che questa sia la tua endpoint API
      .then(response => response.json())
      .then(data => setKeys(data))
      .catch(error => console.error('Error fetching keys:', error));
  }, []);

  const handleSelectKey = (key) => {
    setSelectedKey(key);
  };

  const retireKey = () => {
    if (selectedKey) {
      fetch(`/.netlify/functions/retireKey?id=${selectedKey._id}`, { method: 'POST' })
        .then(response => {
          if (response.ok) {
            alert('Key retired successfully!');
            // Rimuovi la chiave ritirata dall'elenco visualizzato o aggiorna l'elenco
            setKeys(keys.filter(k => k._id !== selectedKey._id));
          } else {
            alert('Failed to retire the key');
          }
        })
        .catch(error => console.error('Error retiring key:', error));
    }
  };

  return (
    <div>
      <h1>View NFC Tokens</h1>
      <ul>
        {keys.map(key => (
          <li key={key._id} onClick={() => handleSelectKey(key)}>
            PublicKey: {key.publicKey} - Status: {key.status}
          </li>
        ))}
      </ul>
      {selectedKey && (
        <div>
          <p>Selected Key: {selectedKey.publicKey}</p>
          <button onClick={retireKey}>Retire Key</button>
        </div>
      )}
    </div>
  );
}

export default ViewNFCTokensPage;

