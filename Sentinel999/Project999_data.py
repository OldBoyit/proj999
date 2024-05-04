#data_analysis_integration.py
#Dati ricavati da Project999 salvati in Data_Analysis_Output
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import hashlib
import uuid
import os

# Definizione delle funzioni per generare i dati
def generate_uuids(n):
    return [str(uuid.uuid4()) for _ in range(n)]

def generate_dates(start_date, n):
    return [start_date + timedelta(days=i) for i in range(n)]

def generate_keys(n):
    return [np.random.randint(1, 1000000) for _ in range(n)]

def generate_seeds(n):
    return [random.randint(100000, 999999) for _ in range(n)]

def generate_random_secrets(n):
    return [hashlib.sha256(f'secret{i}'.encode()).hexdigest() for i in range(n)]

def generate_transaction_hashes(n, ids):
    return [hashlib.sha256(f'{id}'.encode()).hexdigest() for id in ids]

# Imposta il periodo di simulazione e il numero di prodotti
num_days = 365
num_products = 1000
start_date = datetime(2023, 1, 1)

# Generazione dei dati
product_ids = generate_uuids(num_products)
dates = generate_dates(start_date, num_days)
public_keys = generate_keys(num_products)
private_keys = generate_keys(num_products)
seeds = generate_seeds(num_products)
random_secrets = generate_random_secrets(num_products)
transaction_hashes = generate_transaction_hashes(num_products, product_ids)

# Creazione del DataFrame
df = pd.DataFrame({
    'Product_ID': np.random.choice(product_ids, size=num_days),
    'Production_Date': np.random.choice(dates, size=num_days),
    'PublicKey': np.random.choice(public_keys, size=num_days),
    'PrivateKey': np.random.choice(private_keys, size=num_days),
    'Seed': np.random.choice(seeds, size=num_days),
    'RandomSecret': np.random.choice(random_secrets, size=num_days),
    'TransactionHash': np.random.choice(transaction_hashes, size=num_days),
    'Counterfeit': np.random.choice([True, False], size=num_days, p=[0.1, 0.9])
})

# Verifica e creazione del percorso di output se non esiste
output_dir = 'Data_Analysis_Output'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Salvataggio del DataFrame in un file CSV nel percorso specificato
output_file_path = os.path.join(output_dir, 'project999_simulation_data.csv')
df.to_csv(output_file_path, index=False)
print(f'Dati salvati in {output_file_path}')

