class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'subespecialidad', 'especialidad', 'profile_picture']
        extra_kwargs = {
            'profile_picture': {'required': False}
        }