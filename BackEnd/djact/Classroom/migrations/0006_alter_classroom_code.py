# Generated by Django 5.0.3 on 2024-06-14 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Classroom', '0005_alter_classroom_code_privatecomment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classroom',
            name='code',
            field=models.CharField(default='e6Y3HA', max_length=6, unique=True),
        ),
    ]
