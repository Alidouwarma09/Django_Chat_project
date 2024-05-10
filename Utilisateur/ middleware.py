# fichier Utilisateur/middleware.py

class ShowOriginMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get('Origin')
        print('Origin:', origin)
        response = self.get_response(request)
        return response
