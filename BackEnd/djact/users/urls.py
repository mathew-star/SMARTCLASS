from django.urls import path,include  

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,    
)

from .views import RegisterView,RetrieveUserView,UserListView,UserDetailView,LogoutAPIView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
    path('logout/',LogoutAPIView.as_view()),
    # Endpoint for listing users and creating new users
    path('users/', UserListView.as_view(), name='user-list'),
    # Endpoint for retrieving, updating, and deleting individual users
    path('user/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    # path('update/<int:user_id>/', UserDetailAPIView.as_view()),
    # path('read/<int:user_id>/', UserDetailAPIView.as_view()),
    path('register/', RegisterView.as_view()),
    path('me/', RetrieveUserView.as_view()),
]
