from django.urls import path, include
from rest_framework import routers
from .views import (
    RackViewSet,
    UnitViewSet,
    DeviceViewSet,
    ConnectionViewSet,
    DeviceModuleViewSet,
    UnitTypeViewSet,
    DeviceTypeViewSet,
    StatusMessageViewSet,
    SearchAPIView,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response

router = routers.DefaultRouter()
router.register(r'racks', RackViewSet)
router.register(r'units', UnitViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'connections', ConnectionViewSet)
router.register(r'devicemodules', DeviceModuleViewSet)
router.register(r'unittypes', UnitTypeViewSet)
router.register(r'devicetypes', DeviceTypeViewSet)
router.register(r'statusmessages', StatusMessageViewSet)


@api_view(['GET'])
def hello(request):
    return Response({'message': 'Hello from RackMaster API'})

urlpatterns = [
    path('', include(router.urls)),
    path('hello/', hello, name='hello'),
    path('search/', SearchAPIView.as_view(), name='search'),
]
