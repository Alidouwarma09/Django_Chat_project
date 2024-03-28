
from django.urls import path

from Utilisateur.views import Inscription

app_name = 'utilisateur'

urlpatterns = [
    path('', Inscription, name='Inscription'),
]
