# protocolos/serializers.py
from rest_framework import serializers
from .models import ProtocoloData

class ProtocoloDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProtocoloData
        fields = '__all__'