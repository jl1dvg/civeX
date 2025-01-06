from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_subscribed = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    nombre = models.CharField(max_length=255)
    mname = models.CharField(max_length=255, null=True, blank=True)  # Nombre Completo
    lname2 = models.CharField(max_length=255, null=True, blank=True)  # Nombre Completo
    nombre = models.CharField(max_length=255, null=True, blank=True)  # Nombre Completo
    cedula = models.CharField(max_length=20, null=True, blank=True)  # Cedula
    registro = models.CharField(max_length=50, null=True, blank=True)  # Registro
    sede = models.CharField(max_length=100, null=True, blank=True)  # Sede
    firma = models.ImageField(upload_to='firmas/', blank=True, null=True)
    especialidad = models.CharField(max_length=100, null=True, blank=True)  # Especialidad
    subespecialidad = models.CharField(max_length=100, null=True, blank=True)  # Subespecialidad
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    class Meta:
        db_table = 'usuarios'  # Especifica el nombre de la tabla
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


