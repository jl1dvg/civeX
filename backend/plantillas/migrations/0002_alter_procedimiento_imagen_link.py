# Generated by Django 4.2.17 on 2024-12-27 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plantillas', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='procedimiento',
            name='imagen_link',
            field=models.ImageField(blank=True, null=True, upload_to='uploads/'),
        ),
    ]
