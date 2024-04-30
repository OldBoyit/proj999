import React, { useState, useEffect } from 'react';

function ViewNFCTokensPage() {
  const [keys, setKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/getAssignedKeys') // Assumi che questa sia la tua endpoint API
      .then(response => response.json())
      .then(data => setKeys(data))
      .catch(error => console.error('Error fetching keys:', error));
  }, []);

  const handleSelectKey = (key) => {
    const isAlreadySelected = selectedKeys.includes(key._id);
    if (isAlreadySelected) {
      setSelectedKeys(selectedKeys.filter(id => id !== key._id));
    } else {
      setSelectedKeys([...selectedKeys, key._id]);
    }
  };

  const retireSelectedKeys = () => {
    selectedKeys.forEach(keyId => {
      fetch(`/netlify/functions/retireKey?id=${keyId}`, { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to retire the key');
          }
          setKeys(keys.filter(k => k._id !== keyId));
          setSelectedKeys(selectedKeys.filter(id => id !== keyId));
        })
        .catch(error => console.error('Error retiring key:', error));
    });
  };

  return (
    <div>
      <h1>View NFC Tokens</h1>
      <ul>
        {keys.map(key => (
          <li key={key._id}>
            <input
              type="checkbox"
              checked={selectedKeys.includes(key._id)}
              onChange={() => handleSelectKey(key)}
            />
            PublicKey: {key.publicKey} - Status: {key.status}
          </li>
        ))}
      </ul>
      {selectedKeys.length > 0 && (
        <div>
          <button onClick={retireSelectedKeys}>Ritira Chiavi Selezionate</button>
        </div>
      )}
    </div>
  );
}

export default ViewNFCTokensPage;
