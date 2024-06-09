# urls.py
from django.urls import path
from .views import(  CreateClassroomView, JoinClassroomView,
    TeachingClassesAPIView, EnrolledClassesAPIView, 
    UserRoleInClassAPIView,ClassroomDetailView,FetchClassMembersView, 
    RemoveStudentsView,AnnouncementView,    
    TeacherAssignmentsAPIView,
    TeacherAssignmentDetailAPIView,
    StudentAssignmentsAPIView,
    StudentSubmissionView,
    StudentSpecificSubmissionView,
    TeacherTopicsAPIView,
    StudentAssignmentAPIView,
)

urlpatterns = [
    path('create/', CreateClassroomView.as_view(), name='create-classroom'),
    path('join/', JoinClassroomView.as_view(), name='join-classroom'),
    path('teaching/', TeachingClassesAPIView.as_view(), name='teaching_classes'),
    path('enrolled/', EnrolledClassesAPIView.as_view(), name='enrolled_classes'),
    path('classroom/<int:pk>/', ClassroomDetailView.as_view(), name='classroom_detail'), 
    path('user-role/<int:pk>/', UserRoleInClassAPIView.as_view(), name='user_role_in_class'),
    path('classrooms/<int:class_id>/members/', FetchClassMembersView.as_view(), name='fetch_class_members'),
    path('classrooms/<int:class_id>/remove-students/', RemoveStudentsView.as_view(), name='remove_students'),
    path('classroom/<int:class_id>/announcements/', AnnouncementView.as_view(), name='class-announcements'),
    path('classrooms/<int:classroom_id>/topics/', TeacherTopicsAPIView.as_view(), name='teacher-topics'),
    path('classrooms/<int:classroom_id>/teacher/assignments/', TeacherAssignmentsAPIView.as_view(), name='teacher-assignments'),
    path('classrooms/<int:classroom_id>/teacher/assignments/<int:assignment_id>/', TeacherAssignmentDetailAPIView.as_view(), name='teacher-assignment-detail'),
    path('classrooms/<int:classroom_id>/student/assignments/', StudentAssignmentsAPIView.as_view(), name='student-assignments'),
    path('classrooms/<int:classroom_id>/assignments/<int:assignment_id>/',StudentAssignmentAPIView.as_view(), name="students"),
    path('classrooms/<int:class_id>/assignments/<int:assignment_id>/submit/', StudentSubmissionView.as_view(), name='submit-assignment'),
    path('classrooms/<int:classroom_id>/submission/<int:assignment_id>/<int:student_id>/', StudentSpecificSubmissionView.as_view(), name='submission-detail'),
]
