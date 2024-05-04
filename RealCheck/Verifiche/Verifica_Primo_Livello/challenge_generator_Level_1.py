#challenge_generator_Level_1.py
import hashlib

# Funzione per generare una sfida per il Livello 1 (Base)
def generate_challenge_level1(public_key, seed):
    # Concateniamo la chiave pubblica e il seed
    challenge_input = public_key + seed
    # Calcoliamo l'hash SHA256 della concatenazione
    challenge_hash = hashlib.sha256(challenge_input.encode()).hexdigest()
    # Restituiamo i primi 32 caratteri dell'hash come sfida
    return challenge_hash[:32]

Utilizzo per il Livello 1
livello1_challenge = generate_challenge_level1("662de9be974d3950a04324fd", "965")
print("Sfida Livello 1:", livello1_challenge)
