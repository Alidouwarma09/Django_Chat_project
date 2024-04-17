# Generated by Django 5.0.1 on 2024-03-28 10:48

import uuid
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
                ('username', models.IntegerField(unique=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('nom', models.CharField(max_length=250, verbose_name='nom')),
                ('prenom', models.CharField(max_length=250)),
                ('roles', models.CharField(blank=True, choices=[('utilisateur', 'Utilisateur'), ('admin', 'Administrateur')], default='utilisateur', max_length=20, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('image', models.ImageField(blank=True, null=True, upload_to='ImageUser/')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]