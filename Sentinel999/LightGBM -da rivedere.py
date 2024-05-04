import pandas as pd
import numpy as np
import logging
import os
from sklearn.model_selection import train_test_split, GridSearchCV
from lightgbm import LGBMClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
from sklearn.utils import class_weight

# Configurazione del logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Caricamento dei dati
logger.info("Caricamento dei dati...")
combined_data_path = 'Combine_csv/combined_data.csv'
counterfeit_data_path = 'Combine_csv/prodotti_contraffatti.csv'
combined_df = pd.read_csv(combined_data_path)
counterfeit_df = pd.read_csv(counterfeit_data_path)

# Filtraggio per i prodotti contraffatti
counterfeit_only_df = counterfeit_df[counterfeit_df['Counterfeit'] == 1]

# Creazione di dataframe con conteggi e rischi per Transporter e Sales_Channel
logger.info("Calcolo dei punteggi di rischio...")
risk_scores = {}

for column in ['Transporter', 'Sales_Channel']:
    total_counts = counterfeit_df[column].value_counts().reset_index()
    counterfeit_counts = counterfeit_only_df[column].value_counts().reset_index()
    total_counts.columns = ['Name', 'Total_Count']
    counterfeit_counts.columns = ['Name', 'Counterfeit_Count']

    # Unione dei conteggi totali e dei conteggi contraffatti
    merged_data = pd.merge(total_counts, counterfeit_counts, on='Name', how='left')
    merged_data['Counterfeit_Count'].fillna(0, inplace=True)

    # Calcolo del punteggio di rischio
    merged_data['Risk_Score'] = ((merged_data['Counterfeit_Count'] / merged_data['Total_Count']) * 100).round(0)
    risk_scores[column] = merged_data[['Name', 'Risk_Score']].set_index('Name')['Risk_Score']

# Applicazione dei punteggi di rischio al dataframe combinato
combined_df['Transporter_Risk'] = combined_df['Transporter'].map(risk_scores['Transporter']).fillna(0).round(0)
combined_df['Sales_Channel_Risk'] = combined_df['Sales_Channel'].map(risk_scores['Sales_Channel']).fillna(0).round(0)

# Calcolo del punteggio di rischio massimo tra Transporter e Sales_Channel
combined_df['Max_Risk_Score'] = combined_df[['Transporter_Risk', 'Sales_Channel_Risk']].max(axis=1).round(0)
combined_df.sort_values('Max_Risk_Score', ascending=False, inplace=True)

# Creazione delle categorie di rischio
try:
    combined_df['Risk_Category'] = pd.qcut(
        combined_df['Max_Risk_Score'], 4,
        labels=['Low Risk', 'Medium-Low Risk', 'Medium-High Risk', 'High Risk'],
        duplicates='drop'
    )
except ValueError:
    logger.warning("I bordi dei bin non sono unici. Assegnazione di tutti a 'High Risk'.")
    combined_df['Risk_Category'] = 'High Risk'

# Conversione dei dati categorici in numerici
encoder = LabelEncoder()
for column in combined_df.select_dtypes(include=['object']).columns:
    combined_df[column] = encoder.fit_transform(combined_df[column])

# Preparazione delle features e delle etichette
X = combined_df.drop(['Counterfeit', 'Risk_Category'], axis=1)
y = combined_df['Risk_Category'].astype('category')  # Assicurarsi che la colonna sia trattata come categorica

# Divisione del dataset in training e test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Configurazione e esecuzione della GridSearchCV
param_grid = {
    'n_estimators': [100, 200],
    'learning_rate': [0.05, 0.1],
    'max_depth': [5, 7],
    'num_leaves': [15, 31, 63]
}
model = LGBMClassifier(random_state=42)
grid_search = GridSearchCV(model, param_grid, cv=5, verbose=3)
grid_search.fit(X_train, y_train)

# Selezione e valutazione del miglior modello
best_model = grid_search.best_estimator_
predictions = best_model.predict(X_test)
logger.info("\n" + classification_report(y_test, predictions))

# Salvataggio del modello e dei risultati
model_dir = 'Models/LightGBM'
os.makedirs(model_dir, exist_ok=True)
joblib.dump(best_model, os.path.join(model_dir, 'lgbm_model.joblib'))
output_path = 'Models/LightGBM/combined_data_with_risk.csv'
combined_df.to_csv(output_path, index=False)
logger.info(f"Dati salvati con successo in {output_path}.")
