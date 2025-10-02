import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import BaseLayout from '../common/BaseLayout';
import { useAuth } from '../hooks/use-auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;

// Validation Rule
const validationRules = (t: TFunction<'translation', any>) => {
  const schema = yup.object({
    currentPassword: yup.string().required(t('auth.password_change.validation_warning.current')),
    newPassword: yup
      .string()
      .required(t('auth.password_change.validation_warning.new'))
      .matches(/(?=.*[a-z])/, t('auth.password_change.validation_warning.rule1'))
      .matches(/(?=.*[A-Z])/, t('auth.password_change.validation_warning.rule2'))
      .matches(/(?=.*[0-9])/, t('auth.password_change.validation_warning.rule3'))
      .matches(/(?=.*[!-/:-@[-`{-~])/, t('auth.password_change.validation_warning.rule4'))
      .min(12, t('auth.password_change.validation_warning.rule5')),
  });
  return schema;
};

// type definition of form inputs
interface PasswordInputs {
  currentPassword: string;
  newPassword: string;
}

const PasswordChange: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const processing = useRef(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordInputs>({
    resolver: yupResolver(validationRules(t)),
  });
  useEffect(() => {
    document.title = `${t('auth.password_change.title')} | ${appName}`;
  });
  const onSubmit: SubmitHandler<PasswordInputs> = () => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    auth
      .changePassword(currentPassword, newPassword, t)
      .then((result) => {
        if (result.success) {
          alert(t('auth.password_change.success'));
          reset();
        } else {
          alert(result.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        processing.current = false;
      });
  };

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label className="text-start">{t('auth.password_change.current')}</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter Current Password"
              {...register('currentPassword', {
                onChange: (e) => setCurrentPassword(e.target.value),
              })}
              isInvalid={errors.currentPassword != null}
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>{t('auth.password_change.new')}</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter New Password"
              {...register('newPassword', {
                onChange: (e) => setNewPassword(e.target.value),
              })}
              isInvalid={errors.newPassword != null}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
            <Form.Text muted>
              {t('auth.password_change.rule')}
              <br />- {t('auth.password_change.rule1')}
              <br />- {t('auth.password_change.rule2')}
              <br />- {t('auth.password_change.rule3')}
              <br />- {t('auth.password_change.rule4')}
              <br />- {t('auth.password_change.rule5')}
            </Form.Text>
          </Form.Group>
          <div className="float-end">
            <Button variant="primary" type="submit">
              {t('auth.password_change.submit')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PasswordChange;
