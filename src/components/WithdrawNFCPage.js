import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ViewAssignedKeysPage.css';

function ViewNFCTokensPage() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const keysPerPage = 5;

  useEffect(() => {
    fetch('/.netlify/functions/getAssignedKeys')
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
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);  // Hide the popup after 3 seconds
        })
        .catch(error => console.error('Error retiring key:', error));
    });
  };

  const handleGoBack = () => {
    navigate('/producer-dashboard');
  };

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage(prev => prev > 1 ? prev - 1 : 1);
  };

  const indexOfLastKey = currentPage * keysPerPage;
  const indexOfFirstKey = indexOfLastKey - keysPerPage;
  const currentKeys = keys.slice(indexOfFirstKey, indexOfLastKey);

  return (
    <div className="tokens-page-container">
      <h1>Ritira NFC Tokens</h1>
      <p className="subtitle"><p>Questa pagina visualizza tutti i tuoi token NFC. Puoi visualizzare il loro stato e ritirarli se necessario. I token selezionati possono essere ritirati utilizzando il pulsante "Ritira Chiavi Selezionate". Utilizza la paginazione per navigare attraverso l'elenco dei token.</p></p>
      <ul className="tokens-list">
        {currentKeys.map(key => (
          <li key={key._id} className="token-item">
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
        <button onClick={retireSelectedKeys} className="retire-button">Ritira Chiavi Selezionate</button>
      )}
      {showSuccess && <div className="popup">Prodotto Ritirato con Successo!</div>}
      <div className="pagination">
        {currentPage > 1 && <button onClick={prevPage}>Pagina Precedente</button>}
        {currentPage * keysPerPage < keys.length && <button onClick={nextPage}>Pagina Successiva</button>}
      </div>
      <button onClick={handleGoBack} className="back-button">Torna alla Dashboard</button>
    </div>
  );
}

export default ViewNFCTokensPage;
