# notifications/urls.py
from django.urls import path
from notifications.views import NotificationListView, MarkAllReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/mark-all-read/', MarkAllReadView.as_view(), name='mark-all-read'),
]
