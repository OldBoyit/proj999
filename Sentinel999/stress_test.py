#stress_test.py
#fattori di stress, vediamo se riesco in tempo ad aggiungerlo--Da completare
import pandas as pd
import numpy as np
import random
import os

def introduce_disruptions(df, frequency, disruption_type):
    indices = np.random.choice(df.index, size=int(len(df) * frequency), replace=False)
    df.loc[indices, 'Supply_Chain_Disruptions'] = disruption_type
    return df, indices

def simulate_attacks(df, frequency, field, new_value=None):
    attack_indices = np.random.choice(df.index, size=int(len(df) * frequency), replace=False)
    if new_value is None:
        new_value = np.random.randint(1, 1000000, size=len(attack_indices))
    df.loc[attack_indices, field] = new_value
    return df, attack_indices

# Caricamento dei dati
df = pd.read_csv('Data_Analysis_Output/project999_simulation_data.csv')

# Simulazione di attacchi
df, pk_attacks = simulate_attacks(df, 0.05, 'PublicKey')
df, sk_attacks = simulate_attacks(df, 0.03, 'PrivateKey', new_value=np.random.randint(1, 500000, size=int(len(df) * 0.03)))

# Simulazione di interruzioni
df, disaster_disruptions = introduce_disruptions(df, 0.1, 'Natural Disaster')
df, technical_disruptions = introduce_disruptions(df, 0.05, 'Technical Failure')

# Verifica e crea la cartella di output se non esiste
output_dir = 'stress_test_output'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Salvataggio dei risultati nel percorso specificato
output_file_path = os.path.join(output_dir, 'project999_comprehensive_stress_test.csv')
df.to_csv(output_file_path, index=False)
print(f"Dati salvati in {output_file_path}")


