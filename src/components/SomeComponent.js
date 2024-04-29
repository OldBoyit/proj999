import React, { useState } from 'react';
import { addKey } from '../services/keyService';

function SomeComponent() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handleAddKey = async () => {
    try {
      const data = await addKey(publicKey, privateKey);
      console.log('Key added:', data);
      // Aggiungi altre operazioni di gestione post-successo qui
    } catch (error) {
      console.error('Failed to add key:', error);
    }
  };

  return (
    <div>
      <input type="text" value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder="Public Key" />
      <input type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder="Private Key" />
      <button onClick={handleAddKey}>Add Key</button>
    </div>
  );
}

export default SomeComponent;
