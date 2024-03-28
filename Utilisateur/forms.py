from django import forms
from django.contrib.auth.forms import UserCreationForm

from Model.models import Utilisateur


class InscriptionForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Utilisateur
        fields = ['username', 'image', 'nom', 'prenom', 'password1', 'password2']

        def clean(self):
            cleaned_data = super().clean()

            password1 = cleaned_data.get("password1")
            password2 = cleaned_data.get("password2")

            if password1 and password2 and password1 != password2:
                self.add_error('password2', "Les deux mots de passe ne correspondent pas.")

            return cleaned_data

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
