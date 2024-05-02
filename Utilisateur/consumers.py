# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from Model.models import Comment


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        pass

    async def send_comments(self, event):
        comments = event['comments']
        await self.send(text_data=json.dumps({
            'comments': comments
        }))
