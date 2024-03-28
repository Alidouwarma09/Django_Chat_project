
from django.urls import path

from Utilisateur.views import Inscription, Connexion_utlisateur, accueil_utilisateur

app_name = 'utilisateur'

urlpatterns = [
    path('', Inscription, name='Inscription'),
    path('Connexion/', Connexion_utlisateur.as_view(), name='Connexion_utlisateur'),
    path('accueil_utilisateur/', accueil_utilisateur, name='accueil_utilisateur'),
]
