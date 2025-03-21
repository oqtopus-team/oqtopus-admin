import React, { useState, useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { DeviceForm } from '../../types/DeviceType';
import { useForm, Controller } from 'react-hook-form';
import { Headding } from './_components/Headding';
import DatePicker from 'react-datepicker';
import { Spacer } from '../../common/Spacer';
import { dateStringFormatter } from '../common/DateStringFormatter';
import Button from 'react-bootstrap/Button';
import 'react-datepicker/dist/react-datepicker.css';
import './DeviceFormEdit.css';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

const isJsonParsable = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};

const validationRules = (t: TFunction<"translation", any>) => {
  const validationRules = yup.object().shape({
    deviceType: yup.string().required(t('device.form.warn.required')),
    deviceInfo: yup
      .string()
      .required(t('device.form.warn.required'))
      .test('', t('device.form.warn.invalid_json'), isJsonParsable),
    status: yup.string().required(t('device.form.warn.required')),
    qubits: yup
      .number()
      .required(t('device.form.warn.required'))
      .typeError(t('device.form.warn.not_integer'))
      .integer(t('device.form.warn.not_integer'))
      .min(1, t('device.form.warn.not_integer')),
    availableAt: yup.date().required(t('device.form.warn.required')),
    calibratedAt: yup.date().required(t('device.form.warn.required')),
    basisGates: yup.string(),
    instructions: yup.string(),
    description: yup.string().required(t('device.form.warn.required')),
  });
  return validationRules;
};

interface DeviceFormEditProps {
  dbData?: DeviceForm;
  inputData?: DeviceForm;
  navigatePath: string;
}

