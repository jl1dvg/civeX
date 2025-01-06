from rest_framework import serializers
from .models import PatientData, ProcedimientoProyectado

class ProcedimientoProyectadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcedimientoProyectado
        fields = '__all__'

class PatientDataSerializer(serializers.ModelSerializer):
    procedimientos = ProcedimientoProyectadoSerializer(many=True, read_only=True)

    class Meta:
        model = PatientData
        fields = '__all__'