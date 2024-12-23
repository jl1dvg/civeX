from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('usuarios.urls')),  # Asegúrate de que 'usuarios' está incluido aquí
    path('api/pacientes/', include('pacientes.urls')),
]

# Solo para desarrollo (sirve los archivos estáticos de `MEDIA_URL`)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)