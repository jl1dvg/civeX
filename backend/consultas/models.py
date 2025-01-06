from django.db import models
from pacientes.models import PatientData
from django.contrib.postgres.fields import JSONField
from django.utils.timezone import now


class ConsultaData(models.Model):
    hc_number = models.CharField(max_length=50, null=True, blank=True)
    form_id = models.CharField(max_length=50, null=True, blank=True)
    fecha = models.DateField(default=now)
    motivo_consulta = models.TextField()
    enfermedad_actual = models.TextField(null=True, blank=True)
    examen_fisico = models.TextField(null=True, blank=True)
    plan = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    diagnosticos = JSONField(default=list, blank=True)
    examenes = JSONField(default=list, blank=True)

    class Meta:
        db_table = 'consulta_data'
        verbose_name = "Consulta"
        verbose_name_plural = "Consultas"

    def __str__(self):
        return f"Consulta {self.form_id} - {self.hc_number}"
