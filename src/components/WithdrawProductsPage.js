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
      <h1>Prodotti Attivi</h1>
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
        <p>Testo di esempio aggiunto qui.</p>
      </div>
    </div>
  );
};

export default ViewProductsPage;
