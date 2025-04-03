import { DeviceForm } from '../../types/DeviceType';
import { DisplayInfo } from './_components/DisplayInfo';
import { dateDisplay } from '../common/DateDisplay';
import { useTranslation } from 'react-i18next';

interface DeviceFormConfirmProps {
  inputData: DeviceForm;
}

export const DeviceFormConfirm: React.FC<DeviceFormConfirmProps> = ({ inputData }) => {
  const availableAtString = dateDisplay(inputData.availableAt?.toISOString());
  const calibratedAtString = dateDisplay(inputData.calibratedAt?.toISOString());
  const { t } = useTranslation();

  return (
    <div>
      <DisplayInfo title={t('device.device_type')} info={inputData.deviceType}></DisplayInfo>

      <DisplayInfo
        title={t('device.form.device_info')}
        info={inputData.deviceInfo}
        spacer={true}
      ></DisplayInfo>

      <DisplayInfo title={t('device.status')} info={inputData.status} spacer={true}></DisplayInfo>

      <DisplayInfo
        title={t('device.qubits')}
        info={inputData.qubits?.toString() ?? ''}
        spacer={true}
      ></DisplayInfo>

      <DisplayInfo
        title={t('device.form.available_at')}
        info={availableAtString}
        spacer={true}
      ></DisplayInfo>

      <DisplayInfo
        title={t('device.form.calibrated_at')}
        info={calibratedAtString}
        spacer={true}
      ></DisplayInfo>

      <DisplayInfo
        title={t('device.form.basis_gates')}
        info={inputData.basisGates}
        spacer={true}
      ></DisplayInfo>

      <DisplayInfo
        title={t('device.form.instructions')}
        info={inputData.instructions}
        spacer={true}
      ></DisplayInfo>

      <DisplayInfo
        title={t('device.description')}
        info={inputData.description}
        spacer={true}
      ></DisplayInfo>
    </div>
  );
};
