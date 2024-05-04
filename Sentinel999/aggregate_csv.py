#aggregate_csv.py
#Unisce tutti i csv per poi lavorarli
import pandas as pd
import os

def load_and_cycle_data(file_path, cycle_length):
    df = pd.read_csv(file_path)
    repeat_times = -(-cycle_length // len(df))  # Calcolo del numero di volte che il df deve essere ripetuto per superare cycle_length
    df = pd.concat([df] * repeat_times, ignore_index=True)[:cycle_length]  # Ripetizione e taglio
    return df

def main():
    base_dir = r'C:\Users\Admin\Desktop\Sentinel999'
    file_paths = [
        os.path.join(base_dir, 'Project999Data', 'OutputData', 'project999_simulation_data.csv'),
        os.path.join(base_dir, 'Variabili_di_contraffazione', 'simulated_counterfeit_data.csv'),
        os.path.join(base_dir, 'ExternalData', 'OutputData', 'simulated_external_data.csv')
    ]

    # Determinare la lunghezza massima dai dataframes
    max_size = max(pd.read_csv(fp).shape[0] for fp in file_paths)

    # Caricare e allineare i dati ciclicamente
    data_frames = [load_and_cycle_data(fp, max_size) for fp in file_paths]
    
    # Combinare i dati in un unico DataFrame
    combined_df = pd.concat(data_frames, axis=1, ignore_index=False)
    
    # Riempire i campi vuoti nella colonna 'Supply_Chain_Disruptions' con 'No Disruption'
    combined_df['Supply_Chain_Disruptions'] = combined_df['Supply_Chain_Disruptions'].fillna('No Disruption')
    
    output_dir = os.path.join(base_dir, 'Combine_csv')
    output_path = os.path.join(output_dir, 'combined_data.csv')
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Salvare il DataFrame combinato
    combined_df.to_csv(output_path, index=False)
    print(f"Data combined and saved to {output_path}")

if __name__ == "__main__":
    main()



