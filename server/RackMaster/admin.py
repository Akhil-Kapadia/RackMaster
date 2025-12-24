from django.contrib import admin
from .models import Rack, Unit, Device, Connection


@admin.register(Rack)
class RackAdmin(admin.ModelAdmin):
    list_display = ('name', 'serial_number', 'status_severity')
    search_fields = ('name', 'serial_number')


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('unit_type', 'serial_number', 'rack', 'status_severity')
    list_filter = ('unit_type', 'status_severity')
    search_fields = ('serial_number',)


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('device_type', 'serial_number', 'unit', 'status_severity')
    search_fields = ('serial_number',)


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('from_unit', 'to_unit', 'label', 'created_at')
