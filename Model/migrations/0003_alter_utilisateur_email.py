# Generated by Django 5.0.1 on 2024-03-28 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Model', '0002_alter_utilisateur_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='utilisateur',
            name='email',
            field=models.EmailField(blank=True, max_length=255, unique=True),
        ),
    ]