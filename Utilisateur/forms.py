from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from Model.models import Utilisateur, Message


class InscriptionForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Utilisateur
        fields = ['username', 'nom', 'prenom', 'image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': "form-control",
            'id': "selectModel",
            'required': True,
        })
        self.fields['password1'].widget = forms.PasswordInput(attrs={
            'class': "form-control",
            'id': "password1",
            'required': True,
        })
        self.fields['password2'].widget = forms.PasswordInput(attrs={
            'class': "form-control",
            'id': "password2",
            'required': True,
        })

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Les deux mots de passe ne correspondent pas.")
        return cleaned_data


class ConnexionForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(ConnexionForm, self).__init__(*args, **kwargs)

        self.fields['username'].error_messages = {
            'required': "Veuillez saisir un Nom d'utilisateur valide !!"
        }
        self.fields['password'].error_messages = {
            'required': "Veuillez saisir un mot de passe valide !!"
        }
        self.error_messages = {
            "invalid_login":
                "Veuillez saisir les mêmes informations que lors de la création de votre compte. "
                "Vous devez respecter les majuscules ou les minuscules !!",
            "inactive": "Ce compte est inactif veuillez contacter votre administrateur."
        }


class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['contenu_message']
