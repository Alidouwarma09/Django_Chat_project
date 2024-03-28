import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chat.settings')
django.setup()

from django.contrib.auth import get_user_model

Utilisateur = get_user_model()


def create_admin():
    admin_exists = Utilisateur.objects.filter(username='admin').exists()
    if not admin_exists:
        admin = Utilisateur(
            username='0747182286',
            email='admin@example.com',
            password='09102079Darius',
            nom='WALLY',
            prenom='DARIUS',
            roles='admin',
        )
        admin.set_password('mot_de_passe_admin')
        admin.save()
        print("Utilisateur administrateur créé avec succès.")
    else:
        print("Un utilisateur avec le nom d'utilisateur 'admin' existe déjà.")


if __name__ == "__main__":
    create_admin()
