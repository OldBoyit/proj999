// src/components/UploadNFCKeysPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { addKey, assignKey } from '../services/keyService';
import './css/UploadNFCKeysPage.css';

function UploadNFCKeysPage() {
    const navigate = useNavigate();
    const [keys, setKeys] = useState([]);
    const [numKeys, setNumKeys] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const generateAndUploadKeys = async () => {
        setLoading(true);
        const newKeys = [];
        for (let i = 0; i < numKeys; i++) {
            const wallet = ethers.Wallet.createRandom();
            const keyData = {
                publicKey: wallet.address,
                privateKey: wallet.privateKey,
                status: 'disponibile'
            };
            newKeys.push(keyData);
            try {
                const response = await addKey(keyData.publicKey, keyData.privateKey);
                console.log("Key uploaded successfully:", response);
            } catch (error) {
                console.error("Failed to upload key:", error);
                setMessage(prev => prev + `\nFailed to upload key ${wallet.address}: ${error.toString()}`);
            }
        }
        setKeys(prevKeys => [...prevKeys, ...newKeys]);
        setLoading(false);
    };

    const handleAssignKey = async (index, productId) => {
        setLoading(true);
        const newKeys = [...keys];
        newKeys[index].status = 'assegnato';
        newKeys[index].productId = productId; // Ensure productId is provided when function is called
        setKeys(newKeys);
        try {
            await assignKey(newKeys[index].publicKey, productId);
            console.log("Key assigned successfully:", newKeys[index]);
            setMessage(`Key ${newKeys[index].publicKey} assigned successfully.`);
        } catch (error) {
            console.error("Failed to assign key:", error);
            setMessage(`Failed to assign key ${newKeys[index].publicKey}: ${error.message}`);
        }
        setLoading(false);
    };

    const renderKeys = () => {
        return keys.map((key, index) => (
            <div key={index} className="key-info">
                <p>Public Key: {key.publicKey}</p>
                <p>Private Key: {key.privateKey}</p>
                <p>Status: {key.status}</p>
            </div>
        ));
    };

    return (
        <div className="upload-keys-container">
            <h1>Upload NFC Keys</h1>
            <div className="num-keys-input">
                <input
                    type="number"
                    value={numKeys}
                    onChange={e => setNumKeys(parseInt(e.target.value, 10))}
                />
            </div>
            <button onClick={generateAndUploadKeys} disabled={loading} className="generate-button">
                {loading ? 'Generating...' : 'Generate and Upload Keys'}
            </button>
            <div className="keys-list">
                {renderKeys()}
            </div>
            <div className="additional-info">
                <p>Per tornare alla DashBoard Produttore premere il tasto sotto</p>
                <button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">Dashboard</button>
            </div>
            {/* Descrizione sotto il box */}
            <div className="page-description">
                <p>
                    Questa pagina consente ai produttori di generare e caricare chiavi NFC in modo sicuro. Utilizzando strumenti all'avanguardia, possiamo garantire la sicurezza e la tracciabilità di ogni prodotto.
                </p>
            </div>
        </div>
    );
}

export default UploadNFCKeysPage;
