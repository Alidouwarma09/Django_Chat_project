from django.core.files.storage import Storage
from cloudinary_storage.storage import MediaCloudinaryStorage, VideoMediaCloudinaryStorage


class CustomCloudinaryStorage(Storage):
    def _open(self, name, mode='rb'):
        extension = name.split('.')[-1].lower()
        if extension in ['mp4', 'mov', 'avi']:  # Vous pouvez ajouter d'autres extensions de vidéo si nécessaire
            return VideoMediaCloudinaryStorage()._open(name, mode)
        else:
            return MediaCloudinaryStorage()._open(name, mode)

    def _save(self, name, content):
        extension = name.split('.')[-1].lower()
        if extension in ['mp4', 'mov', 'avi']:  # Vous pouvez ajouter d'autres extensions de vidéo si nécessaire
            return VideoMediaCloudinaryStorage()._save(name, content)
        else:
            return MediaCloudinaryStorage()._save(name, content)

    def url(self, name):
        extension = name.split('.')[-1].lower()
        if extension in ['mp4', 'mov', 'avi']:  # Vous pouvez ajouter d'autres extensions de vidéo si nécessaire
            return VideoMediaCloudinaryStorage().url(name)
        else:
            return MediaCloudinaryStorage().url(name)

    def exists(self, name):
        extension = name.split('.')[-1].lower()
        if extension in ['mp4', 'mov', 'avi']:  # Vous pouvez ajouter d'autres extensions de vidéo si nécessaire
            return VideoMediaCloudinaryStorage().exists(name)
        else:
            return MediaCloudinaryStorage().exists(name)

    def delete(self, name):
        extension = name.split('.')[-1].lower()
        if extension in ['mp4', 'mov', 'avi']:  # Vous pouvez ajouter d'autres extensions de vidéo si nécessaire
            return VideoMediaCloudinaryStorage().delete(name)
        else:
            return MediaCloudinaryStorage().delete(name)
