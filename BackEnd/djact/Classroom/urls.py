# urls.py
from django.urls import path
from .views import CreateClassroomView, JoinClassroomView

urlpatterns = [
    path('create/', CreateClassroomView.as_view(), name='create-classroom'),
    path('join/', JoinClassroomView.as_view(), name='join-classroom'),
]
