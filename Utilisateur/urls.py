
from django.urls import path

from Utilisateur import views
from Utilisateur.views import Inscription, Connexion_utlisateur, accueil_utilisateur, detail_utilisateur, publier_photo, \
    acceuil, reception_message, envoyer_message_images, envoyer_message_text, envoyer_message_audio, liker_publication, \
    commenter_publication, afficher_commentaire, get_comment_count, start_video_call, toute_les_videos

app_name = 'Utilisateur'

urlpatterns = [
    path('', Inscription, name='Inscription'),
    path('Connexion/', Connexion_utlisateur.as_view(), name='Connexion_utlisateur'),
    path('apk/accueil_utilisateur/', accueil_utilisateur, name='accueil_utilisateur'),
    path('detail_utilisateur/<int:utilisateur_detail_id>/', detail_utilisateur, name='detail_utilisateur'),
    path('apk/envoyer_message_images/', envoyer_message_images, name='envoyer_message_images'),
    path('apk/envoyer_message_text/', envoyer_message_text, name='envoyer_message_text'),
    path('apk/envoyer_message_audio/', envoyer_message_audio, name='envoyer_message_audio'),
    path('apk/publier_photo/', publier_photo, name='publier_photo'),
    path('apk/acceuil/', acceuil, name='acceuil'),
    path('apk/reception_message/', reception_message, name='reception_message'),
    path('apk/liker_publication/', liker_publication, name='liker_publication'),
    path('apk/commenter_publication/', commenter_publication, name='commenter_publication'),
    path('apk/afficher_commentaire/', afficher_commentaire, name='afficher_commentaire'),
    path('apk/get_comment_count/', get_comment_count, name='get_comment_count'),
    path('creer/', views.creer_publication, name='creer_publication'),
    path('parametre/', views.parametre, name='parametre'),
    path('utilisateur_fini_ecrire/', views.utilisateur_fini_ecrire, name='utilisateur_fini_ecrire'),
    path('utilisateur_en_train_decrire/', views.utilisateur_en_train_decrire, name='utilisateur_en_train_decrire'),
    path('UpdateThemeSombre/', views.UpdateThemeSombre.as_view(), name='UpdateThemeSombre'),
    path('check_typing_status/', views.check_typing_status, name='check_typing_status'),
    path('updateEmpreinte/', views.updateEmpreinte.as_view(), name='updateEmpreinte'),
    path('api/auth_options/', views.get_auth_options, name='auth_options'),
    path('api/messages/non-lus/', views.nombre_messages_non_lus, name='nombre_messages_non_lus'),
    path('start-video-call/', start_video_call, name='start_video_call'),
    path('toute_les_videos/', toute_les_videos, name='toute_les_videos'),

]
