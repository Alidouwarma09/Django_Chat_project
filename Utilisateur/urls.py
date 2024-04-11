
from django.urls import path

from Utilisateur import views
from Utilisateur.views import Inscription, Connexion_utlisateur, accueil_utilisateur, detail_utilisateur, publier_video, acceuil, reception_message

app_name = 'Utilisateur'

urlpatterns = [
    path('', Inscription, name='Inscription'),
    path('Connexion/', Connexion_utlisateur.as_view(), name='Connexion_utlisateur'),
    path('accueil_utilisateur/', accueil_utilisateur, name='accueil_utilisateur'),
    path('detail_utilisateur/<int:utilisateur_detail_id>/', detail_utilisateur, name='detail_utilisateur'),
    path('envoyer_message/', views.envoyer_message, name='envoyer_message'),
    path('publier_video/', publier_video, name='publier_video'),
    path('acceuil/', acceuil, name='acceuil'),
    path('reception_message/', reception_message, name='reception_message')

]
