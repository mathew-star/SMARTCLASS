from celery import shared_task
from notifications.models import Notification
from django.contrib.auth import get_user_model
User = get_user_model()

@shared_task
def send_assignment_notification(assignment_id):
    from Classroom.models import Assignment, Student
    assignment = Assignment.objects.get(id=assignment_id)
    message = f'New assignment "{assignment.title}" has been posted in {assignment.classroom.title}.'
    for student in assignment.assigned_students.all():
        Notification.objects.create(recipient=student.user, message=message)

@shared_task
def send_submission_grade_notification(submission_id):
    from Classroom.models import Submission
    submission = Submission.objects.get(id=submission_id)
    message = f'Your submission for assignment "{submission.assignment.title}" has been graded.'
    Notification.objects.create(recipient=submission.student.user, message=message)
