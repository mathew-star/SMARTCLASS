# serializers.py
from rest_framework import serializers
from .models import Classroom, Teacher, Student

class  ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id', 'title', 'sections', 'description', 'banner_image', 'code', 'invite_link', 'created_at', 'updated_at']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'classroom', 'super_teacher', 'created_at', 'updated_at']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'user', 'classroom', 'created_at', 'updated_at']
