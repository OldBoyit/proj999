// src/components/RemoveDigitalSignaturesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/RemoveDigitalSignaturesPage.css';

function RemoveDigitalSignaturesPage() {
    const [signatures, setSignatures] = useState([]);
    const [selectedSignatures, setSelectedSignatures] = useState([]);
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

    const handleCheckboxChange = (signatureId) => {
        const newSelectedSignatures = selectedSignatures.includes(signatureId)
            ? selectedSignatures.filter(id => id !== signatureId)
            : [...selectedSignatures, signatureId];
        setSelectedSignatures(newSelectedSignatures);
    };

    const handleRemoveSignatures = async () => {
        try {
            await Promise.all(selectedSignatures.map(signatureId =>
                fetch(`http://localhost:3001/api/digital-signatures/${signatureId}`, {
                    method: 'DELETE'
                })
            ));
            setSignatures(signatures.filter(signature => !selectedSignatures.includes(signature._id)));
            setSelectedSignatures([]);
            alert('Firme digitali rimosse con successo!');
        } catch (error) {
            console.error('Error removing signatures:', error);
            alert('Errore nella rimozione delle firme digitali.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.centeredBox}>
                <h1>Rimuovi Firme Digitali</h1>
                {signatures.length > 0 ? (
                    <div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            {signatures.map(signature => (
                                <div key={signature._id} className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSignatures.includes(signature._id)}
                                        onChange={() => handleCheckboxChange(signature._id)}
                                    />
                                    {signature.creator} - {signature.signatureData} - {new Date(signature.created).toLocaleString()}
                                </div>
                            ))}
                            <div className={styles.buttonContainer}>
                                <button type="button" onClick={handleRemoveSignatures}>Rimuovi Selezionate</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <p>Nessuna firma digitale registrata.</p>
                )}
                <button onClick={() => navigate('/producer-dashboard')} className={styles.dashboardButton}>Dashboard</button>
            </div>
            <div className={styles.exampleText}>
                <p>Testo di esempio aggiunto qui.</p>
            </div>
        </div>
    );
}

export default RemoveDigitalSignaturesPage;