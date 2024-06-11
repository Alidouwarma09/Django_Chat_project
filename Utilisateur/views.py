import asyncio
import imghdr
import json
import logging
import os
import time
from asyncio import sleep
from threading import Lock

from asgiref.sync import sync_to_async
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q
from django.shortcuts import redirect, get_object_or_404
from django.http import StreamingHttpResponse
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from rest_framework.authentication import TokenAuthentication
from twilio.rest import Client
from django.utils import timezone
from Chat import settings
from Model.models import Utilisateur, Message, Like, Comment, Publication, Story
from Utilisateur.forms import InscriptionForm, MessageForm, MessageimagesForm, \
    MessageAudioForm, PhotoForm
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework.authtoken.models import Token


# Create your views here


def Inscription(request):
    if request.method == 'POST':
        form = InscriptionForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            logger.info('Inscription réussie pour l\'utilisateur avec l\'ID : %s', user.id)
            return JsonResponse({'success': True, 'user_id': user.id})
        else:
            logger.error('Erreurs lors de l\'inscription : %s', form.errors)
            return JsonResponse({'success': False, 'errors': form.errors})
    return JsonResponse({'success': False, 'error': 'Requête invalide'}, status=400)


FIELD_MAPPING = {
}


@csrf_exempt
def update_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            field = data.get('field')
            new_value = data.get('new_value')
            print(f"Data received: {data}")

            if not user_id or not field or not new_value:
                return JsonResponse({'success': False, 'error': 'Données invalides'}, status=400)
            mapped_field = FIELD_MAPPING.get(field, field)

            try:
                user = Utilisateur.objects.get(id=user_id)
                if mapped_field == 'nom_utilisateur':
                    user.nom = new_value
                elif mapped_field == 'prenom_utilisateur':
                    user.prenom = new_value
                elif mapped_field == 'numero_utilisateur':
                    user.username = new_value
                user.save()
                print(user)

                updated_user_info = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'nom': user.nom,
                    'prenom': user.prenom,
                    'roles': user.roles,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_admin': user.is_admin,
                    'image': user.image.url if user.image else None,
                }
                return JsonResponse({'success': True, 'user': updated_user_info})
            except Utilisateur.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Utilisateur non trouvé'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Données JSON invalides'}, status=400)

    return JsonResponse({'success': False, 'error': 'Requête invalide'}, status=400)


logger = logging.getLogger(__name__)


def connexion_utilisateur(request):
    logger.info("Tentative de connexion d'un utilisateur...")

    if request.method != 'POST':
        logger.warning("Méthode HTTP non autorisée utilisée pour la connexion.")
        return JsonResponse({'erreur': 'Méthode non autorisée'}, status=405)

    data = json.loads(request.body.decode('utf-8'))
    username = data.get('username')
    password = data.get('password')
    logger.debug(f"Reçu - Nom d'utilisateur: {username}, Mot de passe: {'*' * len(password) if password else 'N/A'}")

    if not username or not password:
        logger.error("Nom d'utilisateur ou mot de passe non fourni.")
        return JsonResponse({'erreur': 'Nom d\'utilisateur ou mot de passe requis !'}, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        logger.info(f"Utilisateur {username} connecté avec succès.")
        token, _ = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key})
    else:
        logger.error(f"Échec de la connexion pour l'utilisateur {username}.")
        return JsonResponse({'erreur': 'Nom d\'utilisateur ou mot de passe incorrect !'}, status=400)


def utilisateur_info(request):
    auth_result = TokenAuthentication().authenticate(request)

    if auth_result is not None:
        user, _ = auth_result
    data = {
        'nom_utilisateur': user.nom,
        'id': user.id,
        'numero_utilisateur': user.username,
        'prenom_utilisateur': user.prenom,
        'image_utilisateu': user.image.url
    }
    return JsonResponse(data)


def utilisateurs_select(request, utilisateur_id):
    utilisateur = Utilisateur.objects.filter(id=utilisateur_id).first()
    if not utilisateur:
        return JsonResponse({'error': 'Utilisateur non trouvé'}, status=404)

    data = {
        'nom_utilisateur': utilisateur.nom,
        'prenom_utilisateur': utilisateur.prenom,
        'image_utilisateur': utilisateur.image.url
    }
    return JsonResponse(data)


