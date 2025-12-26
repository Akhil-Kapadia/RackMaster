from django.db import migrations


def create_example_data(apps, schema_editor):
    Rack = apps.get_model("RackMaster", "Rack")
    Unit = apps.get_model("RackMaster", "Unit")
    Device = apps.get_model("RackMaster", "Device")
    Connection = apps.get_model("RackMaster", "Connection")
    DeviceModule = apps.get_model("RackMaster", "DeviceModule")
    UnitType = apps.get_model("RackMaster", "UnitType")
    DeviceType = apps.get_model("RackMaster", "DeviceType")
    StatusMessage = apps.get_model("RackMaster", "StatusMessage")

    # Status messages
    info, _ = StatusMessage.objects.get_or_create(message="All good", severity="INFO")
    warn, _ = StatusMessage.objects.get_or_create(
        message="Temperature high", severity="WARNING"
    )

    # Unit types and device types
    oneu, _ = UnitType.objects.get_or_create(
        name="Example_Unit_Type_1", defaults={"size_u": 1}
    )
    twou, _ = UnitType.objects.get_or_create(
        name="Example_Unit_Type_2", defaults={"size_u": 2}
    )
    server_type, _ = DeviceType.objects.get_or_create(name="Example_Server")
    switch_type, _ = DeviceType.objects.get_or_create(name="Example_Switch")

    # Racks
    rack1, _ = Rack.objects.get_or_create(
        name="Example Rack 1",
        defaults={
            "location": "Example Data Center A",
            "size_u": 42,
            "serial_number": "RACK-EX-001",
            "status_message_id": info.id,
        },
    )
    rack2, _ = Rack.objects.get_or_create(
        name="Example Rack 2",
        defaults={
            "location": "Example Data Center B",
            "size_u": 24,
            "serial_number": "RACK-EX-002",
            "status_message_id": warn.id,
        },
    )

    # Units
    unit1, _ = Unit.objects.get_or_create(
        serial_number="UNIT-EX-001",
        defaults={
            "unit_type_id": oneu.id,
            "rack_id": rack1.id,
            "position": 1,
            "status_message_id": info.id,
        },
    )
    unit2, _ = Unit.objects.get_or_create(
        serial_number="UNIT-EX-002",
        defaults={
            "unit_type_id": twou.id,
            "rack_id": rack1.id,
            "position": 2,
            "status_message_id": info.id,
        },
    )
    unit3, _ = Unit.objects.get_or_create(
        serial_number="UNIT-EX-003",
        defaults={
            "unit_type_id": oneu.id,
            "rack_id": rack2.id,
            "position": 1,
            "status_message_id": info.id,
        },
    )

    # Devices
    dev1, _ = Device.objects.get_or_create(
        serial_number="DEV-EX-001",
        defaults={
            "device_type_id": server_type.id,
            "unit_id": unit1.id,
            "status_message_id": info.id,
        },
    )
    dev2, _ = Device.objects.get_or_create(
        serial_number="DEV-EX-002",
        defaults={
            "device_type_id": switch_type.id,
            "unit_id": unit2.id,
            "status_message_id": warn.id,
        },
    )

    # Device modules
    mod1, _ = DeviceModule.objects.get_or_create(
        serial_number="MOD-EX-001",
        defaults={
            "device_id": dev1.id,
            "name": "Power Module A",
            "status_message_id": info.id,
        },
    )

    # Connections between units
    Connection.objects.get_or_create(
        from_unit_id=unit1.id,
        to_unit_id=unit2.id,
        defaults={
            "connection_type": "ETHERNET",
            "label": "Example_uplink-1-2",
        },
    )


def remove_example_data(apps, schema_editor):
    Rack = apps.get_model("RackMaster", "Rack")
    Unit = apps.get_model("RackMaster", "Unit")
    Device = apps.get_model("RackMaster", "Device")
    Connection = apps.get_model("RackMaster", "Connection")
    DeviceModule = apps.get_model("RackMaster", "DeviceModule")
    UnitType = apps.get_model("RackMaster", "UnitType")
    DeviceType = apps.get_model("RackMaster", "DeviceType")
    StatusMessage = apps.get_model("RackMaster", "StatusMessage")

    DeviceModule.objects.filter(serial_number__in=["MOD-EX-001"]).delete()
    Device.objects.filter(serial_number__in=["DEV-EX-001", "DEV-EX-002"]).delete()
    Connection.objects.filter(label="Example_uplink-1-2").delete()
    Unit.objects.filter(
        serial_number__in=["UNIT-EX-001", "UNIT-EX-002", "UNIT-EX-003"]
    ).delete()
    Rack.objects.filter(name__in=["Example Rack 1", "Example Rack 2"]).delete()
    UnitType.objects.filter(
        name__in=["Example_Unit_Type_1", "Example_Unit_Type_2"]
    ).delete()
    DeviceType.objects.filter(name__in=["Example_Server", "Example_Switch"]).delete()
    StatusMessage.objects.filter(message__in=["All good", "Temperature high"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("RackMaster", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_example_data, remove_example_data),
    ]
