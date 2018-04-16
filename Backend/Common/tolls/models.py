from django.db import models
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from vehicle.models import Vehicle


class eToll(models.Model):
    eTollID = models.CharField(max_length=100, null=False, primary_key=True)
    lat_lng = models.CharField(max_length=100)
    # meta_data should be a JSONField in PostgreSQL
    meta_data = models.CharField(max_length=1000)

    def __str__(self):
        return self.eTollID


class Transaction(models.Model):
    eTollTxnID = models.CharField(max_length=100, null=False, primary_key=True)
    gatewayTxnID = models.CharField(max_length=100, null=False, unique=True)
    dl = models.ForeignKey(User, on_delete=models.CASCADE)
    rc = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    eTollID = models.ForeignKey(eToll, on_delete=models.CASCADE)
    ttype = models.CharField(max_length=10, null=False)
    usability = models.IntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.eTollTxnID


class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"