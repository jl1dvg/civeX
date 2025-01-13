from django.urls import path
from protocolos.views import ProtocoloDataListView, GenerateProtocolPDFDataView, ProtocoloAllDataListView, \
    ProtocoloDetailView

urlpatterns = [
    path('list/', ProtocoloDataListView.as_view(), name='protocolos-list'),
    path('complete_list/', ProtocoloAllDataListView.as_view(), name='protocolos-complete-list'),
    path('detail/', ProtocoloDetailView.as_view(), name='protocolo-detail'),
    path('generate_pdf_data/', GenerateProtocolPDFDataView.as_view(), name='generate_pdf_data'),
]
