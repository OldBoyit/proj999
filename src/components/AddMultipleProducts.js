// src/components/AddMultipleProducts.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CryptoJS from 'crypto-js'; 
import { contractAddress, contractABI } from '../config/contractConfig';
import { v4 as uuidv4 } from 'uuid'; // Per generare ID unici se necessario

async function fetchAvailableKeys() {
    const response = await fetch('/.netlify/functions/availableKeys'); // Updated to point to Netlify function
    const data = await response.json();
    return data;
}
async function fetchDigitalSignatures() {
    const response = await fetch('/.netlify/functions/fetchDigitalSignatures'); // Updated to point to Netlify function
    if (!response.ok) {
        throw new Error('Failed to fetch digital signatures');
    }
    const data = await response.json();
    return data.map(sig => ({ id: sig._id, signature: sig.signatureData }));
}

	const AddMultipleProducts = () => {
	  const [digitalSignatures, setDigitalSignatures] = useState([]);
	  const [availableKeys, setAvailableKeys] = useState([]);
	  const [numberOfProducts, setNumberOfProducts] = useState(1);
	  const [products, setProducts] = useState([]);
	  const [manufacturerSignature, setManufacturerSignature] = useState('');
	  const [productName, setProductName] = useState(""); 

		useEffect(() => {
		  const getKeysAndSignatures = async () => {
			try {
			  const keysData = await fetchAvailableKeys();
			  const signaturesData = await fetchDigitalSignatures();
			  setAvailableKeys(keysData);
			  setDigitalSignatures(signaturesData);

			  if (keysData.length >= numberOfProducts) {
				setProducts(Array.from({ length: numberOfProducts }, (_, i) => { // Notice `(_, i)` where `i` is the index
				  return {
					productId: uuidv4(), // Generate a unique productId for each product
					name: productName,
					publicKey: keysData[i]?.publicKey, // Now `i` is correctly defined
					secret: CryptoJS.lib.WordArray.random(16).toString(),
					seed: Math.floor(Math.random() * 900 + 100).toString(),
					manufacturerSignature: manufacturerSignature,
					randomSecret: CryptoJS.lib.WordArray.random(8).toString()
				  };
				}));
			  } else {
				console.error("Not enough keys available for the number of products requested");
			  }
			} catch (error) {
			  console.error("Error fetching keys or signatures:", error);
			}
		  };

		  getKeysAndSignatures();
		}, [numberOfProducts, productName, manufacturerSignature]); // Adjust dependency array as needed

	  const handleInputChange = (e, index, field) => {
		const value = e.target.value;
		setProducts(prevProducts => prevProducts.map((product, idx) => {
		  if (idx === index) {
			return { ...product, [field]: value };
		  }
		  return product;
		}));
	  };

	  const handleSignatureChange = (e) => {
		setManufacturerSignature(e.target.value);
	  };

	const saveProductDetails = async (product) => {
	  try {
		const response = await fetch('/.netlify/functions/saveProductDetails', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			productId: product.productId,
			name: product.name,
			publicKey: product.publicKey,
			secret: product.secret,
			seed: product.seed,
			manufacturerSignature: product.manufacturerSignature,
			randomSecret: product.randomSecret,
			transactionHash: product.transactionHash,  // Include the transaction hash from the blockchain transaction
			status: 'active'  // Assuming this is your default status
		  })
		});
		const responseData = await response.json();
		if (!response.ok) {
		  throw new Error(responseData.message);
		}
		console.log('Product details saved:', responseData);
	  } catch (error) {
		console.error('Error saving product details:', error);
	  }
	};

	const handleSubmit = async (e) => {
	  e.preventDefault();

	  if (products.some(product => !product.publicKey)) {
		alert('Some products do not have a key assigned. Please check key availability.');
		return;
	  }

	  const web3 = new Web3(window.ethereum);
	  const productContract = new web3.eth.Contract(contractABI, contractAddress);
	  const accounts = await web3.eth.getAccounts();

	  const formattedProducts = products.map(product => {
		const publicKeyBytes = web3.utils.hexToBytes(product.publicKey);
		const secretBytes32 = web3.utils.asciiToHex(product.secret);
		const formattedSecretBytes32 = web3.utils.padRight(secretBytes32, 66).substring(0, 66);
		const randomSecretBytes32 = web3.utils.asciiToHex(product.randomSecret);
		const formattedRandomSecretBytes32 = web3.utils.padRight(randomSecretBytes32, 66).substring(0, 66);

		return [
		  product.name,
		  publicKeyBytes,
		  formattedSecretBytes32,
		  product.manufacturerSignature,
		  formattedRandomSecretBytes32
		];
	  });

	  try {
		const transactionResponse = await productContract.methods.addMultipleProducts(formattedProducts).send({ from: accounts[0] });
		if (transactionResponse.status) {
		  // Here we assume transactionResponse.transactionHash provides a single hash for all products
		  products.forEach(async (product, index) => {
			const updatedProduct = {
			  ...product,
			  transactionHash: transactionResponse.transactionHash
			};
			await saveProductDetails(updatedProduct);
		  });

		  console.log('Products successfully added!');
		  alert('Products successfully added!');
		} else {
		  throw new Error('Blockchain transaction failed');
		}
	  } catch (error) {
		console.error(`Error adding products: ${error.message}`);
		alert(`Error adding products: ${error.message}`);
	  }
	};

	return (
		<div>
		  <h2>Create Multiple Products</h2>
		  <form onSubmit={handleSubmit}>
			<label>
			  Product Name:
			  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
			</label>
			<label>
			  Number of products to create:
			  <input type="number" value={numberOfProducts} onChange={(e) => setNumberOfProducts(Math.min(e.target.value, availableKeys.length))} min="1" max={availableKeys.length} />
			</label>
			<label>
			  Manufacturer Signature:
			  <select value={manufacturerSignature} onChange={handleSignatureChange} required>
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
			  <div key={index} style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}>
				<span><strong>Product {index + 1} Name:</strong> {product.name}</span>
				<span><strong>ID Unico:</strong> {product.productId}</span>
				<span><strong>Public Key NFC:</strong> {product.publicKey}</span>
				<span><strong>Seed:</strong> {product.seed}</span>
				<span><strong>Random Secret:</strong> {product.randomSecret}</span>
				<span><strong>Manufacturer Signature:</strong> {product.manufacturerSignature}</span>
				<span><strong>Key Challenge-Response:</strong> {product.secret}</span>
				<span><strong>Transaction Hash:</strong> {product.transactionHash}</span>  {/* Corrected */}
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