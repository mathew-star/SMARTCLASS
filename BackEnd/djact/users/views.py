from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.core.mail import send_mail
import pyotp
import time
import secrets
import string

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
    



class BlockUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            user.is_blocked = True
            user.save()
            return Response({'status': 'User blocked'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UnblockUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            user.is_blocked = False
            user.save()
            return Response({'status': 'User unblocked'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



# Store OTP secrets and their expiration times temporarily
otp_storage = {}
reset_token_storage = {}

# Helper function to generate OTP secret
def generate_otp_secret():
    return pyotp.random_base32()

def generate_secure_random_string(length=32):
    # Combine all possible characters including uppercase, lowercase, digits, and punctuation
    all_characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(all_characters) for _ in range(length))

def verify_otp(otp,email):
    otp_from_store= otp_storage[email]['otp']
    if otp == otp_from_store:
        return True
    else:
        return False

class OTPRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        print(email)
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        otp_secret = generate_otp_secret()
        otp = pyotp.TOTP(otp_secret, interval=240).now()
        print("Gen OTP: ",otp)
        otp_storage[email] = {'otp':otp,'otp_secret': otp_secret, 'timestamp': time.time()}

        print(otp_secret, otp)

        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP is: {otp}. It is valid for 2 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )
        return Response({"detail": "OTP sent to email"}, status=status.HTTP_200_OK)


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("post")
        email = request.data.get('email')
        otp = request.data.get('otp')

        print ("Email: ", email)
        print("opt",otp)

        if not email or not otp:
            return Response({"detail": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        if email not in otp_storage:
            return Response({"detail": "OTP not requested or expired"}, status=status.HTTP_400_BAD_REQUEST)

        otp_secret = otp_storage[email]['otp_secret']
        otp_timestamp = otp_storage[email]['timestamp']

        for k,v in otp_storage.items():
            if time.time() - v['timestamp'] > 240:
                del otp_storage[k]


        if time.time() - otp_timestamp > 240:
            del otp_storage[email]
            return Response({"detail": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)

        # totp = pyotp.TOTP(otp_secret, interval=120)

        get_random_string=generate_secure_random_string(32)
        if verify_otp(otp,email):
            print("verified")
            reset_token = otp_secret
            print(reset_token)
            reset_token_storage[reset_token] = {'email': email, 'timestamp': time.time()}
            del otp_storage[email]
            return Response({"reset_token": reset_token, "detail": "OTP verified, proceed to reset password"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reset_token = request.data.get('reset_token')
        new_password = request.data.get('password')

        if not reset_token or not new_password:
            return Response({"detail": "Reset token and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if reset_token not in reset_token_storage:
            return Response({"detail": "Invalid  reset token"}, status=status.HTTP_400_BAD_REQUEST)

        email = reset_token_storage[reset_token]['email']

        for k,v in reset_token_storage.items():
            if time.time() - reset_token_storage[k]['timestamp']> 600:
                del reset_token_storage[k]


        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        del reset_token_storage[reset_token]
        return Response({"detail": "Password has been reset"}, status=status.HTTP_200_OK)



class RetrieveUserView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    user = UserSerializer(user)

    return Response(user.data, status=status.HTTP_200_OK)