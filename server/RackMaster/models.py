from django.db import models


class Severity(models.TextChoices):
    INFO = 'INFO', 'Info'
    WARNING = 'WARNING', 'Warning'
    CRITICAL = 'CRITICAL', 'Critical'


class Rack(models.Model):
    name = models.CharField(max_length=200)
    serial_number = models.CharField(max_length=200, unique=True)
    status_message = models.TextField(blank=True, null=True)
    status_severity = models.CharField(max_length=10, choices=Severity.choices, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"


class Unit(models.Model):
    class UnitType(models.TextChoices):
        SERVER = 'SERVER', 'Server'
        SWITCH = 'SWITCH', 'Switch'
        NAS = 'NAS', 'NAS'
        PSU = 'PSU', 'PSU'

    rack = models.ForeignKey(Rack, related_name='units', on_delete=models.CASCADE)
    position = models.PositiveIntegerField(blank=True, null=True)
    unit_type = models.CharField(max_length=20, choices=UnitType.choices)
    serial_number = models.CharField(max_length=200, unique=True)
    status_message = models.TextField(blank=True, null=True)
    status_severity = models.CharField(max_length=10, choices=Severity.choices, blank=True, null=True)

    # connections to other units (many-to-many self relationship)
    connections = models.ManyToManyField('self', through='Connection', symmetrical=False, related_name='connected_to', blank=True)

    def __str__(self):
        return f"{self.unit_type} - {self.serial_number}"


class Device(models.Model):
    unit = models.ForeignKey(Unit, related_name='devices', on_delete=models.CASCADE)
    device_type = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=200, unique=True)
    status_message = models.TextField(blank=True, null=True)
    status_severity = models.CharField(max_length=10, choices=Severity.choices, blank=True, null=True)

    def __str__(self):
        return f"{self.device_type} ({self.serial_number})"


class Connection(models.Model):
    from_unit = models.ForeignKey(Unit, related_name='outgoing_connections', on_delete=models.CASCADE)
    to_unit = models.ForeignKey(Unit, related_name='incoming_connections', on_delete=models.CASCADE)
    label = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_unit', 'to_unit')

    def __str__(self):
        return f"{self.from_unit} -> {self.to_unit} {self.label}"
