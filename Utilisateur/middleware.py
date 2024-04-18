from user_agents import parse
from django.http import HttpResponseForbidden


class MobileRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Obtenir l'agent utilisateur de la requête
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        print(user_agent)

        # Vérifier si l'agent utilisateur contient les sous-chaînes souhaitées
        contains_sdk_gphone = "sdk_gphone_x86_64 Build" in user_agent
        contains_537_36median = "537.36median" in user_agent

        if contains_sdk_gphone and contains_537_36median:
            return self.get_response(request)
        else:
            return self.get_response(request)
            # return HttpResponseForbidden(f"Vous utilisez le User-Agent: {user_agent}, qui n'est pas autorisé pour accéder à cette page.")

