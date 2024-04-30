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
		fetch('/.netlify/functions/availableKeys')  // Modificata per puntare alla funzione Netlify
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
	  fetch('/.netlify/functions/fetchDigitalSignatures')
		.then(response => response.json())
		.then(data => {
		  console.log("Fetched Digital Signatures:", data); // Controlla la struttura qui
		  setDigitalSignatures(data);
		})
		.catch(error => console.error('Error fetching digital signatures:', error));
	};


  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

	const updatePublicKeyStatus = async (publicKeyId) => {
	  fetch('/.netlify/functions/updatePublicKeyStatus', {
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
	  await window.ethereum.enable(); // Assicurati che l'utente abbia concesso l'accesso
	  const hardcodedAddress = "0x2CbE824d1E53a88A5Fa438871943A1bF8149949e";

	  const productContract = new web3.eth.Contract(contractABI, contractAddress);

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
		).send({ from: hardcodedAddress });

		const transactionHash = response.transactionHash;
		alert('Prodotto aggiunto con successo! Transaction Hash: ' + transactionHash);

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
		const response = await fetch('/.netlify/functions/saveProductDetails', {
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
		  <p>Questa pagina è specificamente progettata per l'aggiunta di un prodotto alla volta, differenziandosi da altre pagine dell'applicazione che possono gestire operazioni batch o multiple.

Funzionalità Principali:

Generazione di Dati Casuali: All'apertura della pagina, vengono generati automaticamente dati unici per il nuovo prodotto, come productId, secret, seed, e randomSecret. Questi elementi sono cruciali per garantire risposte uniche e sicure durante le verifiche di autenticità, rendendo ogni interazione sicura e non manipolabile.
Raccolta delle Chiavi Pubbliche e Firme Digitali: La pagina recupera da specifici endpoint API le chiavi pubbliche disponibili e le firme digitali del produttore. Questi dati sono essenziali per associare al prodotto una chiave pubblica NFC e una firma digitale, confermando così l'autenticità del prodotto e del produttore stesso.
Inserimento e Validazione dei Dati del Prodotto: L'utente inserisce i dati del prodotto come il nome, seleziona una chiave pubblica NFC e una firma digitale del produttore da liste pre-caricate. Queste selezioni sono obbligatorie per procedere con l'aggiunta del prodotto.</p>
		  <p>Registrazione del Prodotto su Blockchain: Tramite l'uso di Web3 e smart contracts sulla rete Ethereum, il prodotto viene registrato sulla blockchain. Le informazioni registrate includono l'ID del prodotto, la chiave pubblica NFC, il secret (criptato), la firma del produttore e il random secret. Questo passaggio assicura l'immutabilità e la tracciabilità dei dati.
Salvataggio dei Dettagli del Prodotto: Una volta che il prodotto è stato aggiunto con successo alla blockchain, i dettagli del prodotto vengono inviati a un altro endpoint API per essere salvati in un database MongoDB. Questo serve per un facile accesso e gestione dei dati al di fuori della blockchain.
Gestione dello Stato delle Chiavi Pubbliche: Dopo l'uso di una chiave pubblica, la pagina invia una richiesta per aggiornare lo stato della chiave come utilizzata, prevenendo il suo riutilizzo in operazioni future.
Interfaccia Utente e Navigazione: La pagina offre un'interfaccia chiara e diretta per inserire i dettagli del prodotto, visualizzare le informazioni correnti del prodotto generato, e navigare facilmente verso altre sezioni dell'applicazione, come la dashboard del produttore.</p>
		</div>
	  </div>
);

};

export default ProductForm;
