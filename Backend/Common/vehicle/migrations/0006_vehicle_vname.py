# Generated by Django 2.0.2 on 2018-04-20 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicle', '0005_vehicle_vmodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehicle',
            name='vname',
            field=models.CharField(default='', max_length=300),
        ),
    ]
