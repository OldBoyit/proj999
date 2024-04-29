// src/components/UploadDigitalSignaturesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assicurati di avere axios installato: npm install axios
import styles from './css/UploadDigitalSignaturesPage.css';
import { useNavigate } from 'react-router-dom';

function UploadDigitalSignaturesPage() {
  // Funzione per formattare la data in formato YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  };

  // Impostazione della data odierna come valore iniziale per signatureData
  const [signatureData, setSignatureData] = useState(`Firma creata il ${formatDate(new Date())}`);
  const [creator, setCreator] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:3001/api/digital-signatures';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creator: creator,
          signatureData: signatureData
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Signature saved:', data);
      alert('Firma digitale salvata con successo!');
      setSignatureData(`Firma creata il ${formatDate(new Date())}`);
      setCreator('');
    } catch (error) {
      console.error('Error uploading signature:', error);
      alert('Errore nel salvataggio della firma digitale: ' + error.message);
    }
  };

    const handleBackToDashboard = () => {
        navigate('/dashboard'); // Aggiungi il percorso corretto della tua dashboard
    };
	
    return (
        <div className={styles.container}>
            <h1>Carica Firma Digitale</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="Creator" required />
                <textarea value={signatureData} onChange={(e) => setSignatureData(e.target.value)} placeholder="Signature Data" required />
                <button type="submit">Carica Firma</button>
            </form>
            <button onClick={() => navigate('/producer-dashboard')} className={styles.dashboardButton}>Dashboard</button>
        </div>
    );
}

export default UploadDigitalSignaturesPage; 