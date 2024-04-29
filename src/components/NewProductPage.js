// src/components/NewProductPage.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../config/contractConfig';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import './css/NewProductPage.css';
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const [productData, setProductData] = useState({
    productId: '',
    name: '',
    publicKey: '',
    secret: '',
    seed: '',
    manufacturerSignature: '',
    randomSecret: ''
  });

  const [publicKeys, setPublicKeys] = useState([]);
  const [digitalSignatures, setDigitalSignatures] = useState([]);

  useEffect(() => {
    generateRandomData();
    fetchPublicKeys();
    fetchDigitalSignatures();
  }, []);

  const generateRandomData = () => {
    const productId = uuidv4();
    const secret = CryptoJS.lib.WordArray.random(16).toString();
    const seed = Math.floor(Math.random() * 900 + 100).toString();
    const randomSecret = CryptoJS.lib.WordArray.random(8).toString();

    setProductData(prevData => ({
      ...prevData,
      productId: productId,
      secret: secret,
      seed: seed,
      randomSecret: randomSecret
    }));
  };

  const fetchPublicKeys = () => {
    fetch('http://localhost:3001/api/keys/available') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setPublicKeys(data))
        .catch(error => console.error('Error fetching public keys:', error));
  };

	const fetchDigitalSignatures = () => {
		fetch('http://localhost:3001/api/digital-signatures')
			.then(response => response.json())
			.then(data => {
				console.log("Fetched Digital Signatures:", data); // Check the structure here
				setDigitalSignatures(data);
			})
			.catch(error => console.error('Error fetching digital signatures:', error));
	};

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

	const updatePublicKeyStatus = async (publicKeyId) => {
	  fetch('http://localhost:3001/api/keys/mark-used', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ publicKeyId })
	  })
	  .then(response => {
		if (!response.ok) {
		  throw new Error('Network response was not ok while updating public key status');
		}
		console.log("Public key status updated successfully");
	  })
	  .catch(error => {
		console.error('Error updating public key status:', error);
	  });
	};

	const handleSubmit = async (e) => {
	  e.preventDefault();
	  if (!window.ethereum) {
		alert('Ethereum object not found, install MetaMask.');
		return;
	  }

	  const web3 = new Web3(window.ethereum);
	  const productContract = new web3.eth.Contract(contractABI, contractAddress);
	  const accounts = await web3.eth.getAccounts();

	  const publicKeyBytes = web3.utils.hexToBytes(productData.publicKey);
	  const secretBytes32 = web3.utils.asciiToHex(productData.secret);
	  const formattedSecretBytes32 = web3.utils.padRight(secretBytes32, 66).substring(0, 66);

	  const randomSecretBytes32 = web3.utils.asciiToHex(productData.randomSecret);
	  const formattedRandomSecretBytes32 = web3.utils.padRight(randomSecretBytes32, 66).substring(0, 66);

	  try {
		const response = await productContract.methods.addProduct(
		  productData.name,
		  publicKeyBytes,
		  formattedSecretBytes32,
		  productData.manufacturerSignature,
		  formattedRandomSecretBytes32
		).send({ from: accounts[0] });

		const transactionHash = response.transactionHash;

		const saveData = {
		  ...productData,
		  transactionHash: response.transactionHash,
		  producer: productData.manufacturerSignature,  // Mappa manufacturerSignature a producer
		  certification: productData.randomSecret  // Mappa randomSecret a certification
		};

		await saveProductDetails(saveData);  // Assicurati che questa funzione sia implementata correttamente

		updatePublicKeyStatus(productData.publicKey);
		generateRandomData();

		alert('Prodotto aggiunto con successo!');

	  } catch (error) {
		console.error("Errore nell'aggiungere il prodotto: ", error);
		alert('Errore nell\'aggiungere il prodotto: ' + error.message);
	  }
	};

	// Function to save product details to MongoDB
	const saveProductDetails = async (productDetails) => {
	  try {
		const response = await fetch('http://localhost:3001/api/products/save', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			productId: productDetails.productId,
			name: productDetails.name,
			publicKey: productDetails.publicKey,
			secret: productDetails.secret,
			seed: productDetails.seed,
			manufacturerSignature: productDetails.manufacturerSignature,
			randomSecret: productDetails.randomSecret,
			transactionHash: productDetails.transactionHash,
			status: 'attivo' // Assuming this is default and always 'attivo'
		  })
		});
		const responseData = await response.json();
		if (!response.ok) throw new Error(responseData.message);
		console.log('Product details saved:', responseData);
	  } catch (error) {
		console.error('Error saving product details:', error);
	  }
	};

	const navigate = useNavigate();

	return (
	  <div>
		<h2>Aggiungi Prodotto</h2>
		<form onSubmit={handleSubmit}>
		  <label>Nome del prodotto:</label>
		  <input type="text" name="name" value={productData.name} onChange={handleInputChange} required />
		  <div style={{ marginBottom: '30px' }}>Nome del prodotto</div>

		  <label>Chiave pubblica NFC:</label>
		  <select name="publicKey" value={productData.publicKey} onChange={handleInputChange} required>
			<option value="">Select a Public Key</option>
			{publicKeys.map((key, index) => (
			  <option key={index} value={key._id}>
				{key.publicKey}
			  </option>
			))}
		  </select>
		  <div style={{ marginBottom: '30px' }}>PublicKey NFC (pre-caricata)</div>

		  <label>Firma del produttore:</label>
		  <select name="manufacturerSignature" value={productData.manufacturerSignature} onChange={handleInputChange} required>
			<option value="">Select a Manufacturer Signature</option>
			{digitalSignatures.map((signature) => (
			  <option key={signature._id} value={signature._id}>
				{signature._id}
			  </option>
			))}
		  </select>
		  <div style={{ marginBottom: '30px' }}>Utilizzata per confermare l'autenticità del prodotto e del produttore, verificabile attraverso la blockchain.</div>

		  <button type="submit">Aggiungi Prodotto</button>
		</form>

		<div style={{ marginTop: '40px' }}>
		  <h3>Dettagli del Prodotto Corrente</h3>
		  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
			<span><strong>Nome Prodotto:</strong> {productData.name}</span>
			<span><strong>ID Unico:</strong> {productData.productId}</span>         
			<span><strong>Chiave Pubblica NFC:</strong> {productData.publicKey}</span>
			<span><strong>Seed:</strong> {productData.seed}</span>
			<span><strong>Random Secret:</strong> {productData.randomSecret}</span>
			<span><strong>Firma del Produttore:</strong> {productData.manufacturerSignature}</span>         
			<span><strong>Chiave di Sfida-Risposta:</strong> {productData.secret}</span>
			<span><strong>Hash della Transazione:</strong> {productData.transactionHash}</span>
		  </div>
		</div>

		{/* Bottone per tornare alla dashboard */}
		<div style={{ marginTop: '20px', textAlign: 'center' }}>
		  <button onClick={() => navigate('/producer-dashboard')} className="dashboard-button">Dashboard</button>
		</div>
	
		{/* Testo di esempio */}
		<div className="example-text">
		  <p>Testo di esempio aggiunto qui.</p>
		</div>
	  </div>
);

};

export default ProductForm;