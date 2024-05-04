#EnsemblePredictions.py
import pandas as pd

# Caricamento dei dati
combined_data_path = 'Combine_csv/combined_data.csv'
counterfeit_data_path = 'Combine_csv/prodotti_contraffatti.csv'
combined_df = pd.read_csv(combined_data_path)
counterfeit_df = pd.read_csv(counterfeit_data_path)

# Filtrare i dati per quelli contraffatti
counterfeit_only_df = counterfeit_df[counterfeit_df['Counterfeit'] == 1]

# Creazione dei dataframe finali con conteggi e rischi per Transporter e Sales_Channel
risk_scores = {}

for column in ['Transporter', 'Sales_Channel']:
    total_counts = counterfeit_df[column].value_counts().reset_index()
    counterfeit_counts = counterfeit_only_df[column].value_counts().reset_index()
    total_counts.columns = ['Name', 'Total_Count']
    counterfeit_counts.columns = ['Name', 'Counterfeit_Count']
    
    # Unire i conteggi totali e contraffatti
    merged_data = pd.merge(total_counts, counterfeit_counts, on='Name', how='left')
    merged_data['Counterfeit_Count'].fillna(0, inplace=True)
    
    # Calcolo del punteggio di rischio
    merged_data['Risk_Score'] = ((merged_data['Counterfeit_Count'] / merged_data['Total_Count']) * 100).round(0)
    risk_scores[column] = merged_data[['Name', 'Risk_Score']].set_index('Name')['Risk_Score']

# Applicazione dei punteggi di rischio al dataframe combinato
combined_df['Transporter_Risk'] = combined_df['Transporter'].map(risk_scores['Transporter']).fillna(0).round(0)
combined_df['Sales_Channel_Risk'] = combined_df['Sales_Channel'].map(risk_scores['Sales_Channel']).fillna(0).round(0)

# Calcolare il rischio massimo tra Transporter e Sales_Channel
combined_df['Max_Risk_Score'] = combined_df[['Transporter_Risk', 'Sales_Channel_Risk']].max(axis=1).round(0)

# Ordinamento del dataframe per rischio decrescente
combined_df.sort_values('Max_Risk_Score', ascending=False, inplace=True)

# Divisione in quattro categorie di rischio
combined_df['Risk_Category'] = pd.qcut(combined_df['Max_Risk_Score'], 4, labels=['Low Risk', 'Medium-Low Risk', 'Medium-High Risk', 'High Risk'])

# Salvataggio del dataframe risultante
output_path = 'Models/Ensemble/combined_data_with_risk.csv'
combined_df.to_csv(output_path, index=False)

print(f"Data saved successfully to {output_path}.")




