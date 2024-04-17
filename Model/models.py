import uuid
from datetime import timezone

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils.timesince import timesince


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
    image = models.ImageField(upload_to='ImageUser/', null=True, blank=True)
    USERNAME_FIELD = 'username'
    objects = MyUserManager()

    def __str__(self):
        return f"{self.nom} {self.prenom}"


class Message(models.Model):
    envoi = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='envoi')
    recoi = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='recoi')
    contenu_message = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)
    audio = models.FileField(upload_to='audio/', blank=True, null=True)
    images = models.FileField(upload_to='messages/images/', blank=True, null=True)


class VideoPhoto(models.Model):
    titre_photo = models.CharField(max_length=100)
    video_file = models.FileField(upload_to='videos/')
    photo_file = models.FileField(upload_to='photo/')
    date_publication = models.DateTimeField(auto_now_add=True)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='auteur')

    def date_pub(self):
        if self.date_publication:
            date_pub = timesince(self.date_publication)
            return f"{date_pub}"

    def count_likes(self):
        return Like.objects.filter(publication=self).count()

    def __str__(self):
        return self.titre_photo


class Like(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    publication = models.ForeignKey(VideoPhoto, on_delete=models.CASCADE)
    date_like = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    publication = models.ForeignKey(VideoPhoto, on_delete=models.CASCADE)
    texte = models.TextField()
    date_comment = models.DateTimeField(auto_now_add=True)
