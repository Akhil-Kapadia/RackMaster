from django.urls import path, include
from rest_framework import routers
from .views import RackViewSet, UnitViewSet, DeviceViewSet, ConnectionViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response

router = routers.DefaultRouter()
router.register(r'racks', RackViewSet)
router.register(r'units', UnitViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'connections', ConnectionViewSet)


@api_view(['GET'])
def hello(request):
    return Response({'message': 'Hello from RackMaster API'})

urlpatterns = [
    path('', include(router.urls)),
    path('hello/', hello, name='hello'),
]
