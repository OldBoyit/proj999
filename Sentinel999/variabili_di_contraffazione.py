#variabili_di_contraffazione.py
#Variabili per riuscire a trovare pattern di contraffazione--Da aggiungere possibili variabili
import pandas as pd
import numpy as np
import random
import os
from faker import Faker

fake = Faker('it_IT')  # Generator for Italian locale

def generate_counterfeit_data(num_records):
    transporters = ['Logistica Italia', 'Euro Transport', 'Global Move', 'RapidWay Trans', 'Quick Ship', 'Direct Logistics', 'InterCity Courier', 'National Cargo']
    sales_channels = ['Amazon Italia', 'eBay', 'Negozio di Roma', 'Boutique Milano', 'Online Shop', 'Direct Sale', 'Local Market', 'Mall Outlet']
    cities = ['Milano', 'Roma', 'Napoli', 'Torino', 'Palermo', 'Firenze', 'Venezia', 'Bologna', 'Genova', 'Padova', 'Verona', 'Parma']
    lot_numbers = [f"Lot-{i}" for i in range(100, 200)]
    
    data = {
        'Transporter': np.random.choice(transporters, num_records),
        'Sales_Channel': np.random.choice(sales_channels, num_records),
        'City': np.random.choice(cities, num_records),
        'Sale_Date': [fake.date_between(start_date='-2y', end_date='today') for _ in range(num_records)],
        'Sale_Price': np.random.normal(250, 50, num_records).round(2),  # Average price 250 with SD of 50
        'Lot_Number': np.random.choice(lot_numbers, num_records),
        'Return_Frequency': np.random.poisson(0.5, num_records)  # Average return rate of 0.5
    }

    df = pd.DataFrame(data)
    df['Counterfeit'] = 0  # Set all products as not counterfeit

    return df

def main():
    df = generate_counterfeit_data(1000)  # Generate data for 1000 products
    # Save to specific folder
    df.to_csv('Variabili_di_contraffazione/simulated_counterfeit_data.csv', index=False)
    print("Data generated and saved successfully.")

if __name__ == "__main__":
    main()

