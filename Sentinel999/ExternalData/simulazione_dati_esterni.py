import pandas as pd
import numpy as np
import os

# Imposta il periodo di simulazione
date_range = pd.date_range(start='2018-01-01', end='2023-12-31', freq='D')

# Simula i dati
np.random.seed(999)  # Per risultati riproducibili

data = {
    'Date': date_range,
    'Traffic_Conditions': np.random.choice(['Normal', 'Heavy', 'Light'], size=len(date_range), p=[0.7, 0.2, 0.1]),
    'Supply_Chain_Disruptions': np.random.choice([None, 'Strike', 'Natural Disaster', 'Technical Failure'],
                                                 size=len(date_range), p=[0.85, 0.05, 0.05, 0.05]),
    'Weather_Conditions': np.random.choice(['Clear', 'Rainy', 'Stormy', 'Snowy', 'Foggy'],
                                           size=len(date_range), p=[0.6, 0.15, 0.1, 0.1, 0.05])
}

# Crea DataFrame
df = pd.DataFrame(data)

# Visualizza alcune righe del DataFrame
print(df.head(10))

# Crea la cartella se non esiste
output_dir = 'OutputData'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Path del file di output
output_file_path = os.path.join(output_dir, 'simulated_external_data.csv')

# Salva il DataFrame in formato CSV
df.to_csv(output_file_path, index=False)

print(f'Dati salvati in {output_file_path}')
