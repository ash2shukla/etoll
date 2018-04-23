from rest_framework.views import APIView
from rest_framework.response import Response
from .models import VehicleSerializer
from .models import Vehicle
from random import random
from base64 import b64encode
from qrcode import make
from io import BytesIO


class AddVehicle(APIView):
    def getRCData(self, RC):
        """
        Return RC's Owner Name, Address, Vehicle Number
        """
        return 'TEST_USER', 'TEST_ADDRESS', 'TEST 123456', 'CJV'

    def post(self, request, format=None):
        """
        Adds a vehicle to the request's associated user
        """
        RC = request.data['RC']
        # Get vehicle Number etc. and verify whether the request.user is actual
        # owner, at present considering it true for ever
        owner, address, vehicle_no, vtype = self.getRCData(RC)

        pin = str(random())[2:6]
        data = {'owner': request.user.id,
                'vehicle_no': vehicle_no,
                'RC': RC,
                'pin': pin,
                'vtype': vtype
                }
        serializer = VehicleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'pin': pin})
        else:
            return Response({'err': serializer.errors})


class Share(APIView):
    def post(self, request, typ, format=None):
        """
        Returns a vehicle's corresponding share QR else PIN
        """
        try:
            vehicle_obj = Vehicle.objects.get(RC=request.data['RC'])
        except Vehicle.DoesNotExist:
            return Response({'err': 'RC DoesNotExist'})
        except Exception as e:
            return Response({'err': e})
        if vehicle_obj.owner == request.user:
            pass
        elif request.user in vehicle_obj.sharedWith.all():
            pass
        else:
            return Response({'err': 'Vehicle Neither Owned Nor Shared'})
        if typ == 'qr':
            # Create a QR of request.data['RC'], it's PIN with csv
            qr_data_raw = vehicle_obj.RC + ',' + vehicle_obj.pin
            bio = BytesIO()
            qr = make(qr_data_raw)
            qr.save(bio, type='JPEG')
            b64qr = b64encode(bio.getvalue())
            return Response({'qr': b64qr.decode()})
        elif typ == 'pin':
            return Response({'pin': vehicle_obj.pin})
        return Response()


class AddShare(APIView):
    def post(self, request, format=None):
        """
        Adds a vehicle to a user as shared RC
        """
        try:
            vehicle_obj = Vehicle.objects.get(RC=request.data['RC'])
        except Vehicle.DoesNotExist:
            return Response({'err': 'RC DoesNotExist'})
        except Exception as e:
            return Response({'err': e})

        if request.user == vehicle_obj.owner:
            return Response({'err': 'Cant share owned vehicle with yourself.'})
        try:
            pin = request.data['pin']
        except Exception as e:
            return Response({'err': e})
        if vehicle_obj.pin == pin:
            vehicle_obj.sharedWith.add(request.user)
            return Response({'pin':''})
        else:
            return Response({'res': 'wrong pin'})
        return Response({'res': 'some other error occured'})


class ListOwned(APIView):
    def get(self, request, format=None):
        """
        Return a list of owned vehicles by the request.user
        """
        owned_vehicles = Vehicle.objects.filter(owner__exact=request.user)
        retval = []
        for i in owned_vehicles:
            retval.append(i.__json__())
        return Response(retval)


class ListShared(APIView):
    def get(self, request, format=None):
        """
        Return a list of vehicles shared with request.user
        """
        shared_vehicles = Vehicle.objects.filter(sharedWith__exact=request.user)
        retval = []
        for i in shared_vehicles:
            retval.append(i.__json__())
        return Response(retval)
