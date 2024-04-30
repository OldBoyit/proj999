// src/components/MerkleRoot.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../config/contractConfig';
import { v4 as uuidv4 } from 'uuid';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'js-sha3';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

window.Buffer = Buffer;  

const web3 = new Web3(window.ethereum);

// Function to initialize Web3
function getWeb3() {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    resolve(web3);
                } catch (error) {
                    reject('User denied account access.');
                }
            } else if (window.web3) {
                // Legacy dapp browsers...
                console.log('Injected web3 detected.');
                resolve(new Web3(window.web3.currentProvider));
            } else {
                // Fallback to localhost; use dev console port by default...
                const provider = new Web3.providers.HttpProvider(
                    'http://127.0.0.1:9545'
                );
                console.log('No web3 instance injected, using Local web3.');
                resolve(new Web3(provider));
            }
        });
    });
}

// Use the function in your component or app initialization logic
getWeb3().then((web3) => {
    console.log("Web3 initialized!");
    // Your web3 is ready and you can use it for your calls
}).catch((error) => {
    console.error("Error in Web3 initialization:", error);
});

async function fetchAvailableKeys() {
    console.log("Fetching available keys");
    try {
        const response = await fetch('/.netlify/functions/availableKeys');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Available keys fetched:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch available keys:", error);
        return []; // Returning empty array on failure for safety
    }
}