export const DeviceFormEdit: React.FC<DeviceFormEditProps> = ({
  dbData,
  inputData,
  navigatePath,
}) => {
  const navigate = useNavigate();
  const [changedFields, setChangedFields] = useState<{ [key in keyof DeviceForm]?: boolean }>({});
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    control,
    getValues,
  } = useForm<DeviceForm>({
    resolver: yupResolver(validationRules(t)),
  });

  const isFromNavigate: boolean = inputData !== undefined;
  const isExistingDbData: boolean = dbData !== undefined;

  const compareData = (
    formData?: string | number | Date,
    baseData?: string | number | Date
  ): boolean => {
    if (formData === undefined || baseData === undefined) {
      return false;
    }

    const formDataStr = (() => {
      if (typeof formData === 'string') {
        return formData;
      } else if (typeof formData === 'number') {
        return formData.toString();
      } else if (formData instanceof Date) {
        return dateStringFormatter(formData);
      }
      return '';
    })();

    const dbDataStr = (() => {
      if (typeof baseData === 'string') {
        return baseData;
      } else if (typeof baseData === 'number') {
        return baseData.toString();
      } else if (baseData instanceof Date) {
        return dateStringFormatter(baseData);
      }
      return '';
    })();

    if (formDataStr !== dbDataStr) {
      return true;
    }
    return false;
  };

  const compareInputForm = useCallback(
    (name: keyof DeviceForm): boolean => {
      if (isExistingDbData) {
        try {
          if (compareData(getValues(name), dbData?.[name])) {
            return true;
          }
        } catch (error) {
          console.error(`Error in compareInputForm`);
        }
      } else if (isFromNavigate) {
        try {
          if (compareData(getValues(name), inputData?.[name])) {
            return true;
          }
        } catch (error) {
          console.error(`Error in compareInputForm`);
        }
      }

      return false;
    },
    [isExistingDbData, isFromNavigate, getValues, dbData, inputData]
  );

  const handleBasicRegisterChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    try {
      const key = event.target.name as keyof DeviceForm;
      setValue(key, event.target.value);
      if (compareInputForm(key)) {
        setChangedFields((formInfo) => ({ ...formInfo, [key]: true }));
      } else {
        setChangedFields((formInfo) => ({ ...formInfo, [key]: false }));
      }
    } catch (error) {
      console.error(`Error in handleSelectResgisterChange`);
    }
  };

  const handleDateChange = (key: keyof DeviceForm): void => {
    setValue(key, getValues(key));
    if (compareInputForm(key)) {
      setChangedFields((formInfo) => ({ ...formInfo, [key]: true }));
    } else {
      setChangedFields((formInfo) => ({ ...formInfo, [key]: false }));
    }
  };

  const onSubmit = handleSubmit((data: DeviceForm) => {
    navigate(navigatePath, {
      state: {
        dbData,
        formData: data,
        fromNavigate: true,
      },
      replace: true,
    });
  });

  useEffect(() => {
    if (isExistingDbData && isFromNavigate) {
      Object.keys(inputData ?? {}).forEach((key) => {
        setChangedFields((formInfo) => ({ ...formInfo, [key]: false }));
        if (compareInputForm(key as keyof DeviceForm)) {
          setChangedFields((formInfo) => ({ ...formInfo, [key]: true }));
        }
      });
    }
  }, [isExistingDbData, compareInputForm, inputData, isFromNavigate]);

  useEffect(() => {
    if (!isFromNavigate && isExistingDbData) {
      reset(dbData);
    } else if (isFromNavigate && inputData !== null) {
      reset(inputData);
    }
  }, [dbData, inputData, isExistingDbData, isFromNavigate, reset]);

  return (
    <form
      title={t('device.update.title')}
      onSubmit={onSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Headding
        title={`* ${t('device.device_type')}`}
        isStyle={changedFields.deviceType}
      ></Headding>
      <select
        title={t('device.device_type')}
        {...register('deviceType')}
        defaultValue={'simulator'}
        onChange={handleBasicRegisterChange}
      >
        <option value="QPU">QPU</option>
        <option value="simulator">Simulator</option>
      </select>

      <Spacer size={15} horizontal={true} />

      <Headding
        title={`* ${t('device.form.device_info')}`}
        isStyle={changedFields.deviceInfo}
      ></Headding>
      <textarea
        {...register('deviceInfo')}
        placeholder={'{...}'}
        name="deviceInfo"
        onChange={handleBasicRegisterChange}
      ></textarea>
      {typeof errors.deviceInfo?.message === 'string' && <p>{errors.deviceInfo?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <Headding
        title={`* ${t('device.status')}`}
        isStyle={changedFields.status}
      ></Headding>
      <select
        title="Status"
        {...register('status')}
        defaultValue={'Unavailable'}
        onChange={handleBasicRegisterChange}
      >
        <option value="available">Available</option>
        <option value="unavailable">Unavailable</option>
      </select>

      <Spacer size={15} horizontal={true} />

      <Headding
        title={`* ${t('device.qubits')}`}
        isStyle={changedFields.qubits}
      ></Headding>
      <textarea
        title="Qubits"
        {...register('qubits')}
        placeholder={'1'}
        name="qubits"
        onChange={handleBasicRegisterChange}
      ></textarea>
      {typeof errors.qubits?.message === 'string' && <p>{errors.qubits?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <Headding
        title={`* ${t('device.form.available_at')}`}
        isStyle={changedFields.availableAt}
      ></Headding>
      <Controller
        name="availableAt"
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            dateFormat="yyyy-MM-dd HH:mm:ss"
            showTimeSelect
            timeIntervals={1}
            selected={value !== null && value !== undefined ? new Date(value) : undefined}
            onChange={(date: Date | null) => {
              onChange(date);
              handleDateChange('availableAt');
            }}
          />
        )}
      />
      {typeof errors.availableAt?.message === 'string' && <p>{errors.availableAt?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <Headding
        title={`* ${t('device.form.calibrated_at')}`}
        isStyle={changedFields.calibratedAt}
      ></Headding>
      <Controller
        name="calibratedAt"
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            dateFormat="yyyy-MM-dd HH:mm:ss"
            showTimeSelect
            timeIntervals={1}
            selected={value !== null && value !== undefined ? new Date(value) : undefined}
            onChange={(date: Date | null) => {
              onChange(date);
              handleDateChange('calibratedAt');
            }}
          />
        )}
      />
      {typeof errors.calibratedAt?.message === 'string' && <p>{errors.calibratedAt?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <Headding
        title={t('device.form.basis_gates')}
        isStyle={changedFields.basisGates}
      ></Headding>
      <textarea
        title="Basis Gates"
        {...register('basisGates')}
        name="basisGates"
        onChange={handleBasicRegisterChange}
      ></textarea>
      {typeof errors.basisGates?.message === 'string' && <p>{errors.basisGates?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <Headding
        title={t('device.form.instructions')}
        isStyle={changedFields.instructions}
      ></Headding>
      <textarea
        title="Supported Instructions"
        {...register('instructions')}
        name="instructions"
        onChange={handleBasicRegisterChange}
      ></textarea>
      {typeof errors.instructions?.message === 'string' && <p>{errors.instructions?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <Headding
        title={`* ${t('device.description')}`}
        isStyle={changedFields.description}
      ></Headding>
      <textarea
        title="Description"
        {...register('description')}
        placeholder={'...'}
        name="description"
        onChange={handleBasicRegisterChange}
      ></textarea>
      {typeof errors.description?.message === 'string' && <p>{errors.description?.message}</p>}

      <Spacer size={15} horizontal={true} />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button type="submit">Confirm</Button>
      </div>
    </form>
  );
};
