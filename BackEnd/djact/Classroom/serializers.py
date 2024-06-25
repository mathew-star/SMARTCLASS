# serializers.py
from rest_framework import serializers
from .models import Classroom, Teacher, Student,Announcements,Assignment, Submission, AssignmentFile, SubmissionFile, Topic,PrivateComment
from users.models import UserAccount
from django.conf import settings



class ClassroomSerializer(serializers.ModelSerializer):
    banner_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = ['id', 'title', 'sections', 'description', 'banner_image_url', 'code', 'invite_link', 'created_at', 'updated_at']

    def get_banner_image_url(self, obj):
        if obj.banner_image:
            try:
                return obj.banner_image.url
            except Exception as e:
                print(f"Error getting banner image URL: {e}")
                return None
        return None


class UserAccountSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()

    class Meta:
        model = UserAccount
        fields = ('id', 'name', 'email', 'is_superuser', 'is_blocked', 'profile_pic', 'profile_pic_url')

    def get_profile_pic_url(self, obj):
        if obj.profile_pic:
            return obj.profile_pic.url
        return None
    

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
    assigned_students = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), many=True, required=False)
    created_by = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all(), required=False)

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
    

    
class getAssignmentSerializer(serializers.ModelSerializer):
    files = AssignmentFileSerializer(many=True, read_only=True)
    topic=TopicSerializer()
    assigned_students = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), many=True, required=False)
    created_by = TeacherSerializer()

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
        fields = ['assignment', 'student', 'files', 'submitted_at', 'status', 'points']



class StudentAssignmentSerializer(serializers.ModelSerializer):
    assigned_students = StudentSerializer(many=True)
    created_by=TeacherSerializer()
    files = AssignmentFileSerializer(many=True, read_only=True)
    submissions = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ['id', 'title', 'instructions', 'files', 'due_date','assigned_students', 'points', 'topic', 'created_by', 'created_at', 'updated_at', 'submissions']

    def get_submissions(self, obj):
        submissions = Submission.objects.filter(assignment=obj)
        return SubmissionSerializer(submissions, many=True).data
    


class getStudentAssignmentSerializer(serializers.ModelSerializer):
    submission_status = serializers.SerializerMethodField()
    submission_files = serializers.SerializerMethodField()
    submission_points = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ['id', 'title', 'instructions', 'due_date', 'points', 'created_at', 'updated_at', 'submission_status', 'submission_files', 'submission_points']

    def get_submission_status(self, assignment):
        student = self.context['student']
        try:
            submission = Submission.objects.get(assignment=assignment, student=student)
            return submission.status
        except Submission.DoesNotExist:
            return 'not_submitted'

    def get_submission_files(self, assignment):
        student = self.context['student']
        try:
            submission = Submission.objects.get(assignment=assignment, student=student)
            return [file.file.url for file in submission.files.all()]
        except Submission.DoesNotExist:
            return []

    def get_submission_points(self, assignment):
        student = self.context['student']
        try:
            submission = Submission.objects.get(assignment=assignment, student=student)
            return submission.points
        except Submission.DoesNotExist:
            return None
        


class PrivateCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = PrivateComment
        fields = '__all__'


class getPrivateCommentSerializer(serializers.ModelSerializer):
    user=UserAccountSerializer()

    class Meta:
        model = PrivateComment
        fields = '__all__'




class LeaderboardSerializer(serializers.ModelSerializer):
    total_points = serializers.IntegerField()
    completed_assignments = serializers.IntegerField()
    total_assignments = serializers.IntegerField()
    user=UserAccountSerializer()

    class Meta:
        model = Student
        fields = ['user', 'total_points', 'completed_assignments', 'total_assignments']




class ClassroomAnalyticsSerializer(serializers.Serializer):
    students_count = serializers.IntegerField()
    assignments_count = serializers.IntegerField()
    average_grade = serializers.FloatField()
    completion_rate = serializers.FloatField()


