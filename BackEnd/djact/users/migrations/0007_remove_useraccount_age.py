# Generated by Django 5.0.3 on 2024-05-21 14:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_useraccount_age'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useraccount',
            name='age',
        ),
    ]
