// src/components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();

    const goToProducerDeletionPage = () => {
        navigate('/delete-producer');
    };

    const goToProducerRegistrationPage = () => {
        navigate('/producer-register');
    };

    const goToProducersListPage = () => {
        navigate('/producers-list');  // Assicurati che il percorso sia definito nel tuo router
    };

    return (
        <div>
            <h1>Dashboard Admin</h1>
            <button onClick={goToProducerRegistrationPage}>Crea nuovo Produttore</button>
            <button onClick={goToProducerDeletionPage}>Elimina Produttore</button>
            <button onClick={goToProducersListPage}>Visualizza Produttori</button>  {/* Nuovo pulsante aggiunto */}
            <div style={{ marginTop: '20px' }}>
                <h2>Descrizione delle Funzionalità</h2>
                <p>Questa è la dashboard dell'amministratore. Da qui, puoi gestire i produttori all'interno del sistema:</p>
                <ul>
                    <li><strong>Crea nuovo Produttore:</strong> Registra un nuovo produttore nel sistema, permettendo loro di inserire i propri prodotti.</li>
                    <li><strong>Elimina Produttore:</strong> Rimuovi uno o più produttori dal sistema. Utilizza questa funzione con cautela per evitare la rimozione accidentale di produttori attivi.</li>
                    <li><strong>Visualizza Produttori:</strong> Mostra un elenco di tutti i produttori registrati, fornendo una panoramica completa sulle loro attività e dettagli.</li>
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
