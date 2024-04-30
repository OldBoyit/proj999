import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AvailableKeysPage.css';

function AvailableKeysPage() {
    const navigate = useNavigate();
    const [keys, setKeys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const keysPerPage = 6;

    useEffect(() => {
        fetch('/.netlify/functions/availableKeys')
            .then(response => {
                console.log("Full response received:", response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data received:", data);
                setKeys(data);
            })
            .catch(error => console.error('Error fetching available keys:', error));
    }, []);

    const indexOfLastKey = currentPage * keysPerPage;
    const indexOfFirstKey = indexOfLastKey - keysPerPage;
    const currentKeys = keys.slice(indexOfFirstKey, indexOfLastKey);

    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : 1);
    };

    return (
        <div className="available-keys-container">
            <h1>Chiavi Disponibili</h1>
            <p>Numero di chiavi disponibili: {keys.length}</p>
            <div className="keys-grid">
                {currentKeys.length > 0 ? (
                    currentKeys.map((key, index) => (
                        <div key={index} className="key-item">
                            <p>Chiave Pubblica:</p>
                            <p>{key.publicKey}</p>
                        </div>
                    ))
                ) : (
                    <p>Nessuna chiave disponibile.</p>
                )}
            </div>
            <div className="navigation-button">
                {currentPage > 1 && (
                    <button onClick={prevPage} className="page-button">
                        Pagina Precedente
                    </button>
                )}
                {currentPage * keysPerPage < keys.length && (
                    <button onClick={nextPage} className="page-button">
                        Pagina Successiva
                    </button>
                )}
                <button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">
                    Dashboard del Produttore
                </button>
        </div>
        <div className="page-description">
            <p>
                Questa pagina mostra le chiavi pubbliche NFC che sono attualmente disponibili e non ancora associate a prodotti. Ogni chiave pubblica elencata qui può essere utilizzata per garantire l'autenticità di un prodotto attraverso l'interazione con dispositivi mobili compatibili con NFC. Questi dati sono gestiti con la massima sicurezza per assicurare che solo i produttori autorizzati possano accedere e utilizzare le chiavi per i loro prodotti, rafforzando ulteriormente la sicurezza e la tracciabilità del Made in Italy nel mercato globale.
            </p>
        </div>
    </div>
);
}

export default AvailableKeysPage;
