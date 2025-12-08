import { DevicesDeviceInfoDeviceTypeEnum, DevicesDeviceInfoStatusEnum } from '../api/generated';

export type DeviceType = DevicesDeviceInfoDeviceTypeEnum;
export type DeviceStatusType = DevicesDeviceInfoStatusEnum;

export interface DevicesDeviceInfo {
  device_id: string;
  device_type: DeviceType;
  status: DeviceStatusType;
  available_at?: string;
  n_pending_jobs: number;
  n_qubits: number;
  basis_gates: string[];
  supported_instructions: string[];
  device_info?: string;
  calibrated_at?: string;
  description: string;
}

export interface Device {
  id: string;
  deviceType: DeviceType;
  status: DeviceStatusType;
  availableAt?: string;
  nPendingJobs: number;
  nQubits: number;
  basisGates: string[];
  supportedInstructions: string[];
  deviceInfo?: string;
  calibratedAt?: string;
  description: string;
}

export interface DeviceForm {
  deviceInfo?: string;
  deviceType?: DeviceType;
  status?: DeviceStatusType;
  qubits?: number;
  availableAt?: Date;
  basisGates?: string;
  instructions?: string;
  calibratedAt?: Date;
  description?: string;
}

export interface SendDbDevice {
  device_info?: string;
  device_type?: DeviceType;
  status?: DeviceStatusType;
  n_qubits?: number;
  available_at?: string;
  basis_gates?: string[];
  supported_instructions?: string[];
  calibrated_at?: string;
  description?: string;
}
