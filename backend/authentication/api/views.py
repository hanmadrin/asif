import random

# from captcha.fields import ReCaptchaField
import requests
from authentication.models import (User,Doctor,Shop,Boarding,Transportation,Rescue, Blog, Adoption)
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import strip_tags
from jwt import ExpiredSignatureError, decode, encode, exceptions
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import isVerifiedUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from . import utils
from .serializers import LoginSerializer, UserSerializer,DoctorSerializer,BoardingSerializer,ShopSerializer,TransportationSerializer,RescueSerializer,BlogListSerializer,BlogDetailSerializer, AdoptionSerializer
from datetime import datetime

class passwordChangeRequestView(generics.GenericAPIView):

    def post(self,request, *args, **kwargs):
        
        try:
            user_data = User.objects.get(email=request.data['email'])
            token = encode({'id': user_data.id},
                        settings.SECRET_KEY, algorithm='HS256')

            absurl = utils.FRONTEND_URL + "new-password?token=" + str(token)

            html_message = render_to_string('password_reset_template.html', {
                'fullname': user_data.name,
                'confirmationUrl': absurl
            })
            plain_message = strip_tags(html_message)
            send_mail(
                "Email Confirmation for Pet Care Project",
                plain_message,
                utils.EMAIL_ADDRESS,
                [user_data.email],
                html_message=html_message
            )

            return Response({"message": "Check your email"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordChangeConfirmView(generics.GenericAPIView):
    def post(self,request, *args, **kwargs):
        try:
            token = request.data['token']
            password = request.data['password']
            payload = decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['id'])
            user.set_password(password)
            user.save()
            return Response({'message': "Successfully changed the password"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


   

class userSignupView(generics.GenericAPIView):
    
    def post(self, request, *args, **kwargs):
        try:
            email=request.data['email']
            password=request.data['password']
            name=request.data['name']
            phone=request.data['phone']
            image = request.FILES.get('image', None)

            user=User.objects.create(email=email,name=name,phone=phone,image=image)
            user.set_password(password)
            user.save()
            # mail start
            user_data = User.objects.get(email=email)

            token = encode({'id': user_data.id},
                        settings.SECRET_KEY, algorithm='HS256')
            current_site = get_current_site(request).domain
            relative_link = reverse('email-verify')
            absurl = 'http://' + current_site + \
                relative_link + "?token=" + str(token)
            html_message = render_to_string('welcome-message.html', {
                'fullname': user_data.name,
                'confirmationUrl': absurl
            })
            plain_message = strip_tags(html_message)
            send_mail(
                "Email Confirmation for Pet Care Project",
                plain_message,
                utils.EMAIL_ADDRESS,
                [user_data.email],
                html_message=html_message
            )

            # mail stop

            return Response({"message": "Account created successfully"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmail(generics.GenericAPIView):

    @staticmethod
    def get(request):
        token = request.GET.get('token')
        try:
            payload = decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['id'])
            if user.is_verified is False:
                user.is_verified = True
                user.save()
            return redirect(utils.FRONTEND_URL)

        except ExpiredSignatureError:
            return Response({'message': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)

        except exceptions.DecodeError:
            return Response({'message': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)


class customAuthToken(generics.GenericAPIView):

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        Token.objects.filter(user=user).delete()
        return Response(status=status.HTTP_200_OK)


class continuousVerificationView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class DoctorListAPIView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class BoardingListAPIView(generics.ListAPIView):
    queryset = Boarding.objects.all()
    serializer_class = BoardingSerializer


class ShopListAPIView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class TransportationListAPIView(generics.ListAPIView):
    queryset = Transportation.objects.all()
    serializer_class = TransportationSerializer

class RescueListAPIView(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Rescue.objects.all()
    serializer_class = RescueSerializer
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = RescueSerializer(queryset, many=True, context={'request': request}).data
        logged_in_user_id = request.user.id if request.user.is_authenticated else None
        for data in serialized_data:
            data['editable'] = data['user_id'] == logged_in_user_id
        return Response(serialized_data)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)

class RescueRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Rescue.objects.all()
    serializer_class = RescueSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        deleted_rescue_id = instance.id
        self.perform_destroy(instance)
        return Response({"id": f"{deleted_rescue_id}"}, status=status.HTTP_204_NO_CONTENT)
    
class BlogListAPIView(generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogListSerializer

class BlogDetailAPIView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogDetailSerializer

class AdoptionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serialized_data = AdoptionSerializer(queryset, many=True, context={'request': request}).data
        logged_in_user_id = request.user.id if request.user.is_authenticated else None
        for data in serialized_data:
            data['editable'] = data['user_id'] == logged_in_user_id
        return Response(serialized_data)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)

class AdoptionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        deleted_rescue_id = instance.id
        self.perform_destroy(instance)
        return Response({"id": f"{deleted_rescue_id}"}, status=status.HTTP_204_NO_CONTENT)