#verifica_lvl_1.py
import json
from web3 import Web3

# Connessione al nodo Ethereum tramite Infura
infura_url = 'https://sepolia.infura.io/v3/911f720870ce4d18951c55a6943ebd55'
web3 = Web3(Web3.HTTPProvider(infura_url))

def carica_dati(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Funzione per verificare se l'ID Unico è presente nel file del cliente
def verifica_id_unico(id_unico, file_path_cliente):
    dati_cliente = carica_dati(file_path_cliente)
    return any(cliente["ID Unico"] == id_unico for cliente in dati_cliente)


# Ottiene dettagli della transazione dalla blockchain
def verifica_blockchain(hash_transazione):
    try:
        transazione = web3.eth.get_transaction(hash_transazione)
        if transazione:
            value_in_ether = transazione['value'] / 10**18  # Converti l'importo da wei a ether
            return {
                "hash": transazione['hash'].hex(),
                "blockHash": transazione['blockHash'].hex(),
                "blockNumber": transazione['blockNumber'],
                "from": transazione['from'],
                "to": transazione['to'],
                "value": value_in_ether,  # Utilizza il valore convertito
                "gasPrice": transazione['gasPrice'],
                "gas": transazione['gas'],
                "nonce": transazione['nonce'],
                "transactionIndex": transazione['transactionIndex']
            }
    except Exception as e:
        print(f"Errore durante la verifica della transazione: {str(e)}")
        return None


# Verifica l'autenticità del prodotto usando i dati del produttore e del cliente
def verifica_autenticità(id_unico, chiave_pub_nfc, file_path_produttore, file_path_cliente):
    dati_produttore = carica_dati(file_path_produttore)
    if verifica_id_unico(id_unico, file_path_cliente):
        for prodotto in dati_produttore:
            if prodotto["ID Unico"] == id_unico and prodotto["PublicKey NFC"] == chiave_pub_nfc:
                return verifica_blockchain(prodotto["Hash della Transazione"])
    return False
