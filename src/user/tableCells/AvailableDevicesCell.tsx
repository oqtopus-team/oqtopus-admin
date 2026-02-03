interface AvailableDevicesCellProps<T extends { available_devices: string | string[] }> {
  user: T;
}

export const AvailableDevicesCell = <T extends { available_devices: string | string[] }>({
                                                                                           user,
                                                                                         }: AvailableDevicesCellProps<T>) => {
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