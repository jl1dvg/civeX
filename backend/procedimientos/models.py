from django.db import models
from pacientes.models import PatientData  # Relación con patient_data (hc_number)

class ProcedimientoProyectado(models.Model):
    form_id = models.IntegerField()
    procedimiento_proyectado = models.TextField()
    doctor = models.CharField(max_length=255, null=True, blank=True)
    hc_number = models.CharField(max_length=255)  # Relación con patient_data

class SolicitudProcedimiento(models.Model):
    hc_number = models.CharField(max_length=20)  # Relación con patient_data
    form_id = models.CharField(max_length=20)  # Relación con ProcedimientoProyectado
    tipo = models.CharField(max_length=100, null=True, blank=True)
    afiliacion = models.CharField(max_length=100, null=True, blank=True)
    procedimiento = models.CharField(max_length=255, null=True, blank=True)
    doctor = models.CharField(max_length=100, null=True, blank=True)
    fecha = models.DateTimeField(null=True, blank=True)
    duracion = models.IntegerField(null=True, blank=True)
    ojo = models.CharField(max_length=10, null=True, blank=True)
    prioridad = models.CharField(max_length=10, null=True, blank=True)
    producto = models.CharField(max_length=255, null=True, blank=True)
    observacion = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    secuencia = models.IntegerField()