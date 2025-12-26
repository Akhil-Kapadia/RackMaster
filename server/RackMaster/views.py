from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.forms.models import model_to_dict
from .models import (
    Rack,
    Unit,
    Device,
    Connection,
    DeviceModule,
    UnitType,
    DeviceType,
    StatusMessage,
)
from .serializers import (
    RackSerializer,
    UnitSerializer,
    DeviceSerializer,
    ConnectionSerializer,
    DeviceModuleSerializer,
    UnitTypeSerializer,
    DeviceTypeSerializer,
    StatusMessageSerializer,
)


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


class DeviceModuleViewSet(viewsets.ModelViewSet):
    queryset = DeviceModule.objects.all()
    serializer_class = DeviceModuleSerializer


class UnitTypeViewSet(viewsets.ModelViewSet):
    queryset = UnitType.objects.all()
    serializer_class = UnitTypeSerializer


class DeviceTypeViewSet(viewsets.ModelViewSet):
    queryset = DeviceType.objects.all()
    serializer_class = DeviceTypeSerializer


class StatusMessageViewSet(viewsets.ModelViewSet):
    queryset = StatusMessage.objects.all()
    serializer_class = StatusMessageSerializer


class SearchAPIView(APIView):
    """Search any whitelisted model using filter kwargs.

    POST JSON body:
    {
      "model": "Rack",
      "filters": {"name__icontains": "foo"},
      "fields": ["id", "name"],
      "limit": 50,
      "offset": 0
    }
    """

    allowed_models = {
        'Rack': Rack,
        'Unit': Unit,
        'Device': Device,
        'Connection': Connection,
        'DeviceModule': DeviceModule,
        'UnitType': UnitType,
        'DeviceType': DeviceType,
        'StatusMessage': StatusMessage,
    }

    def post(self, request):
        data = request.data or {}
        model_name = data.get('model')
        if not model_name or model_name not in self.allowed_models:
            return Response({'error': 'Invalid or missing model'}, status=status.HTTP_400_BAD_REQUEST)

        model = self.allowed_models[model_name]
        filters = data.get('filters', {}) or {}
        try:
            qs = model.objects.filter(**filters)
        except Exception as exc:
            return Response({'error': f'Invalid filters: {exc}'}, status=status.HTTP_400_BAD_REQUEST)

        total = qs.count()
        try:
            offset = int(data.get('offset', 0))
            limit = int(data.get('limit', 100))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid offset/limit'}, status=status.HTTP_400_BAD_REQUEST)

        qs = qs[offset: offset + limit]
        fields = data.get('fields')
        results = []
        for obj in qs:
            if fields:
                row = {}
                for f in fields:
                    row[f] = getattr(obj, f, None)
            else:
                row = model_to_dict(obj)
            results.append(row)

        return Response({'count': total, 'results': results})
