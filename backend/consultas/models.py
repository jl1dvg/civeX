from django.db import models
from django.utils.timezone import now


class ConsultaData(models.Model):
    hc_number = models.ForeignKey(
        'pacientes.PatientData',
        on_delete=models.CASCADE,
        related_name='consultas'
    )
    form_id = models.CharField(max_length=50, null=True, blank=True)
    fecha = models.DateField(default=now)
    motivo_consulta = models.TextField()
    enfermedad_actual = models.TextField(null=True, blank=True)
    examen_fisico = models.TextField(null=True, blank=True)
    plan = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    diagnosticos = models.JSONField(null=True, blank=True)  # Cambiado aquí
    examenes = models.JSONField(null=True, blank=True)  # Cambiado aquí

    class Meta:
        db_table = 'consulta_data'

    class Meta:
        db_table = 'consulta_data'
        verbose_name = "Consulta"
        verbose_name_plural = "Consultas"

    def __str__(self):
        return f"Consulta {self.form_id} - {self.hc_number}"
