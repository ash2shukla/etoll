from rest_framework.response import Response
from rest_framework.views import APIView
from vehicle.models import Vehicle
from random import random
from django.core.cache import cache
from django.utils import timezone
from .models import TransactionSerializer, Transaction


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
        self.usability_dict = {'S': 1,
                               'R': 2,
                               'M': -1,
                               'C': 1}

    def post(self, request, format=None):
        eTollTxnID = 'eTXNID' + str(random())[2:]
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
        mutable_data = request.data.dict()
        mutable_data['eTollTxnID'] = eTollTxnID
        mutable_data['dl'] = request.user.id
        mutable_data['rc'] = rc_obj.id
        mutable_data['usability'] = self.usability_dict[request.data['ttype']]
        serializer = TransactionSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save()
            # save this transaction and return a QR code containing eTollTxnID,
            # dl and rc
            return Response({'res': 'success', 'txnID': eTollTxnID})
        else:
            return Response({'res': 'fail', 'errors': serializer.errors})


class GetTransactions(APIView):
    """
    returns all transactions related to a user
    """
    def get(self, request, format=None):
        txnObjs = Transaction.objects.filter(dl=request.user)
        return Response({'data': TransactionSerializer(txnObjs, many=True).data})


class RaspbVerify(APIView):
    """
    Invoked by Raspberry Pi Invokes
    """
    permission_classes = ()

    def post(self, request, format=None):
        emitdata = {}
        qr = request.data['qr']
        eTollID = request.data['eTollID']
        emitdata['eTollID'] = eTollID
        alpred_no = request.data['alpr']
        dl, rc, vehicle_no = qr.split(',')
        emitdata['dl'] = dl
        emitdata['rc'] = rc
        emitdata['vehicle_no'] = vehicle_no
        emitdata['timestamp'] = str(int(timezone.now().timestamp() * 1000))
        try:
            txnObj = Transaction.objects.get(dl__username=dl,
                                             rc__RC=rc,
                                             eTollID=eTollID,
                                             validity=True)
            emitdata['amount_paid'] = txnObj.amount_paid
            emitdata['journey_type'] = txnObj.ttype
            if str(txnObj.rc) != alpred_no:
                return Response({'res': False, 'reason': 'ALPR Didnt Match'})
            # if the user's transaction is valid for this eToll
            # check the ttype and check the validity accordingly
            if txnObj.ttype == 'S':
                txnObj.usability = 0
                txnObj.validity = False
                txnObj.save()
                emitdata['scan_valid'] = True
                emitdata['invalid_reason'] = ''
                return Response({'res': True, 'emitdata': emitdata})
            # in order to check the time elapsed since creation of this txn
            # print((txnObj.created - timezone.now()).total_seconds())
            emitdata['scan_valid'] = False
            emitdata['invalid_reason'] = 'Invalid Type'
            return Response({'res': False, 'reason': 'Invalid Type',
                             'emitdata': emitdata})
        except Transaction.DoesNotExist:
            emitdata['scan_valid'] = False
            emitdata['invalid_reason'] = 'Transaction DoesNotExist'
            return Response({'res': False,
                             'reason': 'Transaction DoesNotExist'})
        except Exception as e:
            emitdata['scan_valid'] = False
            emitdata['invalid_reason'] = e
            return Response({'res': False, 'reason': e})
