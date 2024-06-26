import os
import random
from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string
import boto3


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
        # Only set a default banner image if it's a new instance and no banner_image is provided
        if not self.pk and not self.banner_image:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            bucket_name = settings.AWS_STORAGE_BUCKET_NAME
            default_images = s3_client.list_objects_v2(Bucket=bucket_name, Prefix='defaults/')['Contents']
            default_image_keys = [image['Key'] for image in default_images if image['Key'] != 'defaults/']
            random_image_key = random.choice(default_image_keys)
            self.banner_image = random_image_key

        # Set invite link if not already set
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
    points = models.IntegerField(null=True, blank=True,default=0)

    def __str__(self):
        return f"{self.student.user.name} - {self.assignment.title}"

class SubmissionFile(models.Model):
    file = models.FileField(upload_to='submission_files/') 
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return os.path.basename(self.file.name)


class PrivateComment(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.name} on {self.assignment.title}"