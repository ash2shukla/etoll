from rest_framework.response import Response
from rest_framework.views import APIView
from vehicle.models import Vehicle
from random import random
from base64 import b64encode
from qrcode import make
from io import BytesIO
from django.contrib.auth.models import User
from .models import TransactionSerializer


class TollTax(APIView):
    """
    Return Toll Tax for a vehicle RC
    """
    def get_toll(self, vtype, eTollID, ttype):
        # calculate toll for a vtype @ eTollID for given toll type
        # Hit the external SOAP of NHAI
        # At present only return a static 100
        return 100

    def get(self, request, format=None):
        RC = request.query_params['RC']
        eTollID = request.query_params['eTollID']
        # ttype can be S, R, M, C (Single , Return , Monthly , Commercial)
        ttype = request.query_params['ttype']
        try:
            vehicle_obj = Vehicle.objects.get(RC__exact=RC)
        except Vehicle.DoesNotExist:
            return Response({'err': 'Vehicle Does not Exist'})
        except Exception as e:
            return Response({'err': e})

        tax = self.get_toll(vehicle_obj.vtype, eTollID, ttype)
        return Response({'tax': tax})


class PayToll(APIView):
    """
    Frontend calls this method with amount, udf1, udf2 etc.
    and server must return a valid transaction ID with payable amount etc.
    It's an Init method for Payment.
    Two more methods as furl and surl should be given which will be called
    if success or failure occurs.
    """
    def post(self, request, format=None):
        tid = str(random())[2:]
        cache.set(request.user.__str__() + "tid", tid)
        return Response({'txnid': tid})


class PayTollSuccess(APIView):
    """
    Consider that Gateway has forwarded it onto this URL
    The Payment Gateway returns all of the userfields with their transaction ID
    and the transactionID that we had sent as well
    dl, rc, eTollID and ttype are given as a user-defined-parameter udf1,2,3,4

    Frontend must write a logic to generate some random identifier 
    and call this URL
    """
    def __init__(self):
        self.usability_dict = {'S':1,
                               'R':2,
                               'M':-1,
                               'C':1}

    def post(self, request, format=None):
        eTollTxnID = request.data['eTollTxnID']
        dl = request.data['dl']
        rc = request.data['rc']
        rc_obj = Vehicle.objects.get(RC=rc).id
        mutable_data = request.data.dict()
        mutable_data['dl'] = User.objects.get(username=dl).id
        mutable_data['rc'] = rc
        mutable_data['usability'] = self.usability_dict[request.data['ttype']]
        serializer = TransactionSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save()
            # save this transaction and return a QR code containing eTollTxnID,
            # dl and rc

            qr_data_raw = eTollTxnID + ',' + dl + ',' + rc_obj.vehicle_no
            bio = BytesIO()
            qr = make(qr_data_raw)
            qr.save(bio, type='JPEG')
            b64qr = b64encode(bio.getvalue())
            return Response({'res': 'success', 'qr': b64qr.decode()})
        else:
            return Response({'res': 'fail', 'errors': serializer.errors})
