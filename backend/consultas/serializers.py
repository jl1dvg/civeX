from rest_framework import serializers
from .models import ConsultaData

class ConsultaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaData
        fields = '__all__'