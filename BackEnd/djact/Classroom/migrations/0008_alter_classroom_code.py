# Generated by Django 5.0.3 on 2024-06-16 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Classroom', '0007_alter_classroom_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='code',
            field=models.CharField(default='2vus0Y', max_length=6, unique=True),
        ),
    ]
