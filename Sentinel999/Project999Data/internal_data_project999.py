#internal_data_project999.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import hashlib
import uuid

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

num_days = 365
num_products = 100000
start_date = datetime(2023, 1, 1)

product_ids = generate_uuids(num_products)
dates = generate_dates(start_date, num_days)
public_keys = generate_keys(num_products)
private_keys = generate_keys(num_products)
seeds = generate_seeds(num_products)
random_secrets = generate_random_secrets(num_products)
transaction_hashes = generate_transaction_hashes(num_products, product_ids)

df = pd.DataFrame({
    'Product_ID': np.random.choice(product_ids, size=num_days),
    'Production_Date': np.random.choice(dates, size=num_days),
    'PublicKey': np.random.choice(public_keys, size=num_days),
    'PrivateKey': np.random.choice(private_keys, size=num_days),
    'Seed': np.random.choice(seeds, size=num_days),
    'RandomSecret': np.random.choice(random_secrets, size=num_days),
    'TransactionHash': np.random.choice(transaction_hashes, size=num_days)
})

print(df.head())
df.to_csv('OutputData/project999_simulation_data.csv', index=False)
