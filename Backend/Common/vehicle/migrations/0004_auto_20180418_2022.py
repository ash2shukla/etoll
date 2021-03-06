# Generated by Django 2.0.2 on 2018-04-18 20:22

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicle', '0003_vehicle_vtype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehicle',
            name='RC',
            field=models.CharField(default='', max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='pin',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='sharedWith',
            field=models.ManyToManyField(default=None, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='vehicle_no',
            field=models.CharField(default='', max_length=100),
        ),
    ]
