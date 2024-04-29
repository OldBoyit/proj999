// src/components/ViewDigitalSignaturesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/ViewDigitalSignaturesPage.css';

function ViewDigitalSignaturesPage() {
  const [signatures, setSignatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/digital-signatures');
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
        <p>Testo di esempio aggiunto qui.</p>
      </div>
    </div>
  );
}

export default ViewDigitalSignaturesPage;
