#verifica_lvl_2.py
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
            return {
                "hash": transazione['hash'].hex(),
                "blockHash": transazione['blockHash'].hex(),
                "blockNumber": transazione['blockNumber'],
                "from": transazione['from'],
                "to": transazione['to'],
                "value": transazione['value'] / 10**18,  # Converti l'importo da wei a ether
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

# Verifica delle firme digitali del produttore
def verifica_firme_digitali(firma_produttore, dati_prodotto):
    # Implementazione della logica per verificare la firma digitale del produttore
    pass

# Implementazione degli smart contracts per la verifica avanzata
def verifica_smart_contracts(id_unico, chiave_pub_nfc, file_path_produttore, file_path_cliente):
    # Implementazione della logica per l'uso degli smart contracts
    pass

# Funzione di verifica complessiva del livello 2
def verifica_lvl_2(id_unico, chiave_pub_nfc, file_path_produttore, file_path_cliente):
    blockchain_result = verifica_autenticità(id_unico, chiave_pub_nfc, file_path_produttore, file_path_cliente)
    if blockchain_result:
        firma_produttore = blockchain_result.get("firma_produttore")
        dati_prodotto = blockchain_result.get("dati_prodotto")
        if verifica_firme_digitali(firma_produttore, dati_prodotto):
            return verifica_smart_contracts(id_unico, chiave_pub_nfc, file_path_produttore, file_path_cliente)
    return False

