# serializers.py
from rest_framework import serializers
from .models import Classroom, Teacher, Student
from users.models import UserAccount

class  ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id', 'title', 'sections', 'description', 'banner_image', 'code', 'invite_link', 'created_at', 'updated_at']


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'name', 'email', 'profile_pic']

class TeacherSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer()

    class Meta:
        model = Teacher
        fields = ['id', 'user', 'super_teacher']

class StudentSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer()

    class Meta:
        model = Student
        fields = ['id', 'user']
