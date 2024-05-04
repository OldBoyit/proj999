import numpy as np
import pandas as pd
import importlib
import logging
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import RandomOverSampler

# Reloading the modules if needed
importlib.reload(np)
importlib.reload(pd)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load data
logger.info("Loading data...")
combined_data_path = 'Combine_csv/combined_data.csv'
counterfeit_data_path = 'Combine_csv/prodotti_contraffatti.csv'
combined_df = pd.read_csv(combined_data_path)
counterfeit_df = pd.read_csv(counterfeit_data_path)

# Preprocessing
counterfeit_df['Is_Counterfeit'] = 1
combined_df['Is_Counterfeit'] = 0
full_df = pd.concat([combined_df, counterfeit_df])

# Calculate risk rates for Transporter and Sales_Channel
transporter_risk = full_df.groupby('Transporter')['Is_Counterfeit'].mean().reset_index()
sales_channel_risk = full_df.groupby('Sales_Channel')['Is_Counterfeit'].mean().reset_index()

transporter_risk.columns = ['Transporter', 'Transporter_Risk']
sales_channel_risk.columns = ['Sales_Channel', 'Sales_Channel_Risk']

# Merge the risk data back into the combined_df
combined_df = combined_df.merge(transporter_risk, on='Transporter', how='left')
combined_df = combined_df.merge(sales_channel_risk, on='Sales_Channel', how='left')

# Determine the highest risk
combined_df['Predicted_Risk'] = combined_df[['Transporter_Risk', 'Sales_Channel_Risk']].max(axis=1)

# Set "Rischio Molto Alto" for risk > 40%
combined_df['Adjusted_Risk'] = combined_df['Predicted_Risk']
combined_df.loc[(combined_df['Transporter_Risk'] > 0.4) | (combined_df['Sales_Channel_Risk'] > 0.4), 'Adjusted_Risk'] = 1.0

# Define risk categories
combined_df['Risk_Category'] = pd.cut(combined_df['Adjusted_Risk'], bins=[0.1, 0.2, 0.3, 0.35, 0.45, 1.0], labels=['Rischio Molto Basso', 'Rischio Basso', 'Rischio Medio', 'Rischio Alto', 'Rischio Molto Alto'])

# Save the results
output_path = 'Models/Ensemble/combined_data_with_predicted_risk.csv'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
combined_df.to_csv(output_path, index=False)
logger.info(f"Predicted risk data saved successfully to {output_path}.")
