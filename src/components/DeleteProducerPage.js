import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteProducerPage() {
    const [producers, setProducers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await fetch('/.netlify/functions/producerView');
                const data = await response.json();
                if (response.ok) {
                    setProducers(data.map(producer => ({ ...producer, isSelected: false })));
                } else {
                    console.error("Failed to fetch producers:", data);
                }
            } catch (error) {
                console.error("Error fetching producers:", error);
            }
        };
        fetchProducers();
    }, []);

    const toggleProducerSelection = (id) => {
        setProducers(prev => prev.map(prod => (prod._id === id ? { ...prod, isSelected: !prod.isSelected } : prod)));
    };

    const handleDelete = async () => {
        if (window.confirm("Sei sicuro di voler eliminare il/i produttore/i?")) {
            const producersToDelete = producers.filter(producer => producer.isSelected);
            await Promise.all(producersToDelete.map(producer =>
                fetch(`/api/producers/${producer._id}`, {
                    method: 'DELETE'
                }).then(res => res.json().then(data => {
                    if (!res.ok) {
                        throw new Error(data.message || "Failed to delete producer");
                    }
                }))
            ));
            setProducers(prev => prev.filter(producer => !producer.isSelected));
            navigate('/admin-dashboard');
        }
    };

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Elimina Produttore</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {producers.map((producer) => (
                    <li key={producer._id} style={{ background: '#f4f4f4', margin: '10px 0', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ flex: '1' }}>
                            <input
                                type="checkbox"
                                checked={producer.isSelected}
                                onChange={() => toggleProducerSelection(producer._id)}
                                style={{ marginRight: '10px' }}
                            />
                            {producer.username} - {producer.walletAddress}
                        </label>
                    </li>
                ))}
            </ul>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button onClick={handleDelete} style={{ background: 'red', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}>Elimina</button>
                <button onClick={() => navigate('/admin-dashboard')} style={{ background: 'gray', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Annulla</button>
            </div>
        </div>
    );
}

export default DeleteProducerPage;
