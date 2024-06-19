# chat/routing.py
from django.urls import path
from chat import consumers

websocket_urlpatterns = [
    path('ws/chat/<class_id>/<user_id>/', consumers.ChatConsumer.as_asgi()),
]
