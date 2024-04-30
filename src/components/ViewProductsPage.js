import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/ViewProductPage.css';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
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

      <div style={{ overflowX: 'auto' }}> {/* Ensures the table is scrollable */}
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
		<div className={styles.exampleText}>
			<p>Questa visualizzazione è cruciale per la gestione e il monitoraggio dei prodotti, permettendo agli utenti autorizzati (produttori) di accedere facilmente a tutte le informazioni rilevanti riguardanti ogni singolo prodotto registrato. L'interfaccia utente è costruita per supportare la trasparenza e facilitare l'audit dei prodotti in tempo reale.</p>
			<p>Principali Caratteristiche della Pagina:</p>
			<p>Visualizzazione Completa dei Dati: La pagina mostra un'ampia gamma di dati per ogni prodotto, includendo:</p>
			<ul>
				<li>ID e Product ID: Identificativi unici per riferimenti interni e tracciabilità.</li>
				<li>Nome Prodotto: Il nome commerciale del prodotto.</li>
				<li>PublicKey NFC: La chiave pubblica NFC usata per l'interazione sicura e l'identificazione del prodotto.</li>
				<li>Key Challenge-Response: Una chiave usata in un sistema di sicurezza per verificare l'integrità e l'autenticità del prodotto.</li>
				<li>Seed: Un valore generato casualmente usato per aumentare la sicurezza delle operazioni crittografiche relative al prodotto.</li>
				<li>Firma del Produttore: Una firma digitale che certifica l'origine e l'autenticità del prodotto, collegando il prodotto al suo produttore o a chi ha inserito il prodotto.</li>
				<li>ID Unico (Random Secret): Un identificativo aggiuntivo generato casualmente per ulteriori misure di sicurezza e di verifica.</li>
				<li>Hash della Transazione: L'hash della transazione blockchain in cui il prodotto è stato registrato o aggiornato.</li>
				<li>Stato: Lo stato attuale del prodotto nel sistema (es. attivo, in revisione, disattivato).</li>
				<li>Creato il e Aggiornato il: Timestamp che indicano rispettivamente la creazione e l'ultima modifica del record del prodotto nel sistema.</li>
			</ul>
			<p>Funzionalità di Ricerca e Filtraggio: Anche se non esplicitamente menzionato nel codice fornito, l'aggiunta di funzionalità di ricerca e filtraggio potrebbe migliorare ulteriormente l'esperienza utente, permettendo agli utenti di trovare rapidamente specifici prodotti basandosi su vari criteri come il nome, lo stato, la data di creazione, ecc.</p>
			<p>Adattabilità e Scalabilità: La struttura della pagina è progettata per gestire un numero variabile di prodotti, adattandosi dinamicamente al carico di dati attraverso funzionalità di scrolling overflow, il che è essenziale per operazioni su larga scala.</p>
			<p>Sicurezza e Accesso ai Dati: Assicurati che le interazioni con l'API e i trasferimenti di dati siano protetti e che solo gli utenti autorizzati abbiano accesso alle informazioni sensibili.</p>
			<p>Questa pagina rappresenta un componente fondamentale dell'infrastruttura di monitoraggio e gestione del sistema, essendo vitale per il controllo qualità, la verifica dell'autenticità e la gestione generale dei prodotti all'interno del sistema di blockchain.</p>
		</div>
    </div>
  );
};

export default ViewProductsPage;