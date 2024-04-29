import React, { useEffect, useState } from 'react';

function ProducersListPage() {
    const [producers, setProducers] = useState([]);

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await fetch('/api/producers'); // Assicurati che questo endpoint sia corretto
                const data = await response.json();
                if (response.ok) {
                    setProducers(data);
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
        </div>
    );
}

export default ProducersListPage;
