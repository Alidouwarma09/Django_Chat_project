# Generated by Django 5.0.3 on 2024-04-25 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Model', '0003_rename_lu_message_vu'),
    ]

    operations = [
        migrations.AddField(
            model_name='utilisateur',
            name='en_train_decrire',
            field=models.BooleanField(default=False),
        ),
    ]
