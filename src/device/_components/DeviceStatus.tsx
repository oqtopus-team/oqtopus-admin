import { DevicesDeviceInfoStatusEnum, DeviceStatusType } from '../../types/DeviceType';

const Available: DeviceStatusType = DevicesDeviceInfoStatusEnum.Available;
const UnAvailable: DeviceStatusType = DevicesDeviceInfoStatusEnum.Unavailable;

const DeviceStatusColor = {
  [Available]: '#43d787',
  [UnAvailable]: '#fc6464',
};

export const DeviceStatus = ({ status }: { status: DeviceStatusType }): React.ReactElement => {
  return (
    <div>
      <span style={{ color: DeviceStatusColor[status] }}>●</span>
      {status === 'available' ? 'Available' : 'Unavailable'}
    </div>
  );
};
