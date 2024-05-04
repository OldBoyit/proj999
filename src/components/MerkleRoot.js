// src/components/MerkleRoot.js
//Da rivedere.Fare riferimento a MerkleRoot_in_test.js per l'utilizzo del Merkle Root
import { MerkleTree } from 'merkletreejs';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CryptoJS from 'crypto-js'; 
import { contractAddress, contractABI } from '../config/contractConfig';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Fetch functions
async function fetchAvailableKeys() {
    const response = await fetch('/.netlify/functions/availableKeys');
    const data = await response.json();
    return data;
}

async function fetchDigitalSignatures() {
    const response = await fetch('/.netlify/functions/fetchDigitalSignatures');
    if (!response.ok) {
        throw new Error('Failed to fetch digital signatures');
    }
    const data = await response.json();
    return data.map(sig => ({ id: sig._id, signature: sig.signatureData }));
}

const AddMultipleProducts = () => {
    const navigate = useNavigate();
    const [digitalSignatures, setDigitalSignatures] = useState([]);
    const [availableKeys, setAvailableKeys] = useState([]);
    const [numberOfProducts, setNumberOfProducts] = useState(1);
    const [products, setProducts] = useState([]);
    const [manufacturerSignature, setManufacturerSignature] = useState('');
    const [productName, setProductName] = useState("");

    // Initial data fetching
    useEffect(() => {
        const getKeysAndSignatures = async () => {
            const keysData = await fetchAvailableKeys();
            const signaturesData = await fetchDigitalSignatures();
            setAvailableKeys(keysData);
            setDigitalSignatures(signaturesData);
        };
        getKeysAndSignatures();
    }, []);

    // Handle product data updates
    useEffect(() => {
        setProducts(Array.from({ length: numberOfProducts }, (_, i) => ({
            productId: uuidv4(),
            name: productName,
            publicKey: availableKeys[i]?.publicKey || '',
            secret: CryptoJS.lib.WordArray.random(16).toString(),
            seed: Math.floor(Math.random() * 900 + 100).toString(),
            manufacturerSignature: manufacturerSignature || 'default_signature_id',
            randomSecret: CryptoJS.lib.WordArray.random(8).toString(),
            transactionHash: 'Pending'
        })));
    }, [numberOfProducts, productName, manufacturerSignature, availableKeys, digitalSignatures]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        // further implementation for submitting products...
    };

    return (
        <div>
            <h2>Create Multiple Products</h2>
            <form onSubmit={handleSubmit}>
                <label>Product Name:
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                </label>
                <label>Number of products to create:
                    <input type="number" value={numberOfProducts} onChange={(e) => setNumberOfProducts(Math.min(e.target.value, availableKeys.length))} min="1" max={availableKeys.length} />
                </label>
                <label>Manufacturer Signature:
                    <select value={manufacturerSignature} onChange={(e) => setManufacturerSignature(e.target.value)} required>
                        <option value="">Select a Signature</option>
                        {digitalSignatures.map(sig => (
                            <option key={sig.id} value={sig.id}>{sig.id}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Add Products</button>
            </form>
            <div>Available Keys: {availableKeys.length}</div>
            {products.map((product, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <span><strong>Product Name:</strong> {product.name}</span>
                    <span><strong>ID Unico:</strong> {product.productId}</span>
                    <span><strong>Public Key NFC:</strong> {product.publicKey}</span>
                    <span><strong>Seed:</strong> {product.seed}</span>
                    <span><strong>Random Secret:</strong> {product.randomSecret}</span>
                    <span><strong>Manufacturer Signature:</strong> {product.manufacturerSignature}</span>
                    <span><strong>Key Challenge-Response:</strong> {product.secret}</span>
                    <span><strong>Transaction Hash:</strong> {product.transactionHash}</span>
                </div>
            ))}
            <button onClick={() => navigate('/producer-dashboard')} style={{ margin: '20px', padding: '10px' }}>Torna alla Dashboard</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
		<p>La pagina MerkleRoot del progetto implementa un metodo avanzato per la creazione e la registrazione di più prodotti utilizzando la struttura dati del Merkle Tree. Questo approccio è particolarmente efficace nel ridurre i costi di transazione e allo stesso tempo garantire l'unicità e la verificabilità di ogni singolo prodotto sulla blockchain. Utilizzando algoritmi di hashing come keccak256, la pagina genera un hash radice (Merkle Root) che rappresenta l'intero set di prodotti in una singola transazione, anziché richiedere una transazione separata per ogni prodotto.</p>
		<p>Differenza rispetto alla Creazione di Prodotti Multipli Tradizionale:</p>
		<p>Efficienza di Costo e Transazione: Invece di registrare ogni prodotto singolarmente sulla blockchain, che richiederebbe una transazione per ogni inserimento, l'uso di un Merkle Tree consente di aggregare i prodotti in un batch e di registrarli tutti insieme. Questo riduce significativamente i costi di gas associati alle transazioni sulla rete Ethereum.</p>
<p>Sicurezza e Integrità dei Dati: Utilizzando hash crittografici, ogni prodotto è univocamente rappresentato e verificabile tramite il Merkle Root. Anche se i dati di un singolo prodotto non sono immessi direttamente sulla blockchain, la loro integrità è garantita dal Merkle Root e può essere verificata individualmente senza necessità di recuperare l'intero set di dati.</p>
<p>Vantaggi di Utilizzo del Merkle Root nel Contesto Blockchain:</p>
<p>Diminuzione dei Costi: Ogni transazione su Ethereum richiede gas; aggregare più prodotti in una singola transazione può ridurre notevolmente i costi.</p>
<p>Aumento dell'Efficienza: Registra grandi volumi di prodotti più rapidamente senza sacrificare la sicurezza o l'auditabilità.</p>
<p>Verificabilità: Ogni prodotto, nonostante non sia immesso singolarmente nella blockchain, rimane completamente verificabile attraverso il Merkle Root, assicurando che i dati non siano stati alterati post-registrazione.</p>
<p>Questa implementazione di Merkle Tree nel contesto della registrazione di prodotti sulla blockchain rappresenta un'eccellente dimostrazione di come le tecniche avanzate di crittografia e le strutture dati possono essere sfruttate per ottimizzare e sicurizzare le applicazioni distribuite su larga scala.</p>
</div>

        </div>
    );
};

export default AddMultipleProducts;