async function fetchDigitalSignatures() {
    try {
        const response = await fetch('/.netlify/functions/fetchDigitalSignatures');
        if (!response.ok) {
            console.error(`Failed to fetch with status: ${response.status}, url: ${response.url}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.map(sig => ({ id: sig._id, signature: sig.signatureData }));
    } catch (error) {
        console.error("Failed to fetch digital signatures: ", error);
        // Depending on the failure, you might want to handle it differently
        // Example: Re-throw the error, or handle it gracefully in the UI
        throw error;
    }
}

const AddMultipleProducts = () => {
	const navigate = useNavigate();
    const [digitalSignatures, setDigitalSignatures] = useState([]);
    const [availableKeys, setAvailableKeys] = useState([]);
    const [numberOfProducts, setNumberOfProducts] = useState(1);
    const [products, setProducts] = useState([]);
    const [manufacturerSignature, setManufacturerSignature] = useState('default_signature_id');
    const [productName, setProductName] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [productContract, setProductContract] = useState(null);
    const [rootHash, setRootHash] = useState(''); 

    useEffect(() => {
        const init = async () => {
            const web3 = new Web3(window.ethereum);
            const accountsFromWeb3 = await web3.eth.requestAccounts();
            if (accountsFromWeb3.length === 0) {
                console.error("No accounts found. Please connect to MetaMask.");
                return;
            }
            const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
            setProductContract(contractInstance);
            setAccounts(accountsFromWeb3);
            setAvailableKeys(await fetchAvailableKeys());
            setDigitalSignatures(await fetchDigitalSignatures());
        };
        init();
    }, []);

	useEffect(() => {
		if (availableKeys.length >= numberOfProducts && productName && manufacturerSignature && digitalSignatures.length > 0) {
			const newProducts = Array.from({ length: numberOfProducts }, (_, i) => ({
				productId: uuidv4(),
				name: productName,
				publicKey: availableKeys[i]?.publicKey,
				secret: CryptoJS.lib.WordArray.random(16).toString(),
				seed: Math.floor(Math.random() * 900 + 100).toString(),
				manufacturerSignature: manufacturerSignature,
				randomSecret: CryptoJS.lib.WordArray.random(8).toString(),
				transactionHash: 'Pending'
			}));
			setProducts(newProducts);
		}
	}, [numberOfProducts, productName, manufacturerSignature, availableKeys, digitalSignatures]);
	

    const saveProductDetails = async (product) => {
        try {
            const response = await fetch('/.netlify/functions/saveProductDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...product,
                    merkleRoot: rootHash, // Use the state variable
                    status: 'active'
                })
            });
            if (!response.ok) throw new Error('Failed to save product details');
            console.log('Product details saved:', await response.json());
        } catch (error) {
            console.error('Error saving product details:', error);
        }
    };

const [showPopup, setShowPopup] = useState(false);
const [popupMessage, setPopupMessage] = useState("");
		
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Verifica che products sia un array e non vuoto
		if (!Array.isArray(products) || products.length === 0) {
			console.error("Products is not an array or is empty");
			return;
		}

		let leaves = products.map(product => {
			// Assicurati che publicKey sia nel formato esadecimale corretto.
			const publicKeyHex = product.publicKey.startsWith('0x') ? product.publicKey : `0x${product.publicKey}`;

			// Prepara gli altri dati.
			const nameHex = web3.utils.utf8ToHex(product.name);
			const secretHex = web3.utils.keccak256(web3.utils.utf8ToHex(product.secret));
			const randomSecretHex = web3.utils.keccak256(web3.utils.utf8ToHex(product.randomSecret));

			// Assicurati che someByteField sia un array non vuoto.
			if (!Array.isArray(product.someByteField) || product.someByteField.length === 0) {
				console.error("someByteField is not an array or is empty");
				return null; // oppure gestisci come preferisci, forse con un valore predefinito.
			}

			const byteData = product.someByteField;
			const byteString = '0x' + byteData.map(byte => byte.toString(16).padStart(2, '0')).join('');

			// Usa web3.utils.soliditySha3 per creare l'hash.
			const hash = web3.utils.soliditySha3(
				{ type: 'string', value: nameHex },
				{ type: 'string', value: publicKeyHex },
				{ type: 'bytes32', value: secretHex },
				{ type: 'string', value: product.manufacturerSignature },
				{ type: 'bytes32', value: randomSecretHex },
				{ type: 'bytes', value: byteString }
			);
			return hash;
		});

		// Rimuovi gli elementi nulli da leaves se necessario.
		leaves = leaves.filter(leaf => leaf !== null);

		console.log("Leaves for tree:", leaves);

		const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
		const rootHash = tree.getRoot().toString('hex');
		setRootHash(rootHash);

		// Verifica l'esistenza di ogni hash prima della registrazione
		for (let leaf of leaves) {
			const exists = await productContract.methods.productExists(leaf).call();
			if (!exists) {
				console.error("Product with hash does not exist:", leaf);
				return; // Interrompi se un prodotto non esiste
			}
		}

		// Registra il batch di prodotti
		try {
			const transactionResponse = await productContract.methods.registerProductBatch(leaves).send({
				from: accounts[0],
				gasPrice: web3.utils.toWei('20', 'gwei')
			});

			if (transactionResponse.status) {
				console.log('Batch registration successful with Merkle root:', rootHash);
				setPopupMessage(`Registrazione del batch completata con successo con Merkle Root: ${rootHash}`);
				setShowPopup(true);
			} else {
				console.error('Batch registration failed');
			}
		} catch (error) {
			console.error('Error during batch registration:', error);
		}
	};


    return (
        <div>
            <h2>Create Products Using Merkle Root</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Product Name:
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        placeholder="Enter product name"
                    />
                </label>
                <label>
                    Number of products to create:
                    <input
                        type="number"
                        value={numberOfProducts}
                        onChange={(e) => setNumberOfProducts(Math.min(e.target.value, availableKeys.length))}
                        min="1"
                        max={availableKeys.length}
                    />
                </label>
                <label>
                    Manufacturer Signature:
                    <select
                        value={manufacturerSignature}
                        onChange={(e) => setManufacturerSignature(e.target.value)}
                        required
                    >
                        <option value="">Select a Signature</option>
                        {digitalSignatures.map(sig => (
                            <option key={sig.id} value={sig.id}>{sig.id}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Add Products</button>
            </form>
			{showPopup && (
				<div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '1px solid black', padding: '20px', zIndex: 100 }}>
					<p>{popupMessage}</p>
					<button onClick={() => setShowPopup(false)}>Chiudi</button>
				</div>
			)}			
            <div>Available Keys: {availableKeys.length}</div>
            {products.map((product, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <span style={{flexGrow: 1}}><strong>Product {index + 1} Name:</strong> {product.name}</span>
                    <span style={{flexGrow: 1}}><strong>ID Unico:</strong> {product.productId}</span>
                    <span style={{flexGrow: 1}}><strong>Public Key NFC:</strong> {product.publicKey}</span>
                    <span style={{flexGrow: 1}}><strong>Seed:</strong> {product.seed}</span>
                    <span style={{flexGrow: 1}}><strong>Random Secret:</strong> {product.randomSecret}</span>
                    <span style={{flexGrow: 1}}><strong>Manufacturer Signature:</strong> {product.manufacturerSignature}</span>
                    <span style={{flexGrow: 1}}><strong>Key Challenge-Response:</strong> {product.secret}</span>
                    <span style={{flexGrow: 1}}><strong>Transaction Hash:</strong> {product.transactionHash}</span>
                </div>
            ))}
            <button onClick={() => navigate('/producer-dashboard')} style={{ margin: '20px', padding: '10px' }}>Torna alla Dashboard</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
		<p>Esempio di testo: Questa è una simulazione del processo di aggiunta di più prodotti.</p>
		<p>Per ogni prodotto viene generato un ID unico e associato a una chiave pubblica NFC.</p>
		<p>Una firma digitale del produttore è richiesta per garantire l'autenticità di ogni prodotto aggiunto.</p>
</div>

        </div>
    );
};

export default AddMultipleProducts;
