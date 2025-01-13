# pacientes/serializers.py
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

class PatientDataListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientData
        fields = [
            'hc_number',
            'full_name',
            'fecha_caducidad',
            'afiliacion',
        ]

    def get_full_name(self, obj):
        """
        Retorna la concatenación fname + lname + lname2
        """
        return f"{obj.fname} {obj.lname} {obj.lname2 or ''}".strip()
