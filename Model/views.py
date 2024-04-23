from django.contrib.auth import logout
from django.contrib.auth.views import LogoutView
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse


# Create your views here.
class Deconnexion(LogoutView):
    def get_success_url(self):
        return reverse('Utilisateur:Connexion_utlisateur')

    def post(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect(self.get_success_url())
