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
            <button onClick={goToHomePage}>Torna alla Home</button>  {/* Nuovo bottone per tornare alla home */}
        </div>
    );
}

export default AdminDashboard;
