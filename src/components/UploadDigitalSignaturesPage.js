import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UploadDigitalSignaturesPage.css'; // Assicurati che il percorso del CSS sia corretto

function UploadDigitalSignaturesPage() {
  const [signatureData, setSignatureData] = useState('Firma creata il ' + new Date().toISOString().split('T')[0]);
  const [creator, setCreator] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mostra un messaggio popup
    alert('Firma creata correttamente!');
    // Resetta i campi del form
    setSignatureData('Firma creata il ' + new Date().toISOString().split('T')[0]);
    setCreator('');
  };

  return (
    <div className="container">
      <h1>Carica Firma Digitale</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          placeholder="Creator"
          required
        />
        <textarea
          value={signatureData}
          onChange={(e) => setSignatureData(e.target.value)}
          placeholder="Signature Data"
          required
        />
        <button type="submit">Carica Firma</button>
      </form>
      <button onClick={() => navigate('/producer-dashboard')}>Dashboard</button>
    </div>
  );
}

export default UploadDigitalSignaturesPage;
