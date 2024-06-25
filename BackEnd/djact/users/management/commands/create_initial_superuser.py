from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(email='mathewjosef41@gmail.com').exists():
            User.objects.create_superuser(
                name='Mathew',
                email='mathewjosef41@gmail.com',
                password='Mathew@321'
            )
