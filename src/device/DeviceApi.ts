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
    try {
      const res = await api.device.listDevices();
      return res.data.map(convertDeviceResult);
    } catch (e) {
      console.error('Error fetching devices:', e);
      return [];
    }
  };

  const getDevice = async (id: string): Promise<Device | null> => {
    try {
      const res = await api.device.getDevice(id);
      if (res.status === 200) {
        return convertDeviceResult(res.data);
      }
      return null;
    } catch (e) {
      console.error('Error fetching device:', e);
      return null;
    }
  };

  const postDevice = async (device: DeviceForm): Promise<ApiResponse> => {
    try {
      const res = await api.device.registerDevice(convertDeviceForm(device));
      return {
        success: res.status === 200,
        message:
          res.status === 200 ? 'Device registered successfully' : 'Failed to register device',
      };
    } catch (e) {
      console.error('Error registering device:', e);
      return { success: false, message: 'Failed to register device' };
    }
  };

  const patchDevice = async (deviceId: string, device: DeviceForm): Promise<ApiResponse> => {
    try {
      const res = await api.device.updateDeviceData(deviceId, convertDeviceForm(device));
      return {
        success: res.status === 200,
        message: res.status === 200 ? 'Device updated successfully' : 'Failed to update device',
      };
    } catch (e) {
      console.error('Error updating device:', e);
      return { success: false, message: 'Failed to update device' };
    }
  };

  const deleteDevice = async (deviceId: string): Promise<ApiResponse> => {
    try {
      const res = await api.device.deleteDevice(deviceId);
      return {
        success: res.status === 204,
        message: res.status === 204 ? 'Device deleted successfully' : 'Failed to delete device',
      };
    } catch (e) {
      console.error('Error deleting device:', e);
      return { success: false, message: 'Failed to delete device' };
    }
  };

  return { getDevices, getDevice, postDevice, patchDevice, deleteDevice };
};
