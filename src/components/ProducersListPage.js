import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProducersListPage() {
    const [producers, setProducers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await fetch('/.netlify/functions/producerView');
                const data = await response.json();
                if (response.ok) {
                    // Ordina i produttori per username
                    const sortedProducers = data.sort((a, b) => a.username.localeCompare(b.username));
                    setProducers(sortedProducers);
                } else {
                    throw new Error('Failed to fetch producers');
                }
            } catch (error) {
                console.error('Error fetching producers:', error);
            }
        };
        fetchProducers();
    }, []);

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Elenco dei Produttori</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {producers.map(producer => (
                    <li key={producer._id || producer.id} style={{ background: '#f4f4f4', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Username: {producer.username} - Wallet: {producer.walletAddress}</span>
                    </li>
                ))}
            </ul>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={() => navigate('/admin-dashboard')} style={{ background: '#007BFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Torna alla Dashboard Admin</button>
            </div>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>Questa pagina mostra l'elenco dei produttori registrati nel sistema.</p>
        </div>
    );
}

export default ProducersListPage;

