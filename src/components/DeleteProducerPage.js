import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteProducerPage() {
    const [producers, setProducers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await fetch('/api/producers'); // Assicurati che questo endpoint sia corretto
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
        <div>
            <h1>Elimina Produttore</h1>
            <ul>
                {producers.map((producer) => (
                    <li key={producer._id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={producer.isSelected}
                                onChange={() => toggleProducerSelection(producer._id)}
                            />
                            {producer.username} - {producer.walletAddress}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleDelete}>Elimina</button>
            <button onClick={() => navigate('/admin-dashboard')}>Annulla</button>
            <p>Questa pagina consente agli amministratori di rimuovere i produttori registrati nel sistema. È possibile selezionare uno o più produttori dall'elenco e procedere con l'eliminazione. L'operazione richiede una conferma per evitare eliminazioni accidentali. Una volta confermata, l'eliminazione è irreversibile e i dati del produttore vengono permanentemente rimossi dal sistema.</p>
            <p>Questa operazione al momento è integrata e funzionante ma disabilitata.</p>
        </div>
    );
}

export default DeleteProducerPage;
