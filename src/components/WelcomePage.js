// src/components/WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; 
import './css/WelcomePage.css'; 
import logo from '../img/logo.png';

function WelcomePage() {
  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="header-logo"/>
      <h1>Project999</h1>
      <div className="button-container">
            <button className="welcome-button"><Link to="/admin-login" className="link-style">Admin Login</Link></button>
            <button className="welcome-button"><Link to="/producer-login" className="link-style">Producer Login</Link></button>
      </div>
		<div className="info-section">
		  <h2>Accesso Admin</h2>
		  <p>
			L'admin ha la funzione di creare, eliminare, modificare i permessi dei Produttori.<br />
			L'Admin è colui che gestisce gli utenti autorizzati a registrare prodotti nel progetto.
		  </p>
		</div>
		<div className="info-section">
		  <h2>Accesso Produttore</h2>
		  <p>
			Il Produttore è colui che inserisce, registra, controlla i prodotti inseriti nel sistema<br />
			e nella Blockchain. Ha facoltà di creare, sia un singolo prodotto che molti prodotti contemporaneamente,<br />
			di controllare il flusso di lavoro, i prodotti registrati e di revocarne la prova di autenticità.
		  </p>
		</div>
    </div>
  );
}

export default WelcomePage;

