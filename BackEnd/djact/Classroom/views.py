from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Classroom, Teacher, Student,Announcements,Assignment, Submission, AssignmentFile, SubmissionFile,Topic,PrivateComment
from .permissions import IsTeacher
from .serializers import ClassroomSerializer, StudentSerializer, TeacherSerializer,announcementSerializer,AssignmentFileSerializer,AssignmentSerializer,SubmissionSerializer,SubmissionFileSerializer,TopicSerializer,StudentAssignmentSerializer,getAssignmentSerializer,getStudentAssignmentSerializer,PrivateCommentSerializer,getPrivateCommentSerializer,LeaderboardSerializer
from django.contrib.auth import authenticate, login, logout
from datetime import timedelta
from django.db.models import Count, Case, When, Sum, Q,IntegerField
from django.db import models
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
import json
from notifications.tasks import send_assignment_notification, send_submission_grade_notification,send_submission_notification

import logging

logger = logging.getLogger(__name__)




class CreateClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        serializer = ClassroomSerializer(data=request.data)
        print(serializer)
        print(serializer.is_valid())
        classroom_title = request.data.get('title')
        classroom_sections = request.data.get('sections')
        if Classroom.objects.filter(title=classroom_title,sections=classroom_sections).exists():
            return Response({'error': 'Classroom already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
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
            print(classroom)
            serializer = ClassroomSerializer(classroom)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):

        try:
            classroom = Classroom.objects.get(pk=pk)
            print(classroom)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ClassroomSerializer(classroom, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            classroom = Classroom.objects.get(pk=pk)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)
        
        classroom.delete()
        return Response({'message': 'Classroom deleted successfully'}, status=status.HTTP_204_NO_CONTENT)



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
        
        # Filter the students to remove
        students_to_remove = Student.objects.filter(id__in=student_ids, classroom=classroom)
        
        if not students_to_remove.exists():
            return Response({'error': 'No students found to remove'}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the Student instances
        students_to_remove.delete()
        
        return Response({'success': 'Students removed successfully'}, status=status.HTTP_200_OK)

    

class AnnouncementView(APIView):
    permission_classes=[IsAuthenticated,IsTeacher]

    def post(self,request,class_id):
        user = request.user
        announcement = request.data.get('announcement')
        if not announcement:
            return Response({'error': 'Announcement text is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            classroom = Classroom.objects.get(id=class_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)
        announcement_object=Announcements.objects.create(user=user,classroom=classroom,announcement=announcement)
        serializer = announcementSerializer(announcement_object)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, class_id):
        try:
            classroom = Classroom.objects.get(id=class_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)

        announcements = Announcements.objects.filter(classroom=classroom).order_by('-created_at')
        serializer = announcementSerializer(announcements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class TeacherTopicsAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TopicSerializer

    def get_queryset(self):
        classroom_id = self.kwargs['classroom_id']
        return Topic.objects.filter(classroom_id=classroom_id)

    def perform_create(self, serializer):
        classroom_id = self.kwargs['classroom_id']
        classroom = Classroom.objects.get(id=classroom_id)
        serializer.save(classroom=classroom)





class TeacherAssignmentsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, classroom_id):
        teacher = get_object_or_404(Teacher, user=request.user, classroom__id=classroom_id)
        assignments = Assignment.objects.filter(created_by=teacher)
        serializer = getAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request, classroom_id):
        teacher = get_object_or_404(Teacher, user=request.user, classroom__id=classroom_id)
        print("teacher:", teacher.id)
        print(request.data)
        data = request.data.copy()
        data['classroom'] = teacher.classroom.id
        data['created_by'] = teacher.id


        # Convert assigned_students to a list of IDs
        assigned_students = request.POST.getlist('assigned_students[]')
        data.setlist('assigned_students', assigned_students)

        print(data)

        serializer = AssignmentSerializer(data=data)

        if serializer.is_valid():
            assignment = serializer.save()

            # Handle file uploads
            for file in request.FILES.getlist('files'):
                assignment_file = AssignmentFile.objects.create(file=file)
                assignment.files.add(assignment_file)
            assignment.save()  # Save the assignment after adding the files

            send_assignment_notification.delay(assignment.id)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)  # Print serializer errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







class TeacherAssignmentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'assignment_id'
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        teacher = get_object_or_404(Teacher, user=self.request.user, classroom__id=self.kwargs['classroom_id'])
        return Assignment.objects.filter(created_by=teacher)

    def update(self, request, *args, **kwargs):
        assignment = self.get_object()
        data = request.data.copy()
        assigned_students = request.POST.getlist('assigned_students[]')
        data.setlist('assigned_students', assigned_students)

        serializer = self.get_serializer(assignment, data=data, partial=True)

        if serializer.is_valid():
            assignment = serializer.save()
            # Handle file uploads
            if 'files' in request.FILES:
                for file in request.FILES.getlist('files'):
                    assignment_file = AssignmentFile.objects.create(file=file)
                    assignment.files.add(assignment_file)
            assignment.save()  # Save the assignment after adding the files
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        assignment = self.get_object()
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    

class StudentAssignmentsAPIView(generics.ListAPIView):
    serializer_class = getAssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student = get_object_or_404(Student, user=self.request.user, classroom__id=self.kwargs['classroom_id'])
        return Assignment.objects.filter(assigned_students=student)
    


class StudentSubmissionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, class_id, assignment_id):
        try:
            assignment = Assignment.objects.get(id=assignment_id, classroom_id=class_id)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            student = Student.objects.get(user=request.user, classroom_id=class_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found or not part of this classroom'}, status=status.HTTP_404_NOT_FOUND)

        files = request.FILES.getlist('files')
        submission, created = Submission.objects.get_or_create(student=student, assignment=assignment)

        for file in files:
            submission_file = SubmissionFile.objects.create(file=file)
            submission.files.add(submission_file)

        submission.status = 'submitted'
        submission.save()
        send_submission_notification.delay(assignment_id, student.id)
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, class_id, assignment_id):
        try:
            assignment = Assignment.objects.get(id=assignment_id, classroom_id=class_id)
            student = Student.objects.get(user=request.user, classroom_id=class_id)
            submission = Submission.objects.get(student=student, assignment=assignment)
        except (Assignment.DoesNotExist, Submission.DoesNotExist, Student.DoesNotExist):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


    def delete(self, request, class_id, assignment_id):
        try:
            assignment = Assignment.objects.get(id=assignment_id, classroom_id=class_id)
            student = Student.objects.get(user=request.user, classroom_id=class_id)
            submission = Submission.objects.get(student=student, assignment=assignment)
        except (Assignment.DoesNotExist, Submission.DoesNotExist, Student.DoesNotExist):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        submission.files.clear()  # Remove all associated files
        SubmissionFile.objects.filter(submission=submission).delete()
        submission.status = 'unsubmitted'
        submission.save()

        return Response({'success': 'Assignment unsubmitted successfully'}, status=status.HTTP_200_OK)
    




class StudentSpecificSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id, assignment_id, student_id):
        try:
            assignment = Assignment.objects.get(id=assignment_id, classroom_id=class_id)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            submission = Submission.objects.get(assignment=assignment, student_id=student_id)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, class_id, assignment_id, student_id):
        try:
            assignment = Assignment.objects.get(id=assignment_id, classroom_id=class_id)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            submission = Submission.objects.get(assignment=assignment, student_id=student_id)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        points = request.data.get('points')
        if points is not None:
            submission.points = points
            submission.save()

            send_submission_grade_notification.delay(submission.id)

            return Response({'message': 'Points updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Points not provided'}, status=status.HTTP_400_BAD_REQUEST)
    

class getStudentSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id, assignment_id):
        try:
            assignment = Assignment.objects.get(id=assignment_id, classroom_id=class_id)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            student=Student.objects.get(user=request.user)
            submission = Submission.objects.get(assignment=assignment, student=student)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class StudentAssignmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, classroom_id, assignment_id):
        try:
            classroom = Classroom.objects.get(id=classroom_id)
            assignment = Assignment.objects.get(classroom=classroom, id=assignment_id)
            serializer = StudentAssignmentSerializer(assignment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=status.HTTP_404_NOT_FOUND)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        

class getStudentAssignmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            assignments = Assignment.objects.filter(assigned_students=student)
            serializer = getStudentAssignmentSerializer(assignments, many=True, context={'student': student})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        

class FetchClassroomsAPIView(APIView):
    def get(self, request, format=None):
        try:
            classrooms = Classroom.objects.all()
            serializer = ClassroomSerializer(classrooms, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class PrivateCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assignment_id,student_id,teacher_id):
        print(student_id,teacher_id)

        try:
            assignment = Assignment.objects.get(id=assignment_id)
            student = Student.objects.get(id=student_id)
            teacher= Teacher.objects.get(id=teacher_id)
            comments = PrivateComment.objects.filter(assignment=assignment,teacher=teacher, student=student).order_by('created_at')
            serializer = getPrivateCommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, assignment_id,student_id,teacher_id):
       
        try:
            assignment = Assignment.objects.get(id=assignment_id)
            student = Student.objects.get(id=student_id)
            
            data = { 
                'assignment':assignment.id,
                'student':student_id,
                'teacher':teacher_id,
                'user':request.user.id,
                'comment':request.data.get('comment')

            }

            serializer = PrivateCommentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)





class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        students = Student.objects.filter(classroom_id=class_id).annotate(
            total_assignments=Count('assignment', distinct=True),
            completed_assignments=Count(Case(
                When(submission__status='submitted', then='submission__assignment'),
                output_field=IntegerField(),
            ), distinct=True),
            total_points=Sum('submission__points', filter=models.Q(submission__status='submitted'), distinct=True),
        )
        serializer = LeaderboardSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

