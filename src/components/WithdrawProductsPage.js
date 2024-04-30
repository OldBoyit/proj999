import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/withdrawalproducts.css';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(prevSelectedProducts => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter(id => id !== productId);
      } else {
        return [...prevSelectedProducts, productId];
      }
    });
  };

  const handleWithdrawProduct = () => {
    // Implementa qui la logica per ritirare i prodotti selezionati
    // Puoi utilizzare la lista di productId in selectedProducts per inviare una richiesta al server
    // E mostrare il popup "Prodotto ritirato con successo" dopo aver completato l'operazione
    alert('Prodotto/i ritirato/i con successo');
  };

  const handleDashboardClick = () => {
    navigate('/producer-dashboard');
  };

  return (
    <div className={styles.container}>
      <h1>Ritira ed invalida autenticità prodotti</h1>
      <button onClick={handleDashboardClick} className={styles.dashboardButton}>Torna alla Dashboard</button>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Nome Prodotto</th>
              <th>Stato</th>
              <th>Seleziona</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className={styles.tr}>
                <td>{product._id}</td>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.status}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleCheckboxChange(product._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleWithdrawProduct} className={styles.withdrawButton}>Ritira Prodotto</button>

      <div className={styles.exampleText}>
        <center><p>Caratteristiche principali della pagina </p>
<p>Visualizzazione dei Prodotti: I prodotti attivi vengono caricati e visualizzati in una tabella che include dettagli critici come ID, Product ID, Nome del Prodotto e Stato. Questa visualizzazione permette agli utenti di avere una panoramica chiara dei prodotti disponibili per il ritiro.</p>	
<p>Selezione dei Prodotti: Gli utenti possono selezionare uno o più prodotti per il ritiro utilizzando le caselle di controllo associate a ogni voce nella tabella. La logica di selezione è gestita dinamicamente per aggiungere o rimuovere prodotti dall'elenco dei prodotti selezionati, basandosi sulle azioni dell'utente.</p>	
<p>Funzionalità di Ritiro dei Prodotti: Una volta che gli utenti hanno selezionato i prodotti desiderati, possono utilizzare il pulsante "Ritira Prodotto" per iniziare il processo di ritiro. Questo pulsante attiva un'azione che potrebbe, ad esempio, inviare una richiesta al server per aggiornare lo stato dei prodotti come ritirati, eliminati o disattivati.</p>	
<p>Importante:</p>	
<p>Un prodotto ritirato non sarà più considerato come autentico, e fallirà nelle successive verifiche.</p>	
<p><b>Questo sistema offre anche una protezione contro i furti dei prodotti. Se un prodotto non è più di proprietà legittima, perderà il valore aggiunto dell'originalità e, di conseguenza, il suo valore commerciale diminuirà. Questo agisce come un disincentivo sia per il furto sia per la rivendita illecita.</b></p></center>		
      </div>
    </div>
  );
};

export default ViewProductsPage;
