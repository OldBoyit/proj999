Sentinel999
Questo progetto, parte di Project999, mira a identificare e prevedere il rischio di contraffazione nei prodotti Made in Italy. Utilizza un modello di machine learning per analizzare i dati relativi ai prodotti e prevede il rischio di contraffazione.
L'obiettivo è quello, quando potremo addestrarlo su set di dati reali, di riconoscere i pattern di contraffazione ed individuare dove, in tutto il percorso del prodotto dalla fabbrica, al trasporto, fino al cliente finale, avviene la contraffazione o dove risiede più rischio per ogni prodotto.

Struttura del Progetto
Il progetto è organizzato nelle seguenti sezioni:

Caricamento dei dati e previsione: Viene caricata una combinazione di dati relativi ai prodotti, e viene utilizzato un modello di Random Forest per prevedere il rischio di contraffazione.
Preparazione dei dati: I dati relativi ai prodotti sono combinati con i dati dei prodotti contraffatti per calcolare le probabilità di rischio.
Predizione del rischio: Viene determinato il rischio associato a ciascun prodotto, categorizzando i prodotti in base al livello di rischio.
Requisiti
Python 3.8+
pandas
scikit-learn
imbalanced-learn
joblib
Installazione
Clona il repository:
bash

git clone <url-del-repository>
cd <nome-del-repository>

Installa i requisiti:

pip install -r requirements.txt