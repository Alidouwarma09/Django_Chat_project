from django.contrib.auth import logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST


@require_POST
def Deconnexion(request):
    logout(request)
    return JsonResponse({'succes': 'Déconnexion réussie.'})
