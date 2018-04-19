from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .utils import sendOTPto
from django.core.cache import cache
from random import random
from django.conf import settings
import jwt
from io import BytesIO
from qrcode import make
from base64 import b64encode
from vehicle.models import Vehicle


class SendOTP(APIView):
    permission_classes = ()

    def get(self, request, format=None):
        phone = request.query_params['phone']
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
        print('sent response ', {'code': True, 'token': token})
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


class GetIDQR(APIView):
    """
    Returns JWT of person's DL and RC QR with comma separated vehicle no
    """
    def post(self, request, format=None):
        dl = str(request.user)
        rc = request.data['rc']
        try:
            rc_obj = Vehicle.objects.get(RC=rc)
            if rc_obj.owner == request.user:
                print('Owner Requested')
                pass
            elif request.user in rc_obj.sharedWith.all():
                print('Shared Owner Requested')
                pass
            else:
                return Response({'err': 'Vehicle is neither shared nor owned'})
        except Vehicle.DoesNotExist:
            return Response({'err': 'Vehicle DoesNotExist'})
        qr_data_raw = ','.join([dl, rc, rc_obj.vehicle_no])
        bio = BytesIO()
        qr = make(qr_data_raw)
        qr.save(bio, type='JPEG')
        b64qr = b64encode(bio.getvalue())
        return Response({'qr': b64qr})
