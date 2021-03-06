from django.db import models
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer


class Vehicle(models.Model):
    """
    vtype:
    CJV = Car/Jeep/Van
    LCV
    BT = Bus/Truck
    3AX = Upto 3 Axle vehicle
    46AX = 4 to 6 Axle vehicle
    HCMEME = HCM/EME
    7AX = 7 or more Axle
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                              related_name='%(class)s_vehicles_owner')
    vehicle_no = models.CharField(max_length=100, blank=True, null=False, default='')
    RC = models.CharField(max_length=100, blank=True, null=False, unique=True, default='')
    pin = models.CharField(max_length=100, blank=True, null=False, default='')
    vtype = models.CharField(max_length=10, blank=True, null=False, default='')
    vmodel = models.CharField(max_length=300, blank=True, default='')
    vname = models.CharField(max_length=300, blank=True, default='')
    sharedWith = models.ManyToManyField(User, blank=True, default=None)

    def __json__(self):
        return {"owner": self.owner.username, "vehicle_no": self.vehicle_no,
                "RC": self.RC, "pin": self.pin, "vtype": self.vtype,
                "vmodel": self.vmodel, "vname": self.vname}

    def __str__(self):
        return self.RC


class VehicleSerializer(ModelSerializer):

    class Meta:
        model = Vehicle
        fields = ('owner', 'vehicle_no', 'RC', 'pin', 'sharedWith', 'vtype')
