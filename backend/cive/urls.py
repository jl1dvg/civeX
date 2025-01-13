from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="CiveX API Documentation",
        default_version='v1',
        description="Documentation for CiveX API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="info@consulmed.me"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^docs/redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('auth/', include('usuarios.urls')),  # Rutas de autenticación
    path('api/pacientes/', include('pacientes.urls')),
    path('protocolos/', include('protocolos.urls')),  # Rutas de protocolos
    path('plantillas/', include('plantillas.urls')),  # Agrega esta línea
    path('inventario/', include('inventario.urls')),  # Registrar las rutas de inventario
    path('consultas/', include('consultas.urls')),
    path('revisor-texto/', include('revisor_texto.urls')),  # Añade esta línea
]

# Solo para desarrollo (sirve los archivos estáticos de `MEDIA_URL` y `STATIC_URL`)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
