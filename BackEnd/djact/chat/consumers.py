from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.class_id = self.scope['url_route']['kwargs']['class_id']
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'classroom_{self.class_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send existing messages to client on connect
        # await self.send_existing_messages()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        user = await self.get_user_instance(self.user_id)   # Retrieve UserAccount instance

        classroom = await self.get_classroom(self.class_id)

        # Create message in database
        await self.create_message(user, classroom, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': user.name,
                'profile_pic': str(user.profile_pic.url) if user.profile_pic else None
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        profile_pic = event['profile_pic']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'profile_pic': profile_pic
        }))

    @database_sync_to_async
    def create_message(self, user, classroom, content):
        from chat.models import Message
        return Message.objects.create(user=user, classroom=classroom, content=content)

    @database_sync_to_async
    def get_classroom(self, class_id):
        from Classroom.models import Classroom
        return Classroom.objects.get(id=class_id)
    
    # @database_sync_to_async
    # def send_existing_messages(self):
    #     from chat.models import Message
    #     messages = Message.objects.filter(classroom_id=self.class_id)
    #     for message in messages:
    #         self.send(text_data=json.dumps({
    #             'message': message.content,
    #             'username': message.user.name,
    #             'profile_pic': str(message.user.profile_pic.url) if message.user.profile_pic else None,
    #             'timestamp': message.timestamp.isoformat()
    #         }))

    @database_sync_to_async
    def get_user_instance(self,user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.get(id=user_id)

