from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from .utils import sendOTPto
from django.core.cache import cache
from random import random


class SendOTP(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        phone = request.data['phone']
        sendOTPto(phone)
        return Response()


class VerifyDLUID(APIView):
    """
    Sends a mock response as false or true if the uid and dl info matches
    At present it will always return True
    We do not need to save aadhaar number
    """
    permission_classes = ()

    def post(self, request, format=None):
        dl = request.data['dl']
        # otp = request.data['otp']
        # uid = request.data['uid']
        # Get Mobile Number from UID through UIDAI eKYC
        # Let the mobile number be 9818611161
        mobile = '9818611161'
        token = str(random())[2:]
        cache.set(token + 'dl', dl)
        cache.set(token + 'mob', mobile)
        return Response({'code': True, 'token': token})


class Signup(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        password = request.data['pass']
        token = request.data['token']
        dl = cache.get(token + 'dl')
        mob = cache.get(token + 'mob')
        if dl is None or mob is None:
            return Response({'res':
                             'Trying to set password without pre-steps'})
        else:
            # Create user dl = username, mob will be in profile
            user, created = User.objects.get_or_create(username=dl,
                                                       email="")
            user.set_password(password)
            if not created:
                return Response({'res': 'user already exists'})
            else:
                print(mob)
                user.profile.mobile = mob
                user.save()
                return Response({'res': 'created'})


class ListUsers(APIView):
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        print(request.user)
        usernames = [user.username for user in User.objects.all()]
        return Response(usernames)
