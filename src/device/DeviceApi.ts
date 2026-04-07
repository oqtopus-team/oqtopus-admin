import { Device, DeviceForm, SendDbDevice } from '../types/DeviceType';
import { ApiResponse } from '../types/CommonType';
import { useContext } from 'react';
import { DevicesDeviceInfo as ApiDevicesDeviceInfo } from '../api/generated';
import { userApiContext } from '../backend/Provider';

const convertDeviceResult = (device: ApiDevicesDeviceInfo): Device => ({
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

export const useDeviceAPI = () => {
  const api = useContext(userApiContext);

  const getDevices = async (): Promise<Device[]> => {
    const res = await api.device.listDevices();
    return res.data.map(convertDeviceResult);
  };

  const getDevice = async (id: string) => {
    const res = await api.device.getDevice(id);
    return convertDeviceResult(res.data);
  };

  const postDevice = async (device: DeviceForm) => {
    await api.device.registerDevice(convertDeviceForm(device));
  };

  const patchDevice = async (deviceId: string, device: DeviceForm) => {
    await api.device.updateDeviceData(deviceId, convertDeviceForm(device));
  };

  const deleteDevice = async (deviceId: string) => {
    await api.device.deleteDevice(deviceId);
  };

  return { getDevices, getDevice, postDevice, patchDevice, deleteDevice };
};
