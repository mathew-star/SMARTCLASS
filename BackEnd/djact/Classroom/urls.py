# urls.py
from django.urls import path
from .views import CreateClassroomView, JoinClassroomView,TeachingClassesAPIView, EnrolledClassesAPIView, UserRoleInClassAPIView,ClassroomDetailView

urlpatterns = [
    path('create/', CreateClassroomView.as_view(), name='create-classroom'),
    path('join/', JoinClassroomView.as_view(), name='join-classroom'),
    path('teaching/', TeachingClassesAPIView.as_view(), name='teaching_classes'),
    path('enrolled/', EnrolledClassesAPIView.as_view(), name='enrolled_classes'),
    path('classroom/<int:pk>/', ClassroomDetailView.as_view(), name='classroom_detail'), 
    path('user-role/<int:pk>/', UserRoleInClassAPIView.as_view(), name='user_role_in_class'),
]
