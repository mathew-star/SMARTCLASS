from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
User = get_user_model()


class RegisterView(APIView):
  def post(self, request):
    data = request.data
    print(data)

    serializer = UserCreateSerializer(data=data)

    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.create(serializer.validated_data)
    user = UserSerializer(user)
    print(user.data)
    return Response(user.data, status=status.HTTP_201_CREATED)
  


class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser | IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserCreateSerializer
        return UserSerializer




class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser | IsAuthenticated]
    lookup_url_kwarg = 'user_id'  # Define the lookup URL kwarg for the user ID






# class UserDetailAPIView(generics.RetrieveAPIView):
#     print("rached get")
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAdminUser]
#     lookup_url_kwarg = 'user_id'  

#     def get_object(self):
#         print("rach get_obkj")
#         queryset = self.filter_queryset(self.get_queryset())
#         obj = generics.get_object_or_404(queryset, id=self.kwargs['user_id'])
#         self.check_object_permissions(self.request, obj)
#         return obj
    
#     def put(self,request,user_id):
#         name = request.data.get('name')
#         email = request.data.get('email')
#         user = User.objects.filter(id=user_id).first()
#         if user is None:
#             response_data = {"response":"Item doesnot exists"}
#             return Response(response_data,status=status.HTTP_404_NOT_FOUND)
#         user.name = name
#         user.email = email
#         user.save()
#         print(user)
#         serializer = UserSerializer(user)
#         response_data = {"data": serializer.data, "response": "Item updated"}
#         return Response(response_data,status=status.HTTP_200_OK)
    

#     def delete(self, request, *args, **kwargs):
#         user=self.request.user
#         user.delete()

#         return Response({"result":"user delete"})



class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        try:

            print(request.user)

            refresh_token = request.data.get("refresh_token")

            if refresh_token:
                # Create a RefreshToken instance from the provided refresh token
                token = RefreshToken(refresh_token)

                access_token = token.access_token
                access_token.set_exp(timedelta(seconds=1))

                # Blacklist the token to invalidate it
                token.blacklist()


                return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "No refresh token provided."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    




class RetrieveUserView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    user = UserSerializer(user)

    return Response(user.data, status=status.HTTP_200_OK)