def tout_les_utilisateurs(request):
    utilisateurs = Utilisateur.objects.all()
    utilisateurs_list = []

    for utilisateur in utilisateurs:
        utilisateur_data = {
            'id': utilisateur.id,
            'nom': utilisateur.nom,
            'prenom': utilisateur.prenom,
            'image': request.build_absolute_uri(utilisateur.image.url)
        }
        utilisateurs_list.append(utilisateur_data)

    return JsonResponse({'utilisateurs': utilisateurs_list})


def get_publications(request):
    try:
        publications = Publication.objects.filter(video_file='').order_by('-date_publication')
        data = [{'id': pub.id,
                 'titre': pub.titre,
                 'utilisateur_nom': pub.utilisateur.nom,

                 'utilisateur_prenom': pub.utilisateur.prenom,
                 'couleur_fond': pub.couleur_fond,
                 'contenu': pub.contenu,
                 'count_likes': pub.count_likes(),
                 'date_publication': pub.date_publication,
                 'utilisateur_image': request.build_absolute_uri(
                     pub.utilisateur.image.url) if pub.utilisateur.image else None,
                 'photo_file_url': request.build_absolute_uri(pub.photo_file.url) if pub.photo_file else None}
                for pub in publications]
        return JsonResponse(data, safe=False)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Aucune publication trouvée'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_publications_video(request):
    try:
        publications = Publication.objects.exclude(video_file='').order_by('-date_publication')

        data = []
        for pub in publications:
            video_url = str(pub.video_file)
            print("URL de la vidéo:", video_url)
            data.append({
                'id': pub.id,
                'titre': pub.titre,
                'utilisateur_nom': pub.utilisateur.nom,
                'utilisateur_prenom': pub.utilisateur.prenom,
                'count_likes': pub.count_likes(),
                'date_publication': pub.date_publication,
                'videos_file': video_url,
                'utilisateur_image': request.build_absolute_uri(
                    pub.utilisateur.image.url) if pub.utilisateur.image else None
            })
        return JsonResponse(data, safe=False)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Aucune publication trouvée'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def detail_utilisateur(request, utilisateur_detail_id):
    messages = Message.objects.filter(recoi=request.user, envoi_id=utilisateur_detail_id, vu=False)
    messages.update(vu=True)
    utilisateur_detail = get_object_or_404(Utilisateur, id=utilisateur_detail_id)
    return render(request, 'detail_utilisateur.html', {'utilisateur_detail': utilisateur_detail})


