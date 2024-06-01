from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Classroom, Teacher, Student
from .serializers import ClassroomSerializer, StudentSerializer
from django.contrib.auth import authenticate, login, logout
from datetime import timedelta
from django.conf import settings




class CreateClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ClassroomSerializer(data=request.data)
        if serializer.is_valid():
            classroom = serializer.save()
            Teacher.objects.create(user=request.user, classroom=classroom, super_teacher=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JoinClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        try:
            classroom = Classroom.objects.get(code=code)
            
            # Check if the user is already a teacher in this classroom
            if Teacher.objects.filter(user=request.user, classroom=classroom).exists():
                return Response({'error': 'You are already a teacher in this classroom'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the user is already a student in this classroom
            if Student.objects.filter(user=request.user, classroom=classroom).exists():
                return Response({'error': 'You are already a student in this classroom'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Add the user as a student to the classroom
            Student.objects.create(user=request.user, classroom=classroom)
            serializer = ClassroomSerializer(classroom)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)