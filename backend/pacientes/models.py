from django.db import models

class PatientData(models.Model):
    idPrimaria = models.AutoField(primary_key=True)
    hc_number = models.CharField(max_length=255)
    fecha_caducidad = models.DateField(null=True, blank=True)
    lname = models.CharField(max_length=100, blank=True)
    lname2 = models.CharField(max_length=100, null=True, blank=True)
    fname = models.CharField(max_length=100, blank=True)
    mname = models.CharField(max_length=100, null=True, blank=True)
    afiliacion = models.CharField(max_length=255, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    sexo = models.CharField(max_length=10, null=True, blank=True)
    celular = models.CharField(max_length=15, null=True, blank=True)
    ciudad = models.CharField(max_length=50, null=True, blank=True)
    estado_civil = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    ocupacion = models.CharField(max_length=255, null=True, blank=True)
    lugar_trabajo = models.CharField(max_length=255, null=True, blank=True)
    parroquia = models.CharField(max_length=255, null=True, blank=True)
    nacionalidad = models.CharField(max_length=255, null=True, blank=True)
    id_procedencia = models.CharField(max_length=255, null=True, blank=True)
    id_referido = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'patient_data'
        verbose_name = "Patient"
        verbose_name_plural = "Patients"

    def __str__(self):
        return f"{self.hc_number} - {self.lname}, {self.fname}"