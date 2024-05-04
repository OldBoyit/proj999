#prodotti_contraffatti.py
#Questo file genera prodotti contrassegnati come contraffatti. Viene utilizzato per addestrare l'ia a trovare i pattern
import pandas as pd
import numpy as np
import os
import random
import uuid
import hashlib
from faker import Faker
from datetime import timedelta, datetime

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

def generate_transaction_hashes(n):
    ids = generate_uuids(n)  # Ensure UUIDs are generated and stored
    return [hashlib.sha256(f'{id}'.encode()).hexdigest() for id in ids]

def generate_counterfeit_data(num_records, output_dir):
    fake = Faker('it_IT')  # Initialize Faker with Italian localization
    start_date = datetime.strptime("2021-01-01", "%Y-%m-%d")

    ids = generate_uuids(num_records)
    production_dates = generate_dates(start_date, num_records)
    public_keys = generate_keys(num_records)
    private_keys = generate_keys(num_records)
    seeds = generate_seeds(num_records)
    random_secrets = generate_random_secrets(num_records)
    transaction_hashes = generate_transaction_hashes(num_records)
    sale_dates = [fake.date_between(start_date='-2y', end_date='today') for _ in range(num_records)]
    dates = [fake.date_between(start_date='-2y', end_date='today') for _ in range(num_records)]
    lot_numbers = np.random.choice([f"Lot-{i}" for i in range(100, 200)], num_records)

    data = {
        'Product_ID': ids,
        'Production_Date': production_dates,
        'PublicKey': public_keys,
        'PrivateKey': private_keys,
        'Seed': seeds,
        'RandomSecret': random_secrets,
        'TransactionHash': transaction_hashes,
        'Transporter': np.random.choice(['Logistica Italia', 'Euro Transport', 'Global Move', 'RapidWay Trans', 'Quick Ship', 'Direct Logistics', 'InterCity Courier', 'National Cargo'], num_records),
        'Sales_Channel': np.random.choice(['Amazon Italia', 'eBay', 'Negozio di Roma', 'Boutique Milano', 'Online Shop', 'Direct Sale', 'Local Market', 'Mall Outlet'], num_records),
        'City': np.random.choice(['Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Firenze', 'Venezia', 'Bologna', 'Genova', 'Padova', 'Verona', 'Parma'], num_records),
        'Sale_Date': sale_dates,
        'Sale_Price': np.random.normal(250, 50, num_records).round(2),
        'Lot_Number': lot_numbers,
        'Return_Frequency': np.clip(np.random.poisson(0.5, num_records), 0, 1),
        'Date': dates,
        'Traffic_Conditions': np.random.choice(['High', 'Medium', 'Low'], num_records),
        'Supply_Chain_Disruptions': np.random.choice(['Yes', 'No'], num_records),
        'Weather_Conditions': np.random.choice(['Sunny', 'Rainy', 'Cloudy'], num_records),
        'Counterfeit': [1] * num_records
    }

    column_order = [
        'Product_ID', 'Production_Date', 'PublicKey', 'PrivateKey', 'Seed', 
        'RandomSecret', 'TransactionHash', 'Transporter', 'Sales_Channel', 
        'City', 'Sale_Date', 'Sale_Price', 'Lot_Number', 'Return_Frequency', 
        'Date', 'Traffic_Conditions', 'Supply_Chain_Disruptions', 
        'Weather_Conditions', 'Counterfeit'
    ]
    
    df = pd.DataFrame(data)
    
    # Ensure the output directory exists, relative to current working directory
    output_path = os.path.join(output_dir, 'prodotti_contraffatti.csv')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Save the DataFrame
    df.to_csv(output_path, index=False)
    print(f"Counterfeit products data saved to {output_path}")

def main():
    # Use relative path from the current working directory
    output_dir = 'Combine_csv'
    generate_counterfeit_data(1800, output_dir)

if __name__ == "__main__":
    main()




