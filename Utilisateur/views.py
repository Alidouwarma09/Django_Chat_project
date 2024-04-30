import json
import os
import time

from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client

from Chat import settings
from Model.models import Utilisateur, Message, Like, Comment, Publication
from Utilisateur.forms import InscriptionForm, ConnexionForm, MessageForm, MessageimagesForm, \
    MessageAudioForm, PhotoForm


# Create your views here

def Inscription(request):
    if request.method == 'POST':
        form = InscriptionForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Inscription reussi.')
            return redirect('Utilisateur:Connexion_utlisateur')
    else:
        form = InscriptionForm()

    return render(request, 'inscription_utilisateur.html', {'form': form})


class Connexion_utlisateur(LoginView):
    template_name = 'connexion_utilisateur.html'
    form_class = ConnexionForm

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('Utilisateur:acceuil')
        return super().get(request, *args, **kwargs)

    def form_invalid(self, form):
        form.add_error('username', 'Nom d\'utilisateur incorrect')
        form.add_error('password', 'Mot de passe incorrect')
        return self.render_to_response(self.get_context_data(form=form))

    def get_success_url(self) -> str:
        if hasattr(self.request.user, 'roles') and self.request.user.roles == 'utilisateur':
            return reverse('Utilisateur:acceuil')
        return super().get_success_url()


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def acceuil(request):
    Publication_alls = Publication.objects.all().order_by('-date_publication')
    liked_photos = [like.publication_id for like in Like.objects.filter(utilisateur=request.user)]
    utilisateur_connecte = request.user if request.user.is_authenticated else None
    publication_likes = {}
    for photo in Publication_alls:
        publication_likes[photo.id] = photo.count_likes()
    context = {
        'utilisateur_connecte': utilisateur_connecte,
        'Publication_alls': Publication_alls,
        'user': request.user,
        'liked_photos': liked_photos,
        'publication_likes': publication_likes,
    }

    return render(request, 'accueil_utilisateur.html', context)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def accueil_utilisateur(request):
    connecte_id = request.user.id
    utilisateurs = Utilisateur.objects.exclude(id=connecte_id)

    for utilisateur in utilisateurs:
        utilisateur.nombre_messages_non_lus = Message.objects.filter(
            recoi=request.user,
            envoi=utilisateur,
            vu=False
        ).count()
        dernier_message = Message.objects.filter(
            recoi=request.user,
            envoi=utilisateur
        ).order_by('-timestamp').first()

        if dernier_message and dernier_message.contenu_message:
            mots = dernier_message.contenu_message.split()[:3]
            utilisateur.preview_message = ' '.join(mots)
        else:
            utilisateur.preview_message = "auccun message"

    context = {
        'utilisateurs': utilisateurs,
    }
    return render(request, 'tout_les_utilisateurs.html', context)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def detail_utilisateur(request, utilisateur_detail_id):
    messages = Message.objects.filter(recoi=request.user, envoi_id=utilisateur_detail_id, vu=False)
    messages.update(vu=True)
    utilisateur_detail = get_object_or_404(Utilisateur, id=utilisateur_detail_id)
    return render(request, 'detail_utilisateur.html', {'utilisateur_detail': utilisateur_detail})


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
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@csrf_exempt
def publier_photo(request):
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save(commit=False)
            photo.utilisateur = request.user
            photo = form.save()
            return JsonResponse({'success': True, 'redirect_url': reverse('Utilisateur:acceuil')})
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Méthode non autorisée.'}, status=405)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def reception_message(request):
    utilisateur = request.user
    utilisateur_detail_id = request.GET.get('utilisateur_detail_id')
    chats = Message.objects.filter(
        (Q(envoi=utilisateur) & Q(recoi_id=utilisateur_detail_id)) |
        (Q(recoi=utilisateur) & Q(envoi_id=utilisateur_detail_id))
    ).select_related('envoi', 'recoi').order_by('timestamp')  # Ajout de select_related

    arr = []
    for chat in chats:
        # Gérer correctement l'accès à l'image du récepteur
        reco_image_url = chat.envoi.image.url if chat.recoi.image else None

        message_dict = {
            'id': chat.id,
            'recoi_id': chat.recoi_id,
            'envoi_id': chat.envoi_id,
            'recoi_image': reco_image_url,
            'contenu_message': chat.contenu_message,
            'timestamp': chat.timestamp,
            'images': chat.images.url if chat.images else None,
            'audio': chat.audio.url if chat.audio else None
        }
        arr.append(message_dict)
    return JsonResponse(arr, safe=False)


