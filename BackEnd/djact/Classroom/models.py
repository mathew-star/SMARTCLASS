import os
import random
from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string


class Classroom(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    sections = models.TextField()
    description = models.TextField()
    banner_image = models.ImageField(upload_to='classroom_banners/', blank=True)
    code = models.CharField(max_length=6, unique=True, default=get_random_string(6))
    invite_link = models.CharField(max_length=255, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.banner_image:
            default_images = os.listdir(os.path.join(settings.MEDIA_ROOT, 'defaults'))
            random_image = random.choice(default_images)
            self.banner_image = os.path.join('defaults', random_image)
        if not self.invite_link:
            frontend_host = settings.FRONTEND_HOST
            self.invite_link = f"{frontend_host}/join/{self.code}/"
        super().save(*args, **kwargs)





class Teacher(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    super_teacher = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.name} - {self.classroom.title}"

class Student(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.name} - {self.classroom.title}"
    
class Announcements(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    announcement= models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Announcement by {self.user.name} in {self.classroom.title}"
    


class Topic(models.Model):
    title = models.CharField(max_length=255)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Assignment(models.Model):
    title = models.CharField(max_length=255)
    instructions = models.TextField()
    files = models.ManyToManyField('AssignmentFile', blank=True)
    due_date = models.DateTimeField(blank=True, null=True)
    points = models.IntegerField(default=100)
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    created_by = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    assigned_students = models.ManyToManyField(Student, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class AssignmentFile(models.Model):
    file = models.FileField(upload_to='assignment_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return os.path.basename(self.file.name)

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    files = models.ManyToManyField('SubmissionFile', blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('submitted', 'Submitted'), ('not_submitted', 'Not Submitted'), ('late', 'Late')], default='not_submitted')

    def __str__(self):
        return f"{self.student.user.name} - {self.assignment.title}"

class SubmissionFile(models.Model):
    file = models.FileField(upload_to='submission_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return os.path.basename(self.file.name)
