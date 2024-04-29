import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/WithdrawProductsPage.css';

function WithdrawProductsPage() {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        navigate('/producer-dashboard');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ritira Prodotti</h1>
            <center><p className={styles.description}>Questa pagina permette di gestire il ritiro dei prodotti.</p></center>
            <center><button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">Dashboard</button></center>
            <div className={styles.exampleText}>
               <center> <p>Testo di esempio aggiunto qui.</p></center>
            </div>
        </div>
    );
}

export default WithdrawProductsPage;
