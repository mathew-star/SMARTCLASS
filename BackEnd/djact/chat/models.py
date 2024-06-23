from django.db import models
from django.conf import settings
from Classroom.models import Classroom
from django.core.exceptions import ValidationError


class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.content:
            raise ValidationError('Content cannot be empty')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username}: {self.content}"
