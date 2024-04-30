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
            <button onClick={() => navigate('/producer-dashboard')} style={{ margin: '20px', padding: '10px' }}>Back to Dashboard</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>This is a simulation of the process of adding multiple products.</p>
                <p>Each product is generated with a unique ID and associated with an NFC public key.</p>
                <p>A digital signature from the manufacturer is required to ensure the authenticity of each added product.</p>
            </div>
        </div>
    );
};

export default AddMultipleProducts;
