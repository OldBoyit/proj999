import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ViewAssignedKeysPage.css';

function ViewAssignedKeys() {
    const navigate = useNavigate();
    const [keys, setKeys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const keysPerPage = 5;  // Cambiato da 6 a 5 per mostrare 5 chiavi per pagina

    useEffect(() => {
        fetch('/.netlify/functions/assignedKeys')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setKeys(data);
            })
            .catch(error => console.error('Failed to fetch assigned keys:', error));
    }, []);

    const indexOfLastKey = currentPage * keysPerPage;
    const indexOfFirstKey = indexOfLastKey - keysPerPage;
    const currentKeys = keys.slice(indexOfFirstKey, indexOfLastKey);

    const nextPage = () => {
        if (currentPage * keysPerPage < keys.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="assigned-keys-container">
            <h1>Chiavi Assegnate</h1>
            {keys.length > 0 ? (
                <ul className="key-list">
                {currentKeys.map((key) => (
                    <li key={key._id} className="key-item">
                        <p>Chiave Pubblica: {key.publicKey}</p>
                        <p>Chiave Privata: {key.privateKey}</p>
                        <p>Stato: {key.status}</p>
                        <p>Attiva: {key.isActive ? 'Sì' : 'No'}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p>Nessuna chiave assegnata.</p>
            )}
            <div className="navigation-buttons">
                {currentPage > 1 && (
                    <button onClick={prevPage} className="page-button">Pagina Precedente</button>
                )}
                {currentPage * keysPerPage < keys.length && (
                    <button onClick={nextPage} className="page-button">Pagina Successiva</button>
                )}
			<div className="page-description">
				<p>
					Questa pagina mostra le chiavi NFC assegnate ai prodotti. Ogni chiave elencata qui è già stata utilizzata per autenticare un prodotto specifico nel nostro sistema di tracciabilità. Le chiavi "Attiva" indicano che i prodotti associati non sono stati segnalati come contraffatti e continuano a essere validi e sicuri per l'uso nel mercato.
				</p>
				<p>
					La visibilità di chiavi pubbliche e private in questa pagina aiuta a mantenere la trasparenza e permette una gestione efficace del processo di autenticazione. È essenziale per assicurare che solo prodotti autentici siano circolanti, rafforzando così la fiducia dei clienti.
				</p>
			</div>
		</div>
	);
}

export default ViewAssignedKeys;
