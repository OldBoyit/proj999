#data_operations.py
import pandas as pd
import joblib
import os
import sys
from tkinter import ttk, Tk

project_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(project_dir)
from RandomForestClassifier import load_data_and_predict

def load_data(frame):
    # Carica i dati rimuovendo le colonne Is_Counterfeit e Counterfeit se presenti
    combined_df = pd.read_csv('../Models/Ensemble/combined_data_with_predicted_risk.csv')
    if 'Is_Counterfeit' in combined_df.columns:
        combined_df = combined_df.drop(columns=['Is_Counterfeit'], errors='ignore')
    if 'Counterfeit' in combined_df.columns:
        combined_df = combined_df.drop(columns=['Counterfeit'], errors='ignore')

    columns = list(combined_df.columns)
    tree = ttk.Treeview(frame, columns=columns, show='headings')

    for col in columns:
        tree.heading(col, text=col)
        tree.column(col, width=100, anchor="center")

    for _, row in combined_df.iterrows():
        tree.insert("", "end", values=list(row))

    # Nascondi le colonne che non devono essere visibili all'inizio
    hidden_columns = ['Transporter_Risk', 'Sales_Channel_Risk', 'Predicted_Risk', 'Risk_Category']
    for col in hidden_columns:
        if col in columns:
            tree.column(col, width=0, minwidth=0, stretch=False)

    # Nascondi esplicitamente le colonne Is_Counterfeit e Counterfeit nel Treeview (precauzionale)
    if 'Is_Counterfeit' in columns:
        tree.column('Is_Counterfeit', width=0, minwidth=0, stretch=False)
    if 'Counterfeit' in columns:
        tree.column('Counterfeit', width=0, minwidth=0, stretch=False)

    return tree, combined_df

def run_ensemble(tree, combined_df, scrollbar_x):
    result_df = load_data_and_predict(combined_df)
    
    new_columns = ['Transporter_Risk', 'Sales_Channel_Risk', 'Predicted_Risk', 'Risk_Category']
    existing_columns = list(tree['columns'])
    all_columns = existing_columns + [col for col in new_columns if col not in existing_columns]

    tree.config(columns=all_columns)
    for col in all_columns:
        tree.heading(col, text=col)
        # Imposta una larghezza minima fissa per ogni colonna, abbastanza grande da richiedere lo scorrimento
        tree.column(col, width=150, minwidth=150, anchor="center")

    update_table(tree, result_df)

    # Reconfigura la scrollbar orizzontale esistente
    tree.configure(xscrollcommand=scrollbar_x.set)
    # Assicurati che le modifiche siano visibili
    tree.update_idletasks()


def update_table(tree, df):
    for i in tree.get_children():
        tree.delete(i)
    for index, row in df.iterrows():
        tree.insert("", "end", values=list(row))

    # Assicurati che le scrollbar siano ancora correttamente collegate dopo l'aggiornamento
    tree.update_idletasks()  
