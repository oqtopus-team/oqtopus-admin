import React, { useEffect, useState } from 'react';
import BaseLayout from '../common/BaseLayout';
import { useForm } from 'react-hook-form';
import { TFunction } from 'i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { Combobox } from '../common/combobox/Combobox';
import { getDevices } from '../device/DeviceApi';
import { Device } from '../types/DeviceType';
import { useAuth } from '../hooks/use-auth';
import { UserStatus } from '../types/UserType';
import { getUser, updateUser } from './UserApi';
import { Select } from '../common/Select';
import { toast } from 'react-toastify';
import { errorToastConfig, successToastConfig } from '../config/toast-notification';
import { useNavigate } from 'react-router';


interface UserEditForm {
  name: string;
  group_id: string;
  email: string;
  organization: string;
  available_devices: string[];
  status: UserStatus;
}

const validationRules = (t: TFunction<'translation', any>) => {
  const validationRules = yup.object().shape({
    name: yup.string().required(t('users.edit.errors.name')),
    group_id: yup.string().required(t('users.edit.errors.group_id')),
    email: yup
      .string()
      .email(t('users.edit.errors.email_format'))
      .required(t('users.edit.errors.email')),
    organization: yup.string().required(t('users.edit.errors.organization')),
  });
  return validationRules;
};

export const UserEdit = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const auth = useAuth();
  const params = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    reset,
    formState: { dirtyFields, errors },
    watch,
    handleSubmit,
  } = useForm<UserEditForm>({
    mode: 'onChange',
    resolver: yupResolver(validationRules(t)),
    defaultValues: {
      email: '',
      group_id: '',
      available_devices: [],
      name: '',
      organization: '',
      status: UserStatus.UNAPPROVED,
    },
  });

  const [available_devices] = watch(['available_devices']);

  const getUserData = async () => {
    if (!params.userId) return;

    try {
      const userData = await getUser(auth.idToken, params.userId);
      reset(userData);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDevices = (): void => {
    getDevices(auth.idToken)
      .then((devices: Device[]) => {
        setDevices(devices);
      })
      .catch((error) => {
        console.error('Failed to fetch devices:', error);
      });
  };

  const onSubmit = async (userData: UserEditForm) => {
    if (!params.userId) return;
    const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      const typedKey = key as keyof UserEditForm;
      if (dirtyFields[typedKey]) {
        return { ...acc, [typedKey]: userData[typedKey] };
      }
      return acc;
    }, {} as Partial<UserEditForm>);

    try {
      await updateUser(auth.idToken, params.userId, changedFields);

      toast(t('users.edit.notifications.update_success'), successToastConfig);
      navigate('/users');
    } catch (e) {
      toast(t('users.edit.notifications.update_failed'), errorToastConfig);
      console.log('error', e);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <BaseLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="text-center mb-4">
            <h2 className="text-primary mb-3">{t('users.edit.title')}</h2>
            <p className="text-muted">{t('users.edit.subtitle')}</p>
          </div>

          <div className="row mb-3 p-0">
            <div className="col-md-6">
              <label className="form-label">
                {t('users.edit.labels.name')} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={clsx('form-control', { 'is-invalid': errors.name })}
                placeholder={t('users.edit.placeholders.name')}
                {...register('name')}
              />
              {errors.name?.message && (
                <div className="invalid-feedback">{errors.name?.message}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">
                {t('users.edit.labels.group_id')} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={clsx('form-control', { 'is-invalid': errors.group_id })}
                placeholder="Enter group id"
                {...register('group_id')}
              />
              {errors.group_id?.message && (
                <div className="invalid-feedback">{errors.group_id?.message}</div>
              )}
            </div>
          </div>

          <div className="row mb-3 p-0">
            <div className="col-md-6">
              <label className="form-label">
                {t('users.edit.labels.email')} <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={clsx('form-control', { 'is-invalid': errors.email })}
                placeholder="Type your email address"
                {...register('email')}
              />
              {errors.email?.message && (
                <div className="invalid-feedback">{errors.email?.message}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">
                {t('users.edit.labels.organization')} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={clsx('form-control', { 'is-invalid': errors.organization })}
                placeholder="Enter group id"
                {...register('organization')}
              />
              {errors.organization?.message && (
                <div className="invalid-feedback">{errors.organization?.message}</div>
              )}
            </div>
          </div>

          <div className="row mb-3 p-0">
            <div className="col-md-6">
              <label className="form-label">{t('users.edit.labels.available_devices')}</label>
              <Combobox
                value={available_devices}
                onChange={(value) => {
                  const { onChange, name } = register(`available_devices`);
                  onChange({ target: { name, value } });
                }}
                options={[
                  { value: '*', label: t('users.white_list.register.all_devices') },
                  ...devices.map(({ id }) => ({
                    value: id,
                    label: id,
                  })),
                ]}
                multiple
                placeholder={t('users.white_list.register.devices_combobox_placeholder')}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('users.status.name')}</label>
              <Select value={''} {...register('status')} className="w-100">
                <option value={UserStatus.APPROVED}>
                  {t(`users.status.${UserStatus.APPROVED}`)}
                </option>
                <option value={UserStatus.UNAPPROVED}>
                  {t(`users.status.${UserStatus.UNAPPROVED}`)}
                </option>
                <option value={UserStatus.SUSPENDED}>
                  {t(`users.status.${UserStatus.SUSPENDED}`)}
                </option>
              </Select>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="button" onClick={() => reset({})} className="btn btn-outline-secondary">
              {t('users.edit.reset')}
            </button>
            <button
              type="button"
              disabled={Object.keys(dirtyFields).length === 0}
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary px-4"
            >
              {t('users.edit.save_changes')}
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
