from django.urls import path
from .views import (
    upload_image,
    ProcedimientoDetailView,
    CreateProcedimientoView,
    UpdateProcedimientoView,
    DeleteProcedimientoView,
    ProcedimientosPorCategoriaView,
    EvolucionDetailView,
    KardexDetailView,
    KardexListView,
    InsumosListView,
    InsumosPackDetailView
)

urlpatterns = [
    # Rutas específicas
    path('upload/', upload_image, name='upload_image'),
    path('categorias/', ProcedimientosPorCategoriaView.as_view(), name='procedimientos_por_categoria'),
    path('crear/', CreateProcedimientoView.as_view(), name='crear_procedimiento'),
    path('editar/<str:pk>/', UpdateProcedimientoView.as_view(), name='editar_procedimiento'),
    path('eliminar/<str:pk>/', DeleteProcedimientoView.as_view(), name='eliminar_procedimiento'),
    path('evolucion/<str:pk>/', EvolucionDetailView.as_view(), name='editar_evolucion'),

    # Kardex
    path('kardex/', KardexListView.as_view(), name='lista_kardex'),
    path('kardex/<str:pk>/', KardexDetailView.as_view(), name='detalle_kardex'),
    path('insumos/<str:pk>/', InsumosPackDetailView.as_view(), name='detalle_insumos'),
    path('insumos-disponibles/', InsumosListView.as_view(), name='insumos_disponibles'),

    # Rutas que atrapan un string libre al final
    path('<str:pk>/', ProcedimientoDetailView.as_view(), name='detalle_procedimiento'),
]
