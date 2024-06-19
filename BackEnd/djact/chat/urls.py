
from django.urls import path
from .views import MessageListView

urlpatterns = [
    path('messages/<int:class_id>/', MessageListView.as_view(), name='messages-list'),
]
