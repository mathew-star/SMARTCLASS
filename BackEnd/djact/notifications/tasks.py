from celery import shared_task
from django.utils import timezone
from notifications.models import Notification
from Classroom.models import Classroom,Assignment,Submission,Student,Teacher
from django.core.mail import send_mail
from django.conf import settings
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


@shared_task
def send_submission_notification(assignment_id, student_id):
    try:
        assignment = Assignment.objects.get(id=assignment_id)
        student = Student.objects.get(id=student_id)
        teacher = assignment.created_by.user
        message = f"{student.user.name} has submitted the assignment '{assignment.title}' in '{assignment.classroom.title}'."

        Notification.objects.create(
            recipient=teacher,
            message=message,
        )
    except Assignment.DoesNotExist:
        print(f"Assignment with id {assignment_id} does not exist.")
    except get_user_model().DoesNotExist:
        print(f"Student with id {student_id} does not exist.")


@shared_task
def send_assignment_reminders():
    now = timezone.now()
    upcoming_assignments = Assignment.objects.filter(due_date__gt=now, due_date__lt=now + timezone.timedelta(days=1))
    if upcoming_assignments:
        for assignment in upcoming_assignments:
            students = assignment.classroom.students.all()
            for student in students:
                message = f"Reminder: The assignment '{assignment.title}' is due soon."
                email=student.user.email
                send_mail(
                    subject="Assignment Reminder ",
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                )
                Notification.objects.create(user=student.user, message=message)
