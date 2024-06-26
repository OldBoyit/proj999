import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProducerDashboard.css'; // Importa lo stile CSS per il dashboard del produttore

function ProducerDashboard() {
  const navigate = useNavigate();
  const [showNFCOptions, setShowNFCOptions] = useState(false);
  const [showProductOptions, setShowProductOptions] = useState(false);
  const [showDigitalSignatureOptions, setShowDigitalSignatureOptions] = useState(false);
  const [showProductCreationOptions, setShowProductCreationOptions] = useState(false);
  const [displayText, setDisplayText] = useState("Seleziona un'opzione");

  const toggleNFCOptions = () => {
    setShowNFCOptions(!showNFCOptions);
    setShowProductOptions(false);
    setShowDigitalSignatureOptions(false);
    setDisplayText('Opzioni NFC');
  };

  const toggleProductOptions = () => {
    setShowProductOptions(!showProductOptions);
    setShowNFCOptions(false);
    setShowDigitalSignatureOptions(false);
    if (showProductOptions) {
      setShowProductCreationOptions(false);
    }
    setDisplayText('Opzioni Prodotti');
  };

  const toggleDigitalSignatureOptions = () => {
    setShowDigitalSignatureOptions(!showDigitalSignatureOptions);
    setShowNFCOptions(false);
    setShowProductOptions(false);
    setDisplayText('Opzioni Firma Digitale');
  };

  const toggleProductCreationOptions = () => {
    setShowProductCreationOptions(!showProductCreationOptions);
    setDisplayText('Opzioni Creazione Prodotti');
  };

  const handleButtonClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewBlockchain = () => {
    window.open('https://sepolia.etherscan.io/address/0x2CbE824d1E53a88A5Fa438871943A1bF8149949e', '_blank');
  };
  
  return (
    <div className="producer-dashboard-container">
      <h1>Dashboard del Produttore</h1>
      <button className="dashboard-button" onClick={toggleNFCOptions}>NFC</button>
      <button className="dashboard-button" onClick={toggleProductOptions}>Prodotti</button>
      <button className="dashboard-button" onClick={toggleDigitalSignatureOptions}>Firma Digitale</button>
      <button className="dashboard-button" onClick={handleViewBlockchain}>Visualizza su Blockchain</button> {/* Aggiunto pulsante per visualizzare su Blockchain */}

      {showNFCOptions && (
        <div className="options-container">
          <button className="option-button" onClick={() => navigate('/upload-nfc-keys')}>Carica Chiavi NFC</button>
          <button className="option-button" onClick={() => navigate('/available-keys')}>Chiavi Disponibili</button>
          <button className="option-button" onClick={() => navigate('/view-assigned-keys')}>Visualizza Chiavi Assegnate</button>
          <button className="option-button" onClick={() => navigate('/view-retires-keys')}>Visualizza Chiavi Ritirate</button>
          <button className="option-button" onClick={() => navigate('/withdraw-nfc')}>Ritira NFC</button>
        </div>
      )}

      {showProductOptions && (
        <div className="options-container">
          <button className="option-button" onClick={toggleProductCreationOptions}>Creazione Nuovi Prodotti</button>
          {showProductCreationOptions && (
            <div>
              <button className="sub-option-button" onClick={(e) => handleButtonClick(e, '/create-single-product')}>Crea singolo Prodotto</button>
              <button className="sub-option-button" onClick={(e) => handleButtonClick(e, '/create-multiple-products')}>Creazione Prodotti Multipla</button>
              <button className="sub-option-button" onClick={(e) => handleButtonClick(e, '/create-merkle-root')}>Creazione Merkle Root</button>
            </div>
          )}
          {!showProductCreationOptions && (
            <>
              <button className="option-button" onClick={() => navigate('/view-products')}>Visualizza Prodotti Registrati</button>
              <button className="option-button" onClick={() => navigate('/withdraw-products')}>Ritira Prodotti</button>
            </>
          )}
        </div>
      )}

      {showDigitalSignatureOptions && (
        <div className="options-container">
          <button className="option-button" onClick={(e) => handleButtonClick(e, '/upload-digital-signatures')}>Carica Firma Digitale</button>
          <button className="option-button" onClick={() => navigate('/view-digital-signatures')}>Visualizza Firme Digitali</button>
          <button className="option-button" onClick={() => navigate('/remove-digital-signatures')}>Rimuovi Firme Digitali</button>
        </div>
      )}
      <center><button onClick={handleGoHome} className="home-button">Home</button></center>
    <div className="dashboard-description">
      <h2>Descrizione del Dashboard</h2>
      <p>Questa dashboard è progettata per fornire ai produttori tutti gli strumenti necessari per gestire efficacemente la sicurezza e l'autenticità dei loro prodotti.</p>
      <p>Utilizzate i pulsanti qui sopra per accedere alle varie funzionalità: ogni pulsante attiva specifiche opzioni che vi permetteranno di caricare chiavi NFC, gestire firme digitali, creare e tracciare prodotti attraverso vari stadi di produzione e distribuzione.</p>
      <p>Ogni funzionalità è progettata per garantire che ogni prodotto mantenga gli standard più elevati di qualità e sicurezza, supportando la tutela e la valorizzazione del Made in Italy.</p>
    </div>
  </div>
);
}

export default ProducerDashboard;

