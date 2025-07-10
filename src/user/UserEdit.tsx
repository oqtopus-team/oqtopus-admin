import React, { useEffect } from 'react';
import BaseLayout from '../common/BaseLayout';
import { useForm } from 'react-hook-form';
import { TFunction } from 'i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';

interface UserEditForm {
  username: string;
  group_id: string;
  email: string;
  organization: string;
  signup_completed: boolean;
  available_devices: [];
}

const validationRules = (t: TFunction<'translation', any>) => {
  const validationRules = yup.object().shape({
    username: yup.string().required(t('users.edit.errors.username')),
    group_id: yup.string().required(t('users.edit.errors.group_id')),
    email: yup
      .string()
      .email(t('users.edit.errors.email_format'))
      .required(t('users.edit.errors.email')),
    organization: yup.string().required(t('users.edit.errors.organization')),
    signup_completed: yup.boolean(),
  });
  return validationRules;
};

export const UserEdit = () => {
  const { t, i18n } = useTranslation();
  const {
    register,
    reset,
    formState: { errors },
    watch
  } = useForm<UserEditForm>({
    mode: 'onChange',
    resolver: yupResolver(validationRules(t)),
    defaultValues: {
      email: '',
      group_id: '',
      signup_completed: false,
      available_devices: [],
      username: '',
      organization: '',
    },
  });

  const values = watch()

  const params = useParams<{ userId: string }>();

  async function getUserData() {
    const result = new Promise((resolve) => {
      resolve({
        id: params.userId,
        username: 'testProfileName',
        group_id: 'testGroupId',
        email: 'testEmail@gmail.com',
        organization: 'testOrganization',
        status: 'active',
        signup_completed: true
      });
    });

    reset(await result)
  }

  useEffect(() => {
    getUserData()
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
                {t('users.edit.labels.username')} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={clsx('form-control', { 'is-invalid': errors.username })}
                placeholder={t('users.edit.placeholders.username')}
                {...register('username')}
              />
              {errors.username?.message && (
                <div className="invalid-feedback">{errors.username?.message}</div>
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
              <input type="text" {...register('available_devices')} className="form-control" />
            </div>
            <div className="col-md-6 d-flex align-items-end mb-2">
              <input
                className="form-check-input mt-0"
                type="checkbox"
                {...register('signup_completed')}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                }}
              />
              <label className="form-label ms-2 mb-0">
                {t('users.edit.labels.signup_complete')}
              </label>
            </div>
          </div>

          <div className="row mb-3 p-0">
            <div className="col-md-6 d-flex flex-column">
              <label className="form-label">{t('users.edit.labels.created_at')}</label>
              <DatePicker
                id="created_at"
                disabled
                selected={new Date()}
                dateFormat={t('common.date_format')}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption={t('announcements.time')}
                className="form-control editor-datepicker"
                locale={i18n.language}
              />
            </div>
            <div className="col-md-6 d-flex flex-column">
              <label className="form-label">{t('users.edit.labels.updated_at')}</label>
              <DatePicker
                id="updated_at"
                disabled
                selected={new Date()}
                dateFormat={t('common.date_format')}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption={t('announcements.time')}
                className="form-control editor-datepicker"
                locale={i18n.language}
              />
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="button" onClick={reset} className="btn btn-outline-secondary">
              {t('users.edit.reset')}
            </button>
            <button type="button" onClick={() => {}} className="btn btn-primary px-4">
              {t('users.edit.save_changes')}
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
