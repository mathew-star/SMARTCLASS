# notifications/views.py
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from notifications.models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(recipient=user, is_read=False).order_by('-created_at')
        serialized_notifications = NotificationSerializer(notifications, many=True)
        
        # Mark all fetched notifications as read
        notifications.update(is_read=True)
        
        return Response(serialized_notifications.data, status=status.HTTP_200_OK)
    


class MarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        notifications = Notification.objects.filter(recipient=user, is_read=False)
        notifications.update(is_read=True)
        
        return Response({'message': 'All notifications marked as read'}, status=status.HTTP_200_OK)
