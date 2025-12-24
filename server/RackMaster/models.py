from django.db import models


class Severity(models.TextChoices):
    INFO = 'INFO', 'Info'
    WARNING = 'WARNING', 'Warning'
    CRITICAL = 'CRITICAL', 'Critical'


class Rack(models.Model):
    """Model representing a physical rack in a data center."""
    name = models.CharField(max_length=256)
    location = models.CharField(max_length=256)
    serial_number = models.CharField(max_length=200, unique=True, blank=True, null=True)
    status_message = models.ForeignKey('StatusMessage', blank=True, null=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return f"{self.name} ({self.serial_number})"
    
class StatusMessage(models.Model):
    """Model to log status messages for racks and units."""
    message = models.TextField()
    severity = models.CharField(max_length=10, choices=Severity.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.severity}] {self.message}"

class UnitType(models.Model):
    """Model representing different types of units."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Unit(models.Model):
    """Model representing a unit within a rack."""
    unit_type = models.ForeignKey(UnitType, on_delete=models.CASCADE)
    rack = models.ForeignKey(Rack, related_name='units', on_delete=models.SET_NULL, blank=True, null=True)
    position = models.PositiveIntegerField(blank=True, null=True)
    serial_number = models.CharField(max_length=256, unique=True)
    status_message = models.ForeignKey(StatusMessage, blank=True, null=True, on_delete=models.SET_NULL)

    # connections to other units (many-to-many self relationship)
    connections = models.ManyToManyField('self', through='Connection', symmetrical=False, related_name='connected_to', blank=True)

    def __str__(self):
        return f"{self.unit_type} - {self.serial_number}"


class Device(models.Model):
    """Model representing a device installed in a unit."""
    unit = models.ForeignKey(Unit, related_name='devices', blank=True, null=True, on_delete=models.SET_NULL)
    device_type = models.ForeignKey('DeviceType', on_delete=models.CASCADE)
    serial_number = models.CharField(max_length=200, unique=True)
    status_message = models.ForeignKey(StatusMessage, blank=True, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device_type} ({self.serial_number})"

class DeviceType(models.Model):
    """Model representing different types of devices."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class DeviceModule(models.Model):
    """Model representing a module within a device."""
    device = models.ForeignKey(Device, related_name='modules', on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    serial_number = models.CharField(max_length=200, unique=True)
    status_message = models.ForeignKey(StatusMessage, blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"


class Connection(models.Model):
    """Model representing a connection between two units."""
    class connection_choices(models.TextChoices):
        ETHERNET = 'ETHERNET', 'Ethernet'
        FIBER = 'FIBER', 'Fiber'
        POWER = 'POWER', 'Power'
        USB = 'USB', 'USB'
        OTHER = 'OTHER', 'Other'
    connection_type = models.CharField(max_length=100, choices=connection_choices.choices)
    from_unit = models.ForeignKey(Unit, related_name='outgoing_connections', on_delete=models.CASCADE)
    to_unit = models.ForeignKey(Unit, related_name='incoming_connections', on_delete=models.CASCADE)
    label = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_unit', 'to_unit')

    def __str__(self):
        return f"{self.from_unit} -> {self.to_unit} {self.label}"
