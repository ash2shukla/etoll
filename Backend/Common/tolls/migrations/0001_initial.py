# Generated by Django 2.0.2 on 2018-04-16 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='eToll',
            fields=[
                ('eTollID', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('lat_lng', models.CharField(max_length=100)),
                ('meta_data', models.CharField(max_length=1000)),
            ],
        ),
    ]