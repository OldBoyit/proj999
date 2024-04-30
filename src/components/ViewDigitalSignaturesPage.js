import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/ViewDigitalSignaturesPage.css';

function ViewDigitalSignaturesPage() {
  const [signatures, setSignatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        // Aggiornato per puntare alla funzione serverless corretta
        const response = await fetch('/.netlify/functions/fetchDigitalSignatures');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSignatures(data);
      } catch (error) {
        console.error('Error fetching signatures:', error);
      }
    };

    fetchSignatures();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Visualizza Firme Digitali</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Creator</th>
            <th>Signature Data</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {signatures.map(signature => (
            <tr key={signature._id}>
              <td>{signature._id}</td>
              <td>{signature.creator}</td>
              <td>{signature.signatureData}</td>
              <td>{new Date(signature.created).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {signatures.length === 0 && <p className={styles.noSignatures}>Nessuna firma digitale registrata.</p>}
      <button onClick={() => navigate('/producer-dashboard')} className={styles.dashboardButton}>Dashboard</button>
       <div className={styles.exampleText}>
        <center><p>Caratteristiche principali della pagina </p>   
		<p>Caricamento e Visualizzazione delle Firme:</p>	
		<p>Utilizza una chiamata API per recuperare le firme digitali dal server. La funzione fetchSignatures gestisce il recupero dei dati in modo asincrono, assicurando che l'interfaccia rimanga reattiva e efficiente.</p>	
		<p>Interfaccia Tabellare per la Visualizzazione dei Dati:</p>	
		<p>La pagina mostra le firme in una tabella ben strutturata, facilitando la lettura e l'interpretazione dei dati. Ogni riga rappresenta una firma e include:</p>	
		<p>ID: L'identificativo unico della firma.</p>	
		<p>Creator: Il creatore della firma, mostrando chi ha generato la firma.</p>
		<p>Signature Data: I dati specifici della firma, che potrebbero includere informazioni crittografiche o altri dettagli pertinenti.</p>	
		<p>Created: La data di creazione della firma, mostrata in un formato facilmente leggibile.</p></center>	
	</div>
  );
}

export default ViewDigitalSignaturesPage;
