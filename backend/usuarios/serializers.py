from rest_framework import serializers  # Asegúrate de importar esto
from usuarios.models import CustomUser  # Importa el modelo necesario

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'subespecialidad', 'especialidad', 'profile_picture']
        extra_kwargs = {
            'profile_picture': {'required': False}
        }