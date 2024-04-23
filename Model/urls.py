
from django.urls import path

from Model.views import Deconnexion

app_name = 'Model'

urlpatterns = [
    path('Deconnexion/', Deconnexion.as_view(), name='Deconnexion'),
]
