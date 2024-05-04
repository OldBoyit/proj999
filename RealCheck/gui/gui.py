import tkinter as tk
import webbrowser
from tkinter import ttk, messagebox, PhotoImage, scrolledtext
from verifica_lvl_1 import carica_dati, verifica_autenticità as verifica_lvl_1
from verifica_lvl_2 import verifica_autenticità as verifica_lvl_2
from verifica_lvl_3 import verifica_autenticità as verifica_lvl_3

file_path_produttore = '../Dati_NFC_Lato_Produttore/real_nfc_producer_data.json'
file_path_cliente = '../Dati_NFC_Lato_Cliente/real_nfc_client_data.json' 

# Setup dell'interfaccia grafica
root = tk.Tk()
root.title("Prototipo di Test di Autenticità")

try:
    dati_produttore = carica_dati(file_path_produttore)
    nomi_prodotti = [prod['Nome'] for prod in dati_produttore]
except Exception as e:
    nomi_prodotti = []
    print("Errore nel caricamento del file:", e)

# Interfaccia per selezionare il prodotto e il livello di test
label_prodotto = ttk.Label(root, text="Scegli prodotto da verificare")
label_prodotto.grid(row=0, column=0, padx=5, pady=5)

combo_prodotti = ttk.Combobox(root, values=nomi_prodotti)
combo_prodotti.grid(row=0, column=1, padx=5, pady=5)

label_livello = ttk.Label(root, text="Scegli il livello di verifica")
label_livello.grid(row=1, column=0, padx=5, pady=5)

combo_livelli = ttk.Combobox(root, values=["Livello 1", "Livello 2", "Livello 3"])
combo_livelli.grid(row=1, column=1, padx=5, pady=5)

# Area di testo per la console di output
console = scrolledtext.ScrolledText(root, height=10, width=50, wrap=tk.WORD)
console.grid(row=2, columnspan=2, padx=5, pady=10)

def simula_scansione_nfc():
    nome_prodotto = combo_prodotti.get()
    livello = combo_livelli.get()
    prodotto_selezionato = next((item for item in dati_produttore if item['Nome'] == nome_prodotto), None)
    
    if prodotto_selezionato:
        chiave_pub_nfc = prodotto_selezionato['PublicKey NFC']
        id_unico = prodotto_selezionato['ID Unico']
        console.insert(tk.END, f"Chiave pubblica NFC ottenuta: {chiave_pub_nfc}\n")

        # Choose the appropriate verification function based on the selected level
        if livello == "Livello 1":
            verifica = verifica_lvl_1
        elif livello == "Livello 2":
            verifica = verifica_lvl_2
        elif livello == "Livello 3":
            verifica = verifica_lvl_3
        else:
            console.insert(tk.END, "Errore: Livello di verifica non supportato.\n")
            return

        result = verifica(id_unico, chiave_pub_nfc, file_path_produttore, file_path_cliente)
        if result:
            verification_data, seed, *rest = result
            console.insert(tk.END, f"Risultato della verifica blockchain: {verification_data}\n")
            console.insert(tk.END, f"Seed ottenuto: {seed}\n")
            link = f"https://sepolia.etherscan.io/tx/{prodotto_selezionato['Hash della Transazione']}"
            message = f"Il prodotto con ID Unico {id_unico} è originale e verificabile al link: {link}"
            console.insert(tk.END, f"{message}\n", "link")
            console.tag_config("link", foreground="blue", underline=True)
            console.tag_bind("link", "<Button-1>", lambda event, link=link: webbrowser.open(link))
            messagebox.showinfo("Verifica riuscita", f"{message}\nSeed: {seed}")
            webbrowser.open(link)
        else:
            console.insert(tk.END, "Errore nella verifica.\n")
    else:
        console.insert(tk.END, "Errore: Prodotto non trovato.\n")

# Stile e bottone con icona
style = ttk.Style()
style.configure('my.TButton', font=('Helvetica', 12), background='blue', foreground='white')

icon = PhotoImage(file='img/button.png')  
button_nfc = ttk.Button(root, text="Simula scansione NFC Prodotto", image=icon, compound=tk.LEFT, style='TButton', command=simula_scansione_nfc)
button_nfc.image = icon
button_nfc.grid(row=3, columnspan=2, pady=20)

root.mainloop()