def utilisateur_en_train_decrire(request):
    if request.method == 'POST':
        utilisateur_id = request.user.id
        utilisateur = Utilisateur.objects.get(id=utilisateur_id)
        utilisateur.en_train_decrire = True
        utilisateur.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def utilisateur_fini_ecrire(request):
    if request.method == 'POST':
        utilisateur_id = request.user.id
        utilisateur = Utilisateur.objects.get(id=utilisateur_id)
        utilisateur.en_train_decrire = False
        utilisateur.save()
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def check_typing_status(request):
    utilisateur_id2 = request.GET.get('utilisateur_id')
    utilisateur = Utilisateur.objects.get(id=utilisateur_id2)
    return JsonResponse({'en_train_decrire': utilisateur.en_train_decrire})


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def liker_publication(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        publication_id = data.get('publication_id')
        try:
            publication = Publication.objects.get(id=publication_id)
            utilisateur = request.user
            like, created = Like.objects.get_or_create(utilisateur=utilisateur, publication=publication)

            if not created:
                like.delete()
                liked = False
            else:
                liked = True
            return JsonResponse({'liked': liked})

        except Publication.DoesNotExist:
            return JsonResponse({'error': 'Publication non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def commenter_publication(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        publication_id = data.get('publication_id')
        texte = data.get('texte')
        if publication_id is None or texte is None:
            return JsonResponse({'error': 'Données POST manquantes'}, status=400)
        try:
            publication_id = int(publication_id)
        except ValueError:
            return JsonResponse({'error': 'Format de données invalide'}, status=400)
        utilisateur = request.user

        try:
            publication = Publication.objects.get(id=publication_id)
        except Publication.DoesNotExist:
            return JsonResponse({'error': 'Publication introuvable'}, status=404)
        commentaire = Comment(utilisateur=utilisateur, publication=publication, texte=texte)
        commentaire.save()
        return JsonResponse({
            'texte': texte,
            'publication_id': publication_id,
            'utilisateur_nom': utilisateur.nom,
            'utilisateur_prenom': utilisateur.prenom,
        })
    else:
        # Méthode non autorisée
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def afficher_commentaire(request):
    publication_id = request.GET.get('publication_id')
    commentaire = Comment.objects.filter(publication_id=publication_id).order_by('-date_comment')
    comments_data = []
    for comment in commentaire:
        comments_data.append({
            'utilisateur_id': comment.utilisateur.id,
            'utilisateur': f'{comment.utilisateur.nom} {comment.utilisateur.prenom}',
            'texte': comment.texte,
            'date_comment': comment.date_comment.strftime('%Y-%m-%d %H:%M:%S'),
        })
    return JsonResponse(comments_data, safe=False)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def get_comment_count(request):
    publication_id = request.GET.get('publication_id')
    comment_count = Comment.objects.filter(publication_id=publication_id).count()
    return JsonResponse({'comment_count': comment_count})


def creer_publication(request):
    if request.method == 'POST':
        utilisateur_id = request.user.id
        texte = request.POST.get('texte')
        couleur_fond = request.POST.get('couleur_fond')
        publication = Publication.objects.create(utilisateur_id=utilisateur_id, contenu=texte,
                                                 couleur_fond=couleur_fond)
        return redirect('Utilisateur:acceuil')


def parametre(request):
    return render(request, 'parametre.html')


@method_decorator(login_required(login_url='Utilisateur:Connexion_utlisateur'), name='dispatch')
class UpdateThemeSombre(View):
    def post(self, request, *args, **kwargs):
        theme_sombre = request.POST.get('theme_sombre', 'false')
        request.user.theme_sombre = theme_sombre.lower() == 'true'
        request.user.save()
        return JsonResponse({'success': True, 'theme_sombre': request.user.theme_sombre})


class updateEmpreinte(View):
    def post(self, request, *args, **kwargs):
        autoriser_empreinte = request.POST.get('autoriser_empreinte', 'false')
        request.user.autoriser_empreinte = autoriser_empreinte.lower() == 'true'
        request.user.save()
        return JsonResponse({'success': True, 'autoriser_empreinte': request.user.autoriser_empreinte})


def get_auth_options(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    user = request.user
    # Créez un challenge aléatoire pour la sécurité
    challenge = os.urandom(32).hex()

    options = {
        "publicKey": {
            "challenge": challenge,
            "rp": {
                "name": "Exemple WebAuthn App"
            },
            "user": {
                "id": str(user.id),  # Nécessaire d'être en bytes normalement, dépend de votre implémentation
                "name": user.username,
                "displayName": f"{user.first_name} {user.last_name}"
            },
            "authenticatorSelection": {
                "authenticatorAttachment": "platform",
                "userVerification": "required"
            }
        }
    }
    return JsonResponse(options)


def nombre_messages_non_lus(request):
    if request.user.is_authenticated:
        user_id = request.user.id
        count = Message.objects.filter(recoi_id=user_id, vu=False).count()
        return JsonResponse({'nombre_non_lus': count})


def start_video_call(request):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    utilisateur_id = request.GET.get('utilisateur_id')
    try:
        call = client.calls.create(
            twiml='<Response><Dial><Number>+2250789817277</Number></Dial></Response>',
            to='+2250789817277',
            from_='+2250789817277'
        )
        print("yessssss")
        return JsonResponse({'success': True, 'call_sid': call.sid})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
