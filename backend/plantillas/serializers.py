# serializers.py
from rest_framework import serializers
from .models import Procedimiento, Evolucion005, InsumosPack


class ProcedimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimiento
        fields = '__all__'


class Evolucion005Serializer(serializers.ModelSerializer):
    class Meta:
        model = Evolucion005
        fields = [
            "id",
            "procedimiento",
            "pre_evolucion",
            "pre_indicacion",
            "post_evolucion",
            "post_indicacion",
            "alta_evolucion",
            "alta_indicacion",
        ]
        # O fields = '__all__' si prefieres


from rest_framework import serializers
from .models import Kardex


class KardexSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kardex
        fields = ['id', 'procedimiento', 'medicamentos']


class InsumosPackSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsumosPack
        fields = '__all__'
