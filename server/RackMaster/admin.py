from django.contrib import admin
from .models import Rack, Unit, Device, Connection
from django.contrib import admin
from .models import (
    Rack,
    Unit,
    Device,
    DeviceModule,
    UnitType,
    DeviceType,
    Connection,
    StatusMessage,
)


class DeviceModuleInline(admin.TabularInline):
    model = DeviceModule
    extra = 0


class DeviceInline(admin.TabularInline):
    model = Device
    extra = 0
    show_change_link = True


class ConnectionInline(admin.TabularInline):
    model = Connection
    fk_name = 'from_unit'
    extra = 0


@admin.register(UnitType)
class UnitTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(DeviceType)
class DeviceTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(StatusMessage)
class StatusMessageAdmin(admin.ModelAdmin):
    list_display = ('severity', 'message', 'created_at')
    list_filter = ('severity',)
    search_fields = ('message',)


@admin.register(Rack)
class RackAdmin(admin.ModelAdmin):
    list_display = ('name', 'serial_number', 'location', 'status_message_severity')
    search_fields = ('name', 'serial_number')

    def status_message_severity(self, obj):
        return obj.status_message.severity if obj.status_message else None
    status_message_severity.short_description = 'Severity'


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('unit_type', 'serial_number', 'rack', 'position', 'status_message_severity')
    list_filter = ('unit_type',)
    search_fields = ('serial_number',)
    inlines = (DeviceInline, ConnectionInline)

    def status_message_severity(self, obj):
        return obj.status_message.severity if obj.status_message else None
    status_message_severity.short_description = 'Severity'


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('device_type', 'serial_number', 'unit', 'status_message_severity', 'created_at')
    search_fields = ('serial_number',)
    inlines = (DeviceModuleInline,)

    def status_message_severity(self, obj):
        return obj.status_message.severity if obj.status_message else None
    status_message_severity.short_description = 'Severity'


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('from_unit', 'to_unit', 'connection_type', 'label', 'created_at')
    list_filter = ('connection_type',)
    search_fields = ('label',)
