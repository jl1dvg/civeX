from django.db import models
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from uuid import uuid4
from datetime import datetime
import os


# Modelo base para timestamps
class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Modelo base para relaciones
class BaseProcedimientoRelation(models.Model):
    procedimiento = models.ForeignKey('Procedimiento', on_delete=models.CASCADE, related_name='%(class)ss')
    nombre = models.CharField(max_length=50)
    lateralidad = models.CharField(max_length=255, null=True, blank=True)
    selector = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        abstract = True


# Modelo principal Procedimiento


def procedimiento_image_path(instance, filename):
    """Opcional: construir ruta según PK o algo."""
    return f"procedimientos/{instance.id}/{filename}"


class Procedimiento(TimestampedModel):
    id = models.CharField(max_length=50, primary_key=True)
    cirugia = models.CharField(max_length=255)
    categoria = models.CharField(max_length=50, db_index=True)
    membrete = models.TextField()
    medicacion = models.IntegerField(null=True, blank=True)
    cardex = models.IntegerField(null=True, blank=True)
    dieresis = models.TextField(null=True, blank=True)
    exposicion = models.TextField(null=True, blank=True)
    hallazgo = models.TextField(null=True, blank=True)
    operatorio = models.TextField(null=True, blank=True)
    anestesia = models.CharField(max_length=55, default='REGIONAL')
    complicacionesoperatorio = models.CharField(max_length=10, null=True, blank=True)
    perdidasanguineat = models.CharField(max_length=10, null=True, blank=True)
    staffCount = models.IntegerField(null=True, blank=True)
    codigoCount = models.IntegerField(null=True, blank=True)
    diagnosticoCount = models.IntegerField(null=True, blank=True)
    horas = models.CharField(max_length=3, null=True, blank=True)
    dx_pre = models.TextField()
    dx_post = models.TextField()
    imagen_link = models.ImageField(upload_to=procedimiento_image_path, null=True, blank=True)

    def __str__(self):
        return self.cirugia

    def save(self, *args, **kwargs):
        if self.operatorio:
            self.operatorio = self.operatorio.replace("\\r\\n", "\n")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.cirugia

    class Meta:
        db_table = 'procedimientos'
        verbose_name = "Procedimiento"
        verbose_name_plural = "Procedimientos"
        indexes = [
            models.Index(fields=['categoria'], name='idx_categoria'),
            models.Index(fields=['id'], name='idx_procedimiento_id'),
        ]


# Modelo ProcedimientoCódigo
class ProcedimientoCodigo(BaseProcedimientoRelation):
    class Meta:
        db_table = 'procedimientos_codigos'
        verbose_name = "Procedimiento Código"
        verbose_name_plural = "Procedimientos Códigos"


# Modelo ProcedimientoDiagnóstico
class ProcedimientoDiagnostico(BaseProcedimientoRelation):
    definitivo = models.CharField(max_length=255)

    class Meta:
        db_table = 'procedimientos_diagnosticos'
        verbose_name = "Procedimiento Diagnóstico"
        verbose_name_plural = "Procedimientos Diagnósticos"


# Modelo ProcedimientoTécnico
class ProcedimientoTecnico(BaseProcedimientoRelation):
    funcion = models.CharField(max_length=50)
    trabajador = models.CharField(max_length=255)

    class Meta:
        db_table = 'procedimientos_tecnicos'
        verbose_name = "Procedimiento Técnico"
        verbose_name_plural = "Procedimientos Técnicos"


# Modelo Evolución 005
class Evolucion005(TimestampedModel):
    procedimiento = models.ForeignKey(Procedimiento, on_delete=models.CASCADE, related_name='evoluciones')
    pre_evolucion = models.TextField(null=True, blank=True)
    pre_indicacion = models.TextField(null=True, blank=True)
    post_evolucion = models.TextField(null=True, blank=True)
    post_indicacion = models.TextField(null=True, blank=True)
    alta_evolucion = models.TextField(null=True, blank=True)
    alta_indicacion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'evolucion005'
        verbose_name = "Evolución 005"
        verbose_name_plural = "Evoluciones 005"


# Modelo InsumosPack
class InsumosPack(TimestampedModel):
    procedimiento = models.ForeignKey(Procedimiento, on_delete=models.CASCADE, related_name='insumos')
    insumos = models.JSONField()

    class Meta:
        db_table = 'insumos_pack'
        verbose_name = "Insumos Pack"
        verbose_name_plural = "Insumos Pack"


# Modelo Kardex
class Kardex(TimestampedModel):
    procedimiento = models.ForeignKey(Procedimiento, on_delete=models.CASCADE, related_name='kardex')
    medicamentos = models.JSONField()

    class Meta:
        db_table = 'kardex'
        verbose_name = "Kardex"
        verbose_name_plural = "Kardex"
