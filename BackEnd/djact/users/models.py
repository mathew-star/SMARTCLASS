from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class MyUserManager(BaseUserManager):
    def create_user(self, name, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        
        email = self.normalize_email(email)
        user = self.model(name=name, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, password=None):
        user = self.create_user(name, email, password=password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model.
    
    Attributes:
        name (str): The name of the user.
        email (str): The email address of the user, used as the unique identifier.
        profile_pic (ImageField, optional): The profile picture of the user.
        is_active (bool): Indicates if the user account is active.
        is_staff (bool): Indicates if the user has staff status.
        is_superuser (bool): Indicates if the user has superuser status.
        is_blocked (bool): Indicates if the user account is blocked.
    """
    name = models.CharField(max_length=30)
    email = models.EmailField(unique=True, max_length=200)
    profile_pic = models.ImageField(upload_to='User_profile/',null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False) 
    is_blocked = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email
