import uuid

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator
from django.db import models
from datetime import timedelta, timezone
from django.utils.timesince import timesince
from django.utils import timezone


# Create your models here.

class MyUserManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError("Vous devez entrer un nom d'utilisateur")

        user = self.model(username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password=None):
        user = self.create_user(username=username, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


ROLE_CHOICES = (
    ('utilisateur', 'Utilisateur'),
    ('admin', 'Administrateur')
)


class Utilisateur(AbstractBaseUser):
    mon_uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    date_mise_a_jour = models.DateTimeField(verbose_name="Date de mise a jour", auto_now=True)
    username = models.CharField(
        max_length=15,
        unique=True,
        blank=False,
        validators=[RegexValidator(r'^[0-9]+$',
                                   message="Le numéro de téléphone doit contenir uniquement des chiffres.")]
    )
    email = models.EmailField(
        unique=True,
        max_length=255,
        blank=True,
        null=True
    )
    nom = models.CharField(max_length=250, verbose_name='nom')
    prenom = models.CharField(max_length=250)
    roles = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True, default='utilisateur')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    image = models.ImageField(upload_to='ImageUser/')
    USERNAME_FIELD = 'username'
    objects = MyUserManager()

    def __str__(self):
        return f"{self.nom} {self.prenom}"


class Message(models.Model):
    envoi = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='envoi')
    recoi = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='recoi')
    contenu_message = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    vu = models.BooleanField(default=False)
    audio = models.FileField(upload_to='audio/', blank=True, null=True)
    images = models.FileField(upload_to='messages/images/', blank=True, null=True)


class Publication(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='publications')
    titre = models.CharField(max_length=255, blank=True, null=True)
    contenu = models.TextField(blank=True, null=True)
    couleur_fond = models.CharField(max_length=255,
                                    default='linear-gradient(to bottom, rgba(255,128,255,0.5), rgba(0,0,128,0.5));')
    photo_file = models.FileField(upload_to='photos/', blank=True, null=True)
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)
    date_publication = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.titre:
            return self.titre
        elif self.contenu:
            return self.contenu[:50]  # Retourne les 50 premiers caractères du contenu
        else:
            return f"Publication by {self.utilisateur.nom} on {self.date_publication.strftime('%Y-%m-%d')}"

    def date_pub(self):
        return timesince(self.date_publication) if self.date_publication else ""

    def count_likes(self):
        return Like.objects.filter(publication=self).count()


class Like(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    date_like = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    texte = models.TextField()
    date_comment = models.DateTimeField(auto_now_add=True)

    def date_commentaire(self):
        return timesince(self.date_comment) if self.date_comment else ""


class ReponseCommentaire(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    commentaire = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reponses')
    texte = models.TextField()
    date_reponse = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Réponse de {self.utilisateur} à {self.commentaire} le {self.date_reponse}"


class Story(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    media = models.FileField(upload_to='stories/')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)  # Stories expire after 24 hours
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.utilisateur.username} - {self.created_at}"
