import { Device, DevicesDeviceInfo, DeviceForm, SendDbDevice } from '../types/DeviceType';
import { ApiResponse } from '../types/CommonType';

const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

const convertDeviceResult = (device: DevicesDeviceInfo): Device => ({
  id: device.device_id,
  deviceType: device.device_type,
  status: device.status,
  availableAt: device.available_at ?? undefined,
  nPendingJobs: device.n_pending_jobs,
  nQubits: device.n_qubits ?? 0,
  basisGates: device.basis_gates,
  supportedInstructions: device.supported_instructions,
  deviceInfo: device.device_info ?? '',
  calibratedAt: device.calibrated_at ?? undefined,
  description: device.description,
});

const mappings: { [key: string]: keyof SendDbDevice } = {
  availableAt: 'available_at',
  calibratedAt: 'calibrated_at',
  basisGates: 'basis_gates',
  instructions: 'supported_instructions',
  deviceInfo: 'device_info',
  deviceType: 'device_type',
  status: 'status',
  qubits: 'n_qubits',
  description: 'description',
};

const convertDeviceForm = (device: DeviceForm): SendDbDevice => {
  const result: Partial<SendDbDevice> = {};

  for (const [key, value] of Object.entries(device)) {
    if (value != null) {
      if (key === 'availableAt' || key === 'calibratedAt') {
        result[mappings[key]] = value.toISOString().replace(/\.[^.]*$/, '+00:00');
      } else if (key === 'basisGates' || key === 'instructions') {
        result[mappings[key]] = value === '' ? [] : value.split(',');
      } else {
        result[mappings[key]] = value;
      }
    }
  }

  return result;
};

export async function getDevices(idToken: string): Promise<Device[]> {
  try {
    const res = await fetch(`${apiEndpoint}/devices`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.map(convertDeviceResult);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    throw error;
  }
}

export async function getDevice(deviceId: string, idToken: string): Promise<Device> {
  try {
    const res = await fetch(`${apiEndpoint}/devices/${deviceId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return convertDeviceResult(data);
  } catch (error) {
    console.error('Failed to fetch device:', error);
    throw error;
  }
}

export async function postDevice(device: DeviceForm, idToken: string): Promise<ApiResponse> {
  const res = await fetch(`${apiEndpoint}/devices`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify(convertDeviceForm(device)),
  });
  const body = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: body.message,
    };
  }
  return {
    success: true,
    message: 'Succeeded to register device',
  };
}

export async function patchDevice(
  deviceId: string,
  device: DeviceForm,
  idToken: string
): Promise<ApiResponse> {
  const res = await fetch(`${apiEndpoint}/devices/${deviceId}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify(convertDeviceForm(device)),
  });

  const body = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: body.message,
    };
  }
  return {
    success: true,
    message: 'Succeeded to update device',
  };
}

export async function deleteDevice(deviceId: string, idToken: string): Promise<ApiResponse> {
  const res = await fetch(`${apiEndpoint}/devices/${deviceId}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
  });

  if (!res.ok) {
    return {
      success: false,
      message: 'Succeeded to delete device',
    };
  }
  return {
    success: true,
    message: 'Failed to delete device',
  };
}
