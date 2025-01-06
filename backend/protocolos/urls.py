from django.urls import path
from protocolos.views import ProtocoloDataListView, GenerateProtocolPDFDataView

urlpatterns = [
    path('list/', ProtocoloDataListView.as_view(), name='protocolos-list'),
    path('generate_pdf_data/', GenerateProtocolPDFDataView.as_view(), name='generate_pdf_data'),
]