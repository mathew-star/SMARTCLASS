# Generated by Django 5.0.3 on 2024-06-14 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Classroom', '0006_alter_classroom_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='code',
            field=models.CharField(default='12p8U9', max_length=6, unique=True),
        ),
    ]