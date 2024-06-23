# users/tests/test_serializers.py

import pytest
from django.contrib.auth import get_user_model
from users.serializers import UserCreateSerializer, UserSerializer
from django.core.exceptions import ValidationError

User = get_user_model()

@pytest.mark.django_db
class TestUserCreateSerializer:

    def test_valid_data(self):
        data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'password': 'Password@333'
        }
        serializer = UserCreateSerializer(data=data)
        assert serializer.is_valid() is True
        user = serializer.save()
        assert user.id is not None
        assert user.name == 'Test User'
        assert user.email == 'testuser@example.com'

    def test_invalid_password(self):
        data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'password': 'Weak@1234'
        }
        serializer = UserCreateSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            exc_info = exc
            assert 'password' in exc_info.value.detail

    # def test_missing_email(self):
    #     data = {
    #         'name': 'Test User',
    #         'email':'testuser@example.com',
    #         'password': 'password@1222'
    #     }
    #     serializer = UserCreateSerializer(data=data)
    #     try:
    #         serializer.is_valid(raise_exception=True)
    #     except ValidationError as exc:
    #         exc_info = exc
    #         assert 'email' in exc_info.value.detail 



@pytest.mark.django_db
class TestUserSerializer:
    def test_serialize_user(self):
        user = User.objects.create_user(name='Test User', email='testuser@example.com', password='password123')
        serializer = UserSerializer(user)
        expected_data = {
            'id': user.id,
            'name': 'Test User',
            'email': 'testuser@example.com',
            'is_superuser': user.is_superuser,
            'is_blocked': user.is_blocked,
            'profile_pic': user.profile_pic,
        }
        assert serializer.data == expected_data
