import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/ViewProductPage.css';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/products/active')
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

      <div className={styles.exampleText}>
        <p>Testo di esempio aggiunto qui.</p>
      </div>
    </div>
  );
};

export default ViewProductsPage;
