import { api } from './apiClient';

export async function fetchUnitTypes(): Promise<any[]> {
  const response = await api.get('unittypes/', {
    params: { limit: 1000 },
  });
  return response.data?.results ?? response.data;
}

export async function fetchDeviceTypes(): Promise<any[]> {
  const response = await api.get('devicetypes/', {
    params: { limit: 1000 },
  });
  return response.data?.results ?? response.data;
}

export async function fetchUnits(numberOfUnits: number = 100): Promise<any[]> {
  const response = await api.get('units/', {
    params: { limit: numberOfUnits },
  });
  return response.data?.results ?? response.data;
}

export async function fetchDevices(numberOfDevices: number = 100): Promise<any[]> {
  const response = await api.get('devices/', {
    params: { limit: numberOfDevices },
  });
  return response.data?.results ?? response.data;
}