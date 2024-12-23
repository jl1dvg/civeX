import os
import django
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cive.settings")
django.setup()

with connection.cursor() as cursor:
    cursor.execute("SELECT @@sql_mode;")
    print(cursor.fetchone())