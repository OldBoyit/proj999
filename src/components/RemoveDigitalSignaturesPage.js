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
                // Assicurati di aggiornare questo URL per usare la funzione serverless corretta
                const response = await fetch('/.netlify/functions/fetchDigitalSignatures');
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

    const handleRemoveSignatures = () => {
        alert("Funzione temporaneamente disabilitata dall'Admin.");
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
                <center><p>. Questa pagina permette agli amministratori di rimuovere firme digitali esistenti, un processo importante per mantenere l'integrità e la sicurezza del sistema. La rimozione periodica o la sostituzione di firme digitali è una pratica raccomandata per prevenire abusi e garantire che solo gli utenti attuali e autorizzati possano registrare prodotti.</p>
				<p>Caratteristiche principali della pagina </p>
				<p>Visualizzazione e Selezione delle Firme:</p>
				<p>Le firme digitali vengono caricate e visualizzate tramite una chiamata API, permettendo agli amministratori di visualizzarle facilmente.</p>
				<p>Ogni firma può essere selezionata tramite una casella di controllo associata, facilitando la selezione multipla per operazioni di rimozione batch.</p>
				<p>Gestione della Rimozione:</p>
				<p>Un pulsante dedicato permette di iniziare il processo di rimozione delle firme selezionate. Attualmente, questa funzionalità è disabilitata per precauzione, mostrando un messaggio di alert quando tentata, per prevenire rimozioni accidentali o non autorizzate.</p>
				<p>Sicurezza e Controllo di Accesso:</p>
				<p>La possibilità di rimuovere firme digitali è una funzione potente che può influenzare l'accesso e i privilegi degli utenti. Per questo, tipicamente, l'accesso a questa pagina è strettamente controllato e limitato agli amministratori o agli utenti con permessi elevati.</p>
				<p>Implicazioni della Rimozione di Firme Digitali:</p>
				<p>Rimuovendo una firma digitale, il creatore associato a quella firma non potrà più registrare nuovi prodotti fino a quando non viene creata e registrata una nuova firma. Questo meccanismo serve per rafforzare la sicurezza, assicurando che le credenziali siano sempre aggiornate e valide.</p>
				<p><b>La pratica di cambiare periodicamente le firme digitali è consigliata per ridurre il rischio di compromissione delle credenziali e per mantenere un alto livello di sicurezza all'interno dell'organizzazione.</b></p></center>
            </div>
        </div>
    );
}

export default RemoveDigitalSignaturesPage;
