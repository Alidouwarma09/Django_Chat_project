import json
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
from django.views.decorators.csrf import csrf_exempt

from Model.models import Utilisateur, Message, VideoPhoto, Like, Comment
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
            print(form.errors)
    else:
        form = InscriptionForm()

    return render(request, 'inscription_utilisateur.html', {'form': form})


class Connexion_utlisateur(LoginView):
    template_name = 'connexion_utilisateur.html'
    form_class = ConnexionForm

    def form_invalid(self, form):
        form.add_error('username', 'Nom d\'utilisateur incorrect')
        form.add_error('password', 'Mot de passe incorrect')
        return self.render_to_response(self.get_context_data(form=form))

    def get_success_url(self) -> str:
        if self.request.user.roles == 'utilisateur':
            return reverse('Utilisateur:acceuil')


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def acceuil(request):
    photo_publier = VideoPhoto.objects.all()
    liked_photos = [like.publication_id for like in Like.objects.filter(utilisateur=request.user)]
    utilisateur_connecte = request.user if request.user.is_authenticated else None
    publication_likes = {}
    for photo in photo_publier:
        publication_likes[photo.id] = photo.count_likes()
    context = {
        'utilisateur_connecte': utilisateur_connecte,
        'photo_publier': photo_publier,
        'user': request.user,
        'liked_photos': liked_photos,
        'publication_likes': publication_likes,
    }

    return render(request, 'accueil_utilisateur.html', context)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def accueil_utilisateur(request):
    connecte_id = request.user.id
    utilisateurs = Utilisateur.objects.exclude(id=connecte_id)
    context = {
        'utilisateurs': utilisateurs,
    }
    return render(request, 'accueil_utilisateur.html', context)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
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
            photo = form.save(commit=False)
            photo.utilisateur = request.user
            photo = form.save()
            return JsonResponse({'success': True, 'message': 'L\'image a été publiée avec succès.'})
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


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def liker_publication(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        publication_id = data.get('publication_id')
        try:
            publication = VideoPhoto.objects.get(id=publication_id)
            utilisateur = request.user
            like, created = Like.objects.get_or_create(utilisateur=utilisateur, publication=publication)

            if not created:
                like.delete()
                liked = False
            else:
                liked = True
            return JsonResponse({'liked': liked})

        except VideoPhoto.DoesNotExist:
            return JsonResponse({'error': 'Publication non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        # Si la méthode n'est pas POST, renvoyer une erreur
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@login_required(login_url='Utilisateur:Connexion_utlisateur')
def commenter_publication(request):
    if request.method == 'POST':
        print('Données POST reçues:', request.POST)
        data = json.loads(request.body)
        publication_id = data.get('publication_id')
        texte = data.get('texte')
        print('Publication ID:', publication_id)
        print('Texte:', texte)
        if publication_id is None or texte is None:
            return JsonResponse({'error': 'Données POST manquantes'}, status=400)
        try:
            publication_id = int(publication_id)
        except ValueError:
            return JsonResponse({'error': 'Format de données invalide'}, status=400)
        utilisateur = request.user
        print(utilisateur)

        try:
            publication = VideoPhoto.objects.get(id=publication_id)
        except VideoPhoto.DoesNotExist:
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
    print(comment_count)
    return JsonResponse({'comment_count': comment_count})
