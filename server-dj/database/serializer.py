from rest_framework import serializers
from .models import *

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ["fullName", "email", "password", "role"]

