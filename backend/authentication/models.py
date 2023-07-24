from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
   
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, is_staff=extra_fields['is_staff'],
                          is_active=extra_fields['is_active'],
                          is_superuser=extra_fields['is_superuser'],)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)



class User(AbstractUser):
    username = None
    first_name = None
    last_name = None
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    is_verified = models.BooleanField(default=False)
    name=models.CharField(max_length=100,null=False,blank=False)
    phone=models.CharField(max_length=100,null=False,blank=False)
    image=models.ImageField(upload_to='users/',blank=True,null=True)

    def __str__(self):
        return self.email

class Doctor(models.Model):
    name = models.CharField(max_length=100,blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    specialty = models.CharField(max_length=100,blank=True, null=True)
    location = models.CharField(max_length=200,blank=True, null=True)
    hospital = models.CharField(max_length=100,blank=True, null=True)
    image = models.ImageField(upload_to='doctors/', blank=True, null=True)

    def __str__(self):
        return self.name

class Boarding(models.Model):
    name = models.CharField(max_length=100,blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to='boardings/', blank=True, null=True)

    def __str__(self):
        return self.name
    
class Shop(models.Model):
    name = models.CharField(max_length=100,blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.CharField(max_length=100,blank=True, null=True)
    image = models.ImageField(upload_to='shops/', blank=True, null=True)
    price = models.CharField(max_length=20,blank=True, null=True)
    company = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.name

class Transportation(models.Model):
    name = models.CharField(max_length=100,blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to='transportations/', blank=True, null=True)
    location = models.CharField(max_length=200,blank=True, null=True)
    service = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.name

class Rescue(models.Model):
    user_id=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=100,blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True,null=True)
    image = models.ImageField(upload_to='rescues/', blank=True, null=True)
    map = models.CharField(max_length=200,blank=True, null=True)

    def __str__(self):
        return self.name
    
class Blog(models.Model):
    topic = models.CharField(max_length=200,blank=True, null=True)
    content = models.TextField(blank=True,null=True)
    image = models.ImageField(upload_to='rescues/', blank=True, null=True)

    def __str__(self):
        return self.topic
    
class Adoption(models.Model):
    user_id=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    phone = models.CharField(max_length=15, blank=True,null=True)
    image = models.ImageField(upload_to='rescues/', blank=True, null=True)
    email = models.CharField(max_length=200,blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name