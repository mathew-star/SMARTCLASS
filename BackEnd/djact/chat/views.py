# chat/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer

class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id, format=None):
        messages = Message.objects.filter(classroom_id=class_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
