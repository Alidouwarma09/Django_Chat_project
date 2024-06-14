
from django.urls import path

from Utilisateur import views
from Utilisateur.views import Inscription, connexion_utilisateur, detail_utilisateur, \
    publier_photo, \
    get_publications, envoyer_message_images, envoyer_message_text, envoyer_message_audio, liker_publication, \
    get_comment_count, start_video_call, get_comments, \
    messages_non_lus_sse, get_publications_video, StoryView, StoryGetView, utilisateur_info, \
    tout_les_utilisateurs, utilisateurs_select, MessageSSEView

app_name = 'Utilisateur'

urlpatterns = [
    path('api/inscription/', Inscription, name='Inscription'),
    path('Connexion/', connexion_utilisateur, name='Connexion_utlisateur'),
    path('detail_utilisateur/<int:utilisateur_detail_id>/', detail_utilisateur, name='detail_utilisateur'),
    path('api/envoyer_message_images/', envoyer_message_images, name='envoyer_message_images'),
    path('api/envoyer_message_text/', envoyer_message_text, name='envoyer_message_text'),
    path('api/envoyer_message_audio/', envoyer_message_audio, name='envoyer_message_audio'),
    path('apk/publier_photo/', publier_photo, name='publier_photo'),
    path('api/get_publications/', get_publications, name='get_publications'),
    path('api/get_publications_video/', get_publications_video, name='get_publications_video'),
    path('api/liker_publication/', liker_publication, name='liker_publication'),
    path('api/post_comment/<int:publication_id>', views.post_comment, name='post_comment'),
    path('api/post_reponse_commentaire/<int:commentaire_id>', views.repondre_comment, name='repondre_comment'),
    path('apk/get_comment_count/', get_comment_count, name='get_comment_count'),
    path('api/creer_publication/', views.creer_publication, name='creer_publication'),
    path('api/creer_publication_video/', views.creer_publication_video, name='creer_publication_video'),
    path('api/creer_publication_photo/', views.creer_publication_photo, name='creer_publication_photo'),
    path('utilisateur_fini_ecrire/', views.utilisateur_fini_ecrire, name='utilisateur_fini_ecrire'),
    path('utilisateur_en_train_decrire/', views.utilisateur_en_train_decrire, name='utilisateur_en_train_decrire'),
    path('UpdateThemeSombre/', views.UpdateThemeSombre.as_view(), name='UpdateThemeSombre'),
    path('check_typing_status/', views.check_typing_status, name='check_typing_status'),
    path('updateEmpreinte/', views.updateEmpreinte.as_view(), name='updateEmpreinte'),
    path('api/auth_options/', views.get_auth_options, name='auth_options'),
    path('api/messages/non-lus/', views.nombre_messages_non_lus, name='nombre_messages_non_lus'),
    path('start-video-call/', start_video_call, name='start_video_call'),
    path('api/get_comments/<int:publication_id>/', get_comments, name='get_comments'),
    path('api/message_sse/', MessageSSEView.as_view(), name='message_sse'),
    path('apk/messages_non_lus_sse/', messages_non_lus_sse, name='messages_non_lus_sse'),
    path('api/stories/', StoryView.as_view(), name='story_view'),
    path('api/getstories/', StoryGetView.as_view(), name='story_view'),
    path('apk/stream_messages/<int:utilisateur_detail_id>/', views.stream_messages, name='stream_messages'),
    path('api/user_info/', utilisateur_info, name='utilisateur_info'),
    path('api/update_user/', views.update_user, name='update_user'),
    path('api/utilisateurs/', tout_les_utilisateurs, name='utilisateur-list'),
    path('api/utilisateurs_select/<int:utilisateur_id>/', utilisateurs_select, name='utilisateur-select'),
]
