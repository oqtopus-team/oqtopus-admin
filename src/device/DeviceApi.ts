import { Device, DeviceForm, SendDbDevice } from '../types/DeviceType';
import { useContext } from 'react';
import {
  DevicesDeviceInfo as ApiDevicesDeviceInfo,
  DevicesDeviceInfoUploadPresignedURL,
} from '../api/generated';
import { userApiContext } from '../backend/Provider';
import axios from 'axios';
import JSZip from 'jszip';

const isDeviceInfoUrl = (deviceInfo: string | undefined): deviceInfo is string => {
  if (deviceInfo === undefined || deviceInfo === '') return false;
  try {
    const url = new URL(deviceInfo);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const zipDeviceInfo = async (deviceInfo: string): Promise<Blob> => {
  const zip = new JSZip();
  zip.file('device_info.json', deviceInfo);
  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
};

const convertZipBlobToString = async (zipBlob: Blob): Promise<string> => {
  const zip = await JSZip.loadAsync(zipBlob);
  const [_, file] = Object.entries(zip.files)[0] ?? [];
  if (!file) throw new Error('device_info.zip is empty');
  return await file.async('string');
};

const retrieveDeviceInfo = async (deviceInfo: string | undefined): Promise<string> => {
  if (!isDeviceInfoUrl(deviceInfo)) return deviceInfo ?? '';

  const deviceInfoUrl = deviceInfo;
  const response = await fetch(deviceInfoUrl);
  const blob = await response.blob();
  try {
    return await convertZipBlobToString(blob);
  } catch {
    return await blob.text();
  }
};

const uploadDeviceInfo = async (
  presignedUrl: DevicesDeviceInfoUploadPresignedURL,
  deviceInfo: string
): Promise<void> => {
  const { url, fields } = presignedUrl;
  if (!url || !fields) throw new Error('missing presigned URL data');

  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value == null) continue;
    formData.append(key, String(value));
  }
  formData.append('file', await zipDeviceInfo(deviceInfo), 'device_info.zip');

  await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const extractDeviceId = (device: DeviceForm): string | undefined => {
  if (!device.deviceInfo) return undefined;
  try {
    const deviceInfo = JSON.parse(device.deviceInfo) as { device_id?: unknown };
    return typeof deviceInfo.device_id === 'string' ? deviceInfo.device_id : undefined;
  } catch {
    return undefined;
  }
};

const convertDeviceResult = async (device: ApiDevicesDeviceInfo): Promise<Device> => ({
  id: device.device_id,
  deviceType: device.device_type,
  status: device.status,
  availableAt: device.available_at ?? undefined,
  nPendingJobs: device.n_pending_jobs,
  nQubits: device.n_qubits ?? 0,
  basisGates: device.basis_gates,
  supportedInstructions: device.supported_instructions,
  deviceInfo: await retrieveDeviceInfo(device.device_info),
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
    return await Promise.all(res.data.map(convertDeviceResult));
  };

  const getDevice = async (id: string) => {
    const res = await api.device.getDevice(id);
    return await convertDeviceResult(res.data);
  };

  const postDevice = async (device: DeviceForm) => {
    await api.device.registerDevice(convertDeviceForm(device));
    const deviceId = extractDeviceId(device);
    if (deviceId !== undefined && device.deviceInfo !== undefined) {
      const res = await api.device.getDeviceInfoUploadUrl(deviceId);
      await uploadDeviceInfo(res.data.presigned_url, device.deviceInfo);
    }
  };

  const patchDevice = async (deviceId: string, device: DeviceForm) => {
    const { deviceInfo, ...deviceWithoutInfo } = device;
    const patchData = convertDeviceForm(deviceWithoutInfo);
    if (deviceInfo !== undefined) {
      const res = await api.device.getDeviceInfoUploadUrl(deviceId);
      await uploadDeviceInfo(res.data.presigned_url, deviceInfo);
    }
    if (Object.keys(patchData).length > 0) {
      await api.device.updateDeviceData(deviceId, patchData);
    }
  };

  const deleteDevice = async (deviceId: string) => {
    await api.device.deleteDevice(deviceId);
  };

  return { getDevices, getDevice, postDevice, patchDevice, deleteDevice };
};
