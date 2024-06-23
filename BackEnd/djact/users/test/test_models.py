

import pytest
from django.contrib.auth import get_user_model

@pytest.mark.django_db
class TestUserAccountModel:
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(name='Test User', email='testuser@example.com', password='password123')
        assert user.name == 'Test User'
        assert user.email == 'testuser@example.com'
        assert user.check_password('password123') is True
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_create_superuser(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(name='Superuser', email='superuser@example.com', password='password123')
        assert superuser.name == 'Superuser'
        assert superuser.email == 'superuser@example.com'
        assert superuser.check_password('password123') is True
        assert superuser.is_active is True
        assert superuser.is_staff is True
        assert superuser.is_superuser is True

    def test_create_user_without_email(self):
        User = get_user_model()
        with pytest.raises(ValueError):
            User.objects.create_user(name='No Email User', email='', password='password123')

    def test_create_user_with_duplicate_email(self):
        User = get_user_model()
        User.objects.create_user(name='Test User', email='testuser@example.com', password='password123')
        with pytest.raises(Exception):
            User.objects.create_user(name='Duplicate Email User', email='testuser@example.com', password='password123')
