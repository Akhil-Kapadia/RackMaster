from rest_framework import serializers
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


class StatusMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusMessage
        fields = '__all__'
        read_only_fields = ('created_at',)


class UnitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitType
        fields = '__all__'


class DeviceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceType
        fields = '__all__'


class DeviceModuleSerializer(serializers.ModelSerializer):
    status_message = StatusMessageSerializer(read_only=True)

    class Meta:
        model = DeviceModule
        fields = '__all__'


class DeviceSerializer(serializers.ModelSerializer):
    modules = DeviceModuleSerializer(many=True, read_only=True)
    status_message = StatusMessageSerializer(read_only=True)

    class Meta:
        model = Device
        fields = '__all__'


class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = '__all__'


class UnitSerializer(serializers.ModelSerializer):
    devices = DeviceSerializer(many=True, read_only=True)
    outgoing_connections = ConnectionSerializer(many=True, read_only=True)
    incoming_connections = ConnectionSerializer(many=True, read_only=True)
    unit_type = UnitTypeSerializer(read_only=True)
    status_message = StatusMessageSerializer(read_only=True)

    class Meta:
        model = Unit
        fields = '__all__'


class RackSerializer(serializers.ModelSerializer):
    units = UnitSerializer(many=True, read_only=True)
    status_message = StatusMessageSerializer(read_only=True)

    class Meta:
        model = Rack
        fields = '__all__'
