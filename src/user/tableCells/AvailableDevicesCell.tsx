import { User } from '../../types/UserType';

interface AvailableDevicesCellProps {
  user: User;
}

export const AvailableDevicesCell = ({ user }: AvailableDevicesCellProps) => {
  return Array.isArray(user.available_devices) ? (
    user.available_devices.map((deviceId) => (
      <p key={deviceId} className="m-0">
        {deviceId}
      </p>
    ))
  ) : (
    <p className="m-0">{user.available_devices}</p>
  );
};
