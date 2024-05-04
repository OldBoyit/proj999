#gui_main.py
import tkinter as tk
from tkinter import ttk
from data_operations import load_data, run_ensemble

def show_sort_button():
    # Presumi che sort_button sia globale o passalo in modo appropriato
    sort_button.pack(side="bottom", pady=10, padx=10) 

def create_gui():
    window = tk.Tk()
    window.title("Sentinel999 - Analisi Dati")
    window.geometry("800x600")

    frame = tk.Frame(window)
    frame.pack(fill="both", expand=True, padx=5, pady=5)

    tree, combined_df = load_data(frame)

    scrollbar_y = ttk.Scrollbar(frame, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=scrollbar_y.set)
    scrollbar_y.pack(side="right", fill="y")

    scrollbar_x = ttk.Scrollbar(frame, orient="horizontal", command=tree.xview)
    tree.configure(xscrollcommand=scrollbar_x.set)
    scrollbar_x.pack(side="bottom", fill="x")

    tree.pack(side="left", fill="both", expand=True)

    # Frame per il bottone
    button_frame = tk.Frame(window, bg="#333")
    button_frame.pack(fill="x", side="bottom")

    # Configurazione dello stile del bottone
    style = ttk.Style()
    style.configure("My.TButton", font=('Helvetica', 12, 'bold'), foreground="blue", background="#555")

    # Bottone per avviare l'analisi ensemble
    run_ensemble_button = ttk.Button(button_frame, text="Avvia Sentinel", style="My.TButton",
                                     command=lambda: run_ensemble(tree, combined_df, scrollbar_x))
    run_ensemble_button.pack(side="bottom", pady=10, padx=10)

    window.mainloop()

if __name__ == "__main__":
    create_gui()


