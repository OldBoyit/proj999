import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/ViewProductPage.css';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [signatures, setSignatures] = useState([]); // Ensure you have state for signatures
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/.netlify/functions/getActiveProducts')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching active products:', error));
  }, []);

  const handleDashboardClick = () => {
    navigate('/producer-dashboard');
  };

  return (
    <div className={styles.tableContainer}>
      <h1>Prodotti Attivi</h1>
      <button onClick={handleDashboardClick} className={styles.dashboardButton}>Torna alla Dashboard</button>

      <div style={{ overflowX: 'auto', margin: '0 20px' }}> {/* Adjust margin to prevent overflow */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Nome Prodotto</th>
              <th>PublicKey NFC</th>
              <th>Key Challenge-Response</th>
              <th>Seed</th>
              <th>Firma del Produttore</th>
              <th>ID Unico</th>
              <th>Hash della Transazione</th>
              <th>Stato</th>
              <th>Creato il</th>
              <th>Aggiornato il</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className={index % 2 === 0 ? styles.tr : ''}>
                <td>{product._id}</td>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.publicKey}</td>
                <td>{product.secret}</td>
                <td>{product.seed}</td>
                <td>{product.manufacturerSignature}</td>
                <td>{product.randomSecret}</td>
                <td>{product.transactionHash}</td>
                <td>{product.status}</td>
                <td>{new Date(product.createdAt).toLocaleString()}</td>
                <td>{new Date(product.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.container}>
        <h1>Visualizza Firme Digitali</h1>
        <div className={styles.centeredBox}>
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
          <div className={styles.exampleText} style={{ textAlign: 'center' }}> 
            <p>Questa visualizzazione è cruciale per la gestione e il monitoraggio dei prodotti, permettendo agli utenti autorizzati (produttori) di accedere facilmente a tutte le informazioni rilevanti riguardanti ogni singolo prodotto registrato. L'interfaccia utente è costruita per supportare la trasparenza e facilitare l'audit dei prodotti in tempo reale.</p>
            <p>Principali Caratteristiche della Pagina:</p>
            <p>Visualizzazione Completa dei Dati: La pagina mostra un'ampia gamma di dati per ogni prodotto, includendo:</p>
            <p><b>ID e Product ID:</b> Identificativi unici per riferimenti interni e tracciabilità.</p>
			<p><b>Nome Prodotto:</b> Il nome commerciale del prodotto.</p>
			<p><b>PublicKey NFC:</b> La chiave pubblica NFC usata per l'interazione sicura e l'identificazione del prodotto.</p>
			<p><b>Key Challenge-Response:</b> Una chiave usata in un sistema di sicurezza per verificare l'integrità e l'autenticità del prodotto.</p>
			<p><b>Seed:</b> Un valore generato da un algoritmo usato per aumentare la sicurezza delle operazioni crittografiche relative al prodotto.</p>
			<p><b>Firma del Produttore:</b> Una firma digitale che certifica l'origine e l'autenticità del prodotto, collegando il prodotto al suo produttore o a chi ha inserito il prodotto.</p>
			<p><b>ID Unico (Random Secret):</b> Un identificativo aggiuntivo generato da un ulteriore algoritmo per ulteriori misure di sicurezza e di verifica.</p>
			<p><b>Hash della Transazione:</b> L'hash della transazione blockchain in cui il prodotto è stato registrato o aggiornato.</p>
			<p><b>Stato:</b> Lo stato attuale del prodotto nel sistema (es. attivo, in revisione, disattivato).</p>
			<p><b>Creato il e Aggiornato il:</b> Timestamp che indicano rispettivamente la creazione e l'ultima modifica del record del prodotto nel sistema.</p>
			<p>Funzionalità di Ricerca e Filtraggio: Anche se non esplicitamente menzionato nel codice fornito, l'aggiunta di funzionalità di ricerca e filtraggio potrebbe migliorare ulteriormente l'esperienza utente, permettendo agli utenti di trovare rapidamente specifici prodotti basandosi su vari criteri come il nome, lo stato, la data di creazione, ecc.</p>
			<p>Adattabilità e Scalabilità: La struttura della pagina è progettata per gestire un numero variabile di prodotti, adattandosi dinamicamente al carico di dati attraverso funzionalità di scrolling overflow, il che è essenziale per operazioni su larga scala.</p>
            <p>Sicurezza e Accesso ai Dati: Assicurati che le interazioni con l'API e i trasferimenti di dati siano protetti e che solo gli utenti autorizzati abbiano accesso alle informazioni sensibili.</p>
			<p>Questa pagina rappresenta un componente fondamentale dell'infrastruttura di monitoraggio e gestione del sistema, essendo vitale per il controllo qualità, la verifica dell'autenticità e la gestione generale dei prodotti all'interno del sistema di blockchain.</p>
		  </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
