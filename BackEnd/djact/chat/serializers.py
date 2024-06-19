from rest_framework import serializers
from .models import Message
from users.models import UserAccount

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'name', 'email', 'profile_pic']


class MessageSerializer(serializers.ModelSerializer):
    user=UserAccountSerializer()

    class Meta:
        model = Message
        fields = ['id', 'user', 'classroom', 'content', 'timestamp']
