import time

from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.urls import reverse
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from Model.models import Utilisateur, Message, VideoPhoto
from Utilisateur.forms import InscriptionForm, ConnexionForm, MessageForm, MessageimagesForm, \
    MessageAudioForm, PhotoForm


# Create your views here

def Inscription(request):
    if request.method == 'POST':
        form = InscriptionForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Inscription reussi.')
            return redirect('conducteur:ajouter_conducteur')
        else:
            print(form.errors)
    else:
        form = InscriptionForm()

    return render(request, 'inscription_utilisateur.html', {'form': form})


class Connexion_utlisateur(LoginView):
    template_name = 'connexion_utilisateur.html'
    form_class = ConnexionForm

    def get_success_url(self) -> str:
        if self.request.user.roles == 'utilisateur':
            return reverse('Utilisateur:acceuil')


def acceuil(request):
    video_publier = VideoPhoto.objects.all()
    return render(request, 'accueil_utilisateur.html', {'video_publier': video_publier})


def accueil_utilisateur(request):
    utilisateurs = Utilisateur.objects.all()
    return render(request, 'accueil_utilisateur.html', {'utilisateurs': utilisateurs})


def detail_utilisateur(request, utilisateur_detail_id):
    utilisateur_detail = get_object_or_404(Utilisateur, id=utilisateur_detail_id)
    return render(request, 'accueil_utilisateur.html', {'utilisateur_detail': utilisateur_detail})


def envoyer_message_images(request):
    if request.method == 'POST':
        form = MessageimagesForm(request.POST, request.FILES)
        if form.is_valid():
            images = request.FILES.getlist('images')
            envoi_utilisateur = request.user
            utilisateur_recoi = get_object_or_404(Utilisateur, id=request.POST.get('utilisateur_id'))
            for image in images:
                nouveau_message = Message.objects.create(
                    envoi=envoi_utilisateur,
                    recoi=utilisateur_recoi,
                    images=image
                )
                nouveau_message.save()
            return JsonResponse({'status': 'success',
                                 'timestamp': nouveau_message.timestamp.strftime("%Y-%m-%d %H:%M:%S")})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def envoyer_message_text(request):
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            contenu_message = form.cleaned_data['contenu_message']
            envoi_utilisateur = request.user
            utilisateur_recoi = get_object_or_404(Utilisateur, id=request.POST.get('utilisateur_id'))
            nouveau_message = Message.objects.create(
                envoi=envoi_utilisateur,
                recoi=utilisateur_recoi,
                contenu_message=contenu_message
            )
            nouveau_message.save()
            print("reussi")
            return JsonResponse({'status': 'success', 'message': contenu_message,
                                 'timestamp': nouveau_message.timestamp.strftime("%Y-%m-%d %H:%M:%S")})
        else:

            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def envoyer_message_audio(request):
    if request.method == 'POST':
        form = MessageAudioForm(request.POST, request.FILES)
        if form.is_valid():
            audio = request.FILES.get('audio')
            envoi_utilisateur = request.user
            utilisateur_recoi = get_object_or_404(Utilisateur, id=request.POST.get('utilisateur_id'))
            nouveau_message = Message.objects.create(
                envoi=envoi_utilisateur,
                recoi=utilisateur_recoi,
                audio=audio
            )
            nouveau_message.save()
            return JsonResponse({'status': 'success',
                                 'timestamp': nouveau_message.timestamp.strftime("%Y-%m-%d %H:%M:%S")})
        else:
            print('5f')
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@csrf_exempt
def publier_photo(request):
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save()
            return JsonResponse({'success': True, 'message': 'L\'image a été publiée avec succès.'})
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Méthode non autorisée.'}, status=405)


def reception_message(request):
    utilisateur = request.user
    utilisateur_detail_id = request.GET.get('utilisateur_detail_id')
    chats = Message.objects.filter(
        (Q(envoi=utilisateur) & Q(recoi_id=utilisateur_detail_id)) |
        (Q(recoi=utilisateur) & Q(envoi_id=utilisateur_detail_id))
    ).order_by('timestamp')

    arr = []
    for chat in chats:
        message_dict = {
            'id': chat.id,
            'recoi_id': chat.recoi_id,
            'contenu_message': chat.contenu_message,
            'timestamp': chat.timestamp,
            'images': chat.images.url if chat.images else None,
            'audio': chat.audio.url if chat.audio else None
        }
        arr.append(message_dict)
    return JsonResponse(arr, safe=False)
