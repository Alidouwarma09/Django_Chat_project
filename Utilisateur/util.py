# Dans un fichier util.py
import requests


url = 'https://api.example.com/data'
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    # Traitez les données reçues ici
else:
    print('Erreur lors de la requête :', response.status_code)
