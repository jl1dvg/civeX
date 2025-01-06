from django.db import models


class Medicamento(models.Model):
    # Si no defines un campo "id", Django generará automáticamente
    # un campo AutoField primary_key. Puedes dejarlo así o declararlo explícitamente.
    medicamento = models.CharField(max_length=255, null=False, blank=False)
    via_administracion = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        db_table = 'medicamentos'
        verbose_name = "medicamento"
        verbose_name_plural = "medicamentos"

    def __str__(self):
        return f"{self.medicamento} - {self.via_administracion}"


class Insumo(models.Model):
    # Enum en Django se maneja como choices en un CharField
    CATEGORIAS = [
        ('equipos', 'Equipos'),
        ('anestesia', 'Anestesia'),
        ('quirurgicos', 'Quirúrgicos')
    ]

    nombre = models.CharField(max_length=255, null=False, blank=False)
    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS,
        default='equipos',
        null=False,
        blank=False
    )

    class Meta:
        db_table = 'insumos'
        verbose_name = "insumo"
        verbose_name_plural = "insumos"

    def __str__(self):
        return f"{self.nombre} - {self.get_categoria_display()}"
