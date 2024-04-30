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
		<div className={styles.container}>
			<h1>Visualizza Firme Digitali</h1>
			<div className={styles.centeredBox}> {/* Assume centeredBox has text-align: center */}
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
					<p>Caratteristiche principali della pagina</p>   
					<p>Caricamento e Visualizzazione delle Firme...</p>  
					<p>Utilizza una chiamata API per recuperare le firme digitali...</p>
					<p>Interfaccia Tabellare per la Visualizzazione dei Dati...</p>
				</div>
			</div>
		</div>

  );
};

export default ViewProductsPage;