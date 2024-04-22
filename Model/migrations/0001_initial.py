# Generated by Django 5.0.3 on 2024-04-22 16:47

import django.core.validators
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Utilisateur',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('mon_uuid', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('date_mise_a_jour', models.DateTimeField(auto_now=True, verbose_name='Date de mise a jour')),
                ('username', models.CharField(max_length=15, unique=True, validators=[django.core.validators.RegexValidator('^[0-9]+$', message='Le numéro de téléphone doit contenir uniquement des chiffres.')])),
                ('email', models.EmailField(blank=True, max_length=255, null=True, unique=True)),
                ('nom', models.CharField(max_length=250, verbose_name='nom')),
                ('prenom', models.CharField(max_length=250)),
                ('roles', models.CharField(blank=True, choices=[('utilisateur', 'Utilisateur'), ('admin', 'Administrateur')], default='utilisateur', max_length=20, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('image', models.ImageField(upload_to='ImageUser/')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(blank=True, max_length=255, null=True)),
                ('contenu', models.TextField(blank=True, null=True)),
                ('couleur_fond', models.CharField(default='linear-gradient(to bottom, rgba(255,128,255,0.5), rgba(0,0,128,0.5));', max_length=255)),
                ('photo_file', models.FileField(blank=True, null=True, upload_to='photos/')),
                ('video_file', models.FileField(blank=True, null=True, upload_to='videos/')),
                ('date_publication', models.DateTimeField(auto_now_add=True)),
                ('utilisateur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='publications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contenu_message', models.TextField(blank=True, null=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('lu', models.BooleanField(default=False)),
                ('audio', models.FileField(blank=True, null=True, upload_to='audio/')),
                ('images', models.FileField(blank=True, null=True, upload_to='messages/images/')),
                ('envoi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='envoi', to=settings.AUTH_USER_MODEL)),
                ('recoi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recoi', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_like', models.DateTimeField(auto_now_add=True)),
                ('publication', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Model.publication')),
                ('utilisateur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texte', models.TextField()),
                ('date_comment', models.DateTimeField(auto_now_add=True)),
                ('publication', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Model.publication')),
                ('utilisateur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
