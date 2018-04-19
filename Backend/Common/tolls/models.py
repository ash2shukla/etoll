from django.db import models
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from vehicle.models import Vehicle
from django.utils import timezone


class eToll(models.Model):
    eTollID = models.CharField(max_length=100, null=False, primary_key=True)
    lat_lng = models.CharField(max_length=100)
    # meta_data should be a JSONField in PostgreSQL
    meta_data = models.CharField(max_length=1000)

    def __str__(self):
        return self.eTollID


class Transaction(models.Model):
    eTollTxnID = models.CharField(max_length=100, null=False)
    gatewayTxnID = models.CharField(max_length=100, null=False, unique=True)
    dl = models.ForeignKey(User, on_delete=models.CASCADE)
    rc = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    eTollID = models.ForeignKey(eToll, on_delete=models.CASCADE)
    ttype = models.CharField(max_length=10, null=False)
    usability = models.IntegerField(default=0)
    created = models.DateTimeField(editable=False, null=True)
    modified = models.DateTimeField(null=True)
    amount_paid = models.CharField(max_length=5, null=True)
    validity = models.BooleanField(default=True)

    def __str__(self):
        return self.eTollTxnID

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
        self.modified = timezone.now()
        return super(Transaction, self).save(*args, **kwargs)


class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['eTollTxnID', 'gatewayTxnID', 'dl', 'rc', 'eTollID', 'ttype',
                  'usability', 'amount_paid']
