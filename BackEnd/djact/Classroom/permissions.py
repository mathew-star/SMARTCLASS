# permissions.py
from rest_framework.permissions import BasePermission
from .models import Teacher

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        class_id = view.kwargs.get('pk')
        print("Class: ",class_id)
        return Teacher.objects.filter(user=request.user, classroom_id=class_id).exists()
