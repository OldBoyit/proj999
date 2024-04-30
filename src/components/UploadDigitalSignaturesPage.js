import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UploadDigitalSignaturesPage.css'; 
import styles from './css/UploadDigitalSignaturesPage.css';

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
	        <div className={styles.exampleText}>
        <center><p>Caratteristiche principali della pagina</p>
<p>Gestione delle Firme Digitali:</p>	
<p>La pagina permette agli utenti di inserire e caricare nuove firme digitali.</p>	
<p>Ogni firma è associata a una data di creazione, che viene automaticamente generata e mostrata all'utente per aumentare la trasparenza e fornire un timestamp di riferimento.</p>	
<p>Conferma e Reset:</p>	
<p>Dopo il caricamento della firma, un messaggio popup conferma il successo dell'operazione.</p>	
<p>I campi del form vengono resettati dopo ogni invio, preparando l'interfaccia per un nuovo inserimento e mantenendo l'efficienza dell'utente.</p>	
<p>Questa pagina non solo facilita l'aggiunta di nuove firme digitali ma rafforza anche la sicurezza e l'integrità del sistema di registrazione dei prodotti, garantendo che ogni prodotto sia tracciabile fino al suo creatore originale. Questo è particolarmente importante in ambienti regolamentati o in industrie dove l'autenticità e la provenienza del prodotto sono di massima importanza.</p>	</center>
      </div>
    </div>
  );
}

export default UploadDigitalSignaturesPage;
