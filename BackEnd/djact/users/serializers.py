from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = '__all__'

  def validate(self, data):
    print(data)
    print(data.get('password'))

    user = User(**data)
    password = data.get('password')
    print(password)

    try:
      validate_password(password, user)
    except exceptions.ValidationError as e:
      serializer_errors = serializers.as_serializer_error(e)
      raise exceptions.ValidationError(
        {'password': serializer_errors['non_field_errors']}
      )

    return data


  def create(self, validated_data):
    user = User.objects.create_user(
      name=validated_data['name'],
      email=validated_data['email'],
      password=validated_data['password'],

    )

    return user


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','name', 'email','is_superuser','is_blocked','profile_pic')