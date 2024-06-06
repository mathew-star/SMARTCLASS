from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Classroom, Teacher, Student
from .permissions import IsTeacher
from .serializers import ClassroomSerializer, StudentSerializer, TeacherSerializer
from django.contrib.auth import authenticate, login, logout
from datetime import timedelta
from django.conf import settings




class CreateClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        serializer = ClassroomSerializer(data=request.data)
        print(serializer)
        print(serializer.is_valid())
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
        




class TeachingClassesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            user = request.user
            teaching_classes = Classroom.objects.filter(teacher__user=user)
            serializer = ClassroomSerializer(teaching_classes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EnrolledClassesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            user = request.user
            enrolled_classes = Classroom.objects.filter(student__user=user)
            serializer = ClassroomSerializer(enrolled_classes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ClassroomDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        try:
            classroom = Classroom.objects.get(pk=pk)
            serializer = ClassroomSerializer(classroom)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)




class UserRoleInClassAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        try:
            user = request.user
            classroom = Classroom.objects.get(pk=pk)

            is_teacher = Teacher.objects.filter(user=user, classroom=classroom).exists()
            is_student = Student.objects.filter(user=user, classroom=classroom).exists()

            role = "none"
            if is_teacher:
                role = "teacher"
            elif is_student:
                role = "student"

            return Response({"role": role}, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class FetchClassMembersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_id):
        try:
            classroom = Classroom.objects.get(id=class_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)
        
        teacher = Teacher.objects.filter(classroom=classroom).first()
        students = Student.objects.filter(classroom=classroom)
        
        teacher_serializer = TeacherSerializer(teacher)
        student_serializer = StudentSerializer(students, many=True)
        
        return Response({
            'teacher': teacher_serializer.data,
            'students': student_serializer.data
        }, status=status.HTTP_200_OK)


class RemoveStudentsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def post(self, request, class_id):
        student_ids = request.data.get('student_ids', [])
        
        if not student_ids:
            return Response({'error': 'No students provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            classroom = Classroom.objects.get(id=class_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)
        
        students_to_remove = Student.objects.filter(id__in=student_ids, classroom=classroom)
        
        if not students_to_remove.exists():
            return Response({'error': 'No students found to remove'}, status=status.HTTP_404_NOT_FOUND)
        
        students_to_remove.delete()
        
        return Response({'success': 'Students removed successfully'}, status=status.HTTP_200_OK)