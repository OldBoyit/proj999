import pandas as pd
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load data
logger.info("Loading data...")
combined_data_path = 'Combine_csv/combined_data.csv'
counterfeit_data_path = 'Combine_csv/prodotti_contraffatti.csv'
combined_df = pd.read_csv(combined_data_path)
counterfeit_df = pd.read_csv(counterfeit_data_path)

# Sample data
sample_fraction = 1.0
logger.info(f"Sampling {sample_fraction * 100}% of the data...")
combined_df = combined_df.sample(frac=sample_fraction, random_state=42)
counterfeit_df = counterfeit_df.sample(frac=sample_fraction, random_state=42)

# Filter for counterfeit products
counterfeit_only_df = counterfeit_df[counterfeit_df['Counterfeit'] == 1]

# Calculating risk scores
logger.info("Calculating risk scores...")
risk_scores = {}
for column in ['Transporter', 'Sales_Channel']:
    total_counts = counterfeit_df[column].value_counts().reset_index()
    counterfeit_counts = counterfeit_only_df[column].value_counts().reset_index()
    total_counts.columns = ['Name', 'Total_Count']
    counterfeit_counts.columns = ['Name', 'Counterfeit_Count']
    merged_data = pd.merge(total_counts, counterfeit_counts, on='Name', how='left')
    merged_data['Counterfeit_Count'] = merged_data['Counterfeit_Count'].fillna(0)
    merged_data['Risk_Score'] = ((merged_data['Counterfeit_Count'] / merged_data['Total_Count']) * 100).round(0)
    risk_scores[column] = merged_data.set_index('Name')['Risk_Score']

# Apply risk scores to the combined dataframe
combined_df['Transporter_Risk'] = combined_df['Transporter'].map(risk_scores['Transporter']).fillna(0).round(0)
combined_df['Sales_Channel_Risk'] = combined_df['Sales_Channel'].map(risk_scores['Sales_Channel']).fillna(0).round(0)
combined_df['Max_Risk_Score'] = combined_df[['Transporter_Risk', 'Sales_Channel_Risk']].max(axis=1)

# Creating risk categories
bins = [0, 20, 40, 80, 100]
labels = ['Low Risk', 'Medium-Low Risk', 'Medium-High Risk', 'High Risk']
combined_df['Risk_Category'] = pd.cut(combined_df['Max_Risk_Score'], bins=bins, labels=labels, right=True)

# Save the resulting dataframe
output_path = 'Models/Ensemble/combined_data_with_risk.csv'
output_dir = os.path.dirname(output_path)
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

combined_df.to_csv(output_path, index=False)
logger.info(f"Data saved successfully to {output_path}.")
