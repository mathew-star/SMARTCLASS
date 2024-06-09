# serializers.py
from rest_framework import serializers
from .models import Classroom, Teacher, Student,Announcements,Assignment, Submission, AssignmentFile, SubmissionFile, Topic
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

class announcementSerializer(serializers.ModelSerializer):
    user= UserAccountSerializer()

    class Meta:
        model=Announcements
        fields=['id','user','announcement','created_at']


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title']





class AssignmentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentFile
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    files = AssignmentFileSerializer(many=True, read_only=True)
    topic = serializers.PrimaryKeyRelatedField(queryset=Topic.objects.all(), allow_null=True, required=False)
    assigned_students = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), many=True, required=False)
    created_by=TeacherSerializer(read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'

    def create(self, validated_data):
        assigned_students = validated_data.pop('assigned_students', [])
        assignment = Assignment.objects.create(**validated_data)
        assignment.assigned_students.set(assigned_students)
        return assignment

    def update(self, instance, validated_data):
        assigned_students = validated_data.pop('assigned_students', None)
        files = validated_data.pop('files', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if assigned_students is not None:
            instance.assigned_students.set(assigned_students)
        
        instance.save()

        return instance
    
class StudentAssignmentSerializer(serializers.ModelSerializer):
    assigned_students = StudentSerializer(many=True)
    created_by=TeacherSerializer()
    files = AssignmentFileSerializer(many=True, read_only=True)
    class Meta:
        model = Assignment
        fields = '__all__'
    


class SubmissionFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionFile
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    files = SubmissionFileSerializer(many=True, read_only=True)
    student= StudentSerializer()
    assignment = serializers.StringRelatedField()

    class Meta:
        model = Submission
        fields = '__all__'