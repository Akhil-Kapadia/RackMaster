from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Rack, Unit, Device, Connection
from .serializers import RackSerializer, UnitSerializer, DeviceSerializer, ConnectionSerializer


class RackViewSet(viewsets.ModelViewSet):
    queryset = Rack.objects.all()
    serializer_class = RackSerializer


class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer


@action(detail=False, methods=['get'])
def hello(request):
    return Response({'message': 'Hello from RackMaster API'})
