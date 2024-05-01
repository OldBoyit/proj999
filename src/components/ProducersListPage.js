import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProducersListPage() {
    const [producers, setProducers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await fetch('/.netlify/functions/producerLogin'); // Assicurati che questo endpoint sia corretto
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
        <div>
            <h1>Elenco dei Produttori</h1>
            <ul>
                {producers.map(producer => (
                    <li key={producer._id || producer.id}> {/* Assicurati che gli ID siano consistenti */}
                        Username: {producer.username} - Wallet: {producer.walletAddress}
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/admin-dashboard')}>Torna alla Dashboard Admin</button>
            <p style={{ marginTop: '20px' }}>Questa pagina mostra l'elenco dei produttori registrati nel sistema.</p>
        </div>
    );
}

export default ProducersListPage;