def messages_utilisateur(request, utilisateur_id):
    auth_result = TokenAuthentication().authenticate(request)

    if auth_result is None:
        return JsonResponse({'error': 'Utilisateur non authentifié'}, status=401)

    utilisateur_connecte, _ = auth_result

    try:
        messages = Message.objects.filter(
            (Q(envoi=utilisateur_connecte) & Q(recoi_id=utilisateur_id)) |
            (Q(envoi_id=utilisateur_id) & Q(recoi=utilisateur_connecte))
        ).values('contenu_message', 'timestamp', 'envoi', 'recoi')
        return JsonResponse({'messages': list(messages)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


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
            auth_result = TokenAuthentication().authenticate(request)

            if auth_result is not None:
                envoi_utilisateur, _ = auth_result
                utilisateur_recoi = get_object_or_404(Utilisateur, id=request.POST.get('utilisateur_id'))
                nouveau_message = Message.objects.create(
                    envoi=envoi_utilisateur,
                    recoi=utilisateur_recoi,
                    contenu_message=contenu_message
                )
                nouveau_message.save()
                return JsonResponse({
                    'status': 'success',
                    'contenu_message': contenu_message,
                    'timestamp': nouveau_message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
                })
            else:
                return JsonResponse({'status': 'error', 'message': 'Authentication failed'})
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


def liker_publication(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        publication_id = data.get('publication_id')
        try:
            publication = Publication.objects.get(id=publication_id)
            auth_result = TokenAuthentication().authenticate(request)

            if auth_result is not None:
                user, _ = auth_result
            like, created = Like.objects.get_or_create(utilisateur=user, publication=publication)

            if not created:
                like.delete()
                liked = False
            else:
                liked = True

            count_likes = Like.objects.filter(publication=publication).count()
            print(count_likes)
            return JsonResponse({'liked': liked, 'count_likes': count_likes})

        except Publication.DoesNotExist:
            return JsonResponse({'error': 'Publication non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def post_comment(request, publication_id):
    if request.method == 'POST':
        auth_result = TokenAuthentication().authenticate(request)

        if auth_result is not None:
            user, _ = auth_result
            data = json.loads(request.body)
            texte = data.get("texte")

            if not texte:
                return JsonResponse({'error': 'Le texte du commentaire ne peut pas être vide'}, status=400)

            comment = Comment(utilisateur=user, publication_id=publication_id, texte=texte)
            comment.save()

            return JsonResponse({'message': 'Commentaire ajouté avec succès'}, status=201)
        else:
            return JsonResponse({'error': 'Authentification invalide'}, status=401)


lock = Lock()


@csrf_exempt
def get_comments(request, publication_id):
    comments = Comment.objects.filter(publication_id=publication_id).order_by('-date_comment')
    comments_data = [{
        'id': comment.id,
        'texte': comment.texte,
        'utilisateur_nom': comment.utilisateur.nom,
        'utilisateur_prenom': comment.utilisateur.prenom,
        'date_comment': comment.date_commentaire(),
        'utilisateur_image_com': request.build_absolute_uri(
            comment.utilisateur.image.url) if comment.utilisateur.image else None,
    } for comment in comments]
    return JsonResponse(comments_data, safe=False)


@csrf_exempt
def get_user_messages(request, utilisateur_id):
    messages = Message.objects.filter(utilisateur_id=utilisateur_id)
    messages_data = [{
        'id': message.id,
        'contenu_message': message.contenu_message,
        'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        # Ajoutez d'autres champs nécessaires ici
    } for message in messages]
    return JsonResponse(messages_data, safe=False)


class MessageSSEView(View):
    def get(self, request, *args, **kwargs):
        last_message_id_sent = 0  # Initialisez la variable last_message_id_sent

        def event_stream():
            nonlocal last_message_id_sent  # Utilisez nonlocal pour accéder à la variable last_message_id_sent de l'encapsulation externe
            while True:
                messages = Message.objects.filter(id__gt=last_message_id_sent).order_by('-timestamp')[:5]
                if messages:
                    message_data = []
                    for message in messages:
                        # Convertir l'objet Utilisateur en un dictionnaire
                        user_data = {
                            'id': message.envoi.id,
                            'username': message.envoi.username,
                            # Ajoutez d'autres attributs de l'utilisateur si nécessaire
                        }
                        message_data.append({
                            'envoi': user_data,
                            'contenu_message': message.contenu_message,
                            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                        })
                    data = json.dumps({'message': message_data})
                    yield f"data: {data}\n\n"
                    last_message_id_sent = messages[0].id
                time.sleep(1)

        response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        return response


def get_comment_count(request):
    publication_id = request.GET.get('publication_id')
    comment_count = Comment.objects.filter(publication_id=publication_id).count()
    return JsonResponse({'comment_count': comment_count})


def creer_publication(request):
    if request.method == 'POST':
        auth_result = TokenAuthentication().authenticate(request)
        if auth_result is not None:
            user, _ = auth_result
            utilisateur_id = user.id
            data = json.loads(request.body)
            texte = data.get('texte')
            couleur_fond = data.get('couleur_fond')
            publication = Publication.objects.create(utilisateur_id=utilisateur_id, contenu=texte,
                                                     couleur_fond=couleur_fond)
            publication_data = serialize('json', [publication])
            return JsonResponse({'publication': publication_data})
        else:
            return JsonResponse({'error': 'Unauthorized'}, status=401)


def creer_publication_video(request):
    try:
        if request.method == 'POST':
            auth_result = TokenAuthentication().authenticate(request)
            if auth_result is not None:
                user, _ = auth_result
                utilisateur_id = user.id

                titre = request.POST.get('titre')
                video_file = request.FILES.get('video_file')

                if titre and video_file:
                    publication = Publication.objects.create(utilisateur_id=utilisateur_id, titre=titre,
                                                             video_file=video_file)
                    publication_data = serialize('json', [publication])
                    return JsonResponse({'publication': publication_data, 'publication_id': publication.id})
                else:
                    errors = {}
                    if not titre:
                        errors['titre'] = 'Le titre est manquant'
                    if not video_file:
                        errors['video_file'] = 'Le fichier vidéo est manquant'
                    return JsonResponse({'error': 'Données manquantes', 'errors': errors}, status=400)
            else:
                return JsonResponse({'error': 'Unauthorized'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def creer_publication_photo(request):
    try:
        if request.method == 'POST':
            auth_result = TokenAuthentication().authenticate(request)
            if auth_result is not None:
                user, _ = auth_result
                utilisateur_id = user.id

                titre = request.POST.get('titre')
                photo_file = request.FILES.get('photo_file')

                if titre and photo_file:
                    publication = Publication.objects.create(utilisateur_id=utilisateur_id, titre=titre,
                                                             photo_file=photo_file)
                    publication_data = serialize('json', [publication])
                    return JsonResponse({'publication': publication_data, 'publication_id': publication.id})
                else:
                    errors = {}
                    if not titre:
                        errors['titre'] = 'Le titre est manquant'
                    if not photo_file:
                        errors['photo_file'] = 'Le fichier photo est manquant'
                    return JsonResponse({'error': 'Données manquantes', 'errors': errors}, status=400)
            else:
                return JsonResponse({'error': 'Unauthorized'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


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


@require_GET
def messages_non_lus_sse(request):
    def event_stream():
        last_checked_time = None
        while True:
            with lock:
                try:
                    if last_checked_time:
                        new_messages = Message.objects.filter(recoi_id=request.user.id, vu=False).count()
                    else:
                        new_messages = Message.objects.filter(recoi_id=request.user.id, vu=False).count()

                    last_checked_time = timezone.now()
                    data = {
                        'nombre_non_lus': new_messages
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                    sleep(5)

                except Message.DoesNotExist:
                    yield 'data: Test message\n\n'
                    sleep(1)

    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response


@require_GET
def stream_messages(request, utilisateur_detail_id):
    def event_stream():
        last_id = request.GET.get("last_id", 0)
        while True:
            new_messages = Message.objects.filter(
                Q(envoi_id=request.user.id, recoi_id=utilisateur_detail_id) |
                Q(recoi_id=request.user.id, envoi_id=utilisateur_detail_id),
                id__gt=last_id
            ).order_by('id')

            if new_messages.exists():
                last_id = new_messages.last().id
                for message in new_messages:
                    # Vérifier si le message a été envoyé par vous à l'utilisateur détaillé
                    if message.envoi_id == request.user.id and message.recoi_id == utilisateur_detail_id:
                        print("Le message a été envoyé par vous à l'utilisateur détaillé.")
                    elif message.envoi_id == utilisateur_detail_id and message.recoi_id == request.user.id:
                        # Code à exécuter si l'utilisateur détaillé est l'expéditeur
                        print("Le message a été envoyé par l'utilisateur détaillé à vous.")

                    # Autres traitements du message

                messages_json = json.dumps(
                    list(new_messages.values(
                        'id', 'envoi_id', 'recoi_id', 'contenu_message',
                        'timestamp', 'vu', 'audio', 'images')),
                    cls=DjangoJSONEncoder
                )
                yield f"data: {messages_json}\n\n"
            time.sleep(1)

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response['Cache-Control'] = 'no-cache'
    return response


def start_video_call(request):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    utilisateur_id = request.GET.get('utilisateur_id')
    try:
        call = client.calls.create(
            twiml='<Response><Dial><Number>+2250789817277</Number></Dial></Response>',
            to='+2250789817277',
            from_='+2250789817277'
        )
        return JsonResponse({'success': True, 'call_sid': call.sid})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@method_decorator(csrf_exempt, name='dispatch')
class StoryView(View):

    def post(self, request):
        auth_result = TokenAuthentication().authenticate(request)
        if auth_result is None:
            return JsonResponse({"error": "Authentication failed"}, status=403)

        user, _ = auth_result

        if 'file' in request.FILES:
            file = request.FILES['file']
            file_type = imghdr.what(file)
            if file_type in ['jpeg', 'png', 'gif']:
                file_name = f'stories/{file.name}storyImage.{file_type}'
            else:
                file_name = f'stories/{file.name}'

            media = default_storage.save(file_name, ContentFile(file.read()))

            story = Story.objects.create(utilisateur=user, media=media)
            return JsonResponse({"success": "Story uploaded successfully"})
        else:
            return JsonResponse({"error": "No file uploaded"}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class StoryGetView(View):
    def get(self, request):
        now = timezone.now()
        stories = Story.objects.filter(expires_at__gt=now).order_by('-created_at')
        data = []
        for story in stories:
            if "storyImage" in story.media.url:
                media_url = str(story.media.url)
            else:
                media_url = str(story.media)
            data.append({
                "id": story.id,
                "nom_utilisateur": story.utilisateur.nom,
                "media": media_url,
                "created_at": story.created_at,
            })
        return JsonResponse(data, safe=False)
