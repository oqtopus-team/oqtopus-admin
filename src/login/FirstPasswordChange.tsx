import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import LogInRoute from './LogInRoute';
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
    username: yup
      .string()
      .required(t('auth.password_change.validation_warning.user_name'))
      .email(t('auth.password_change.validation_warning.mail')),
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
interface LoginInputs {
  username: string;
  currentPassword: string;
  newPassword: string;
}

const FirstPasswordChange: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const processing = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(validationRules(t)),
  });
  useEffect(() => {
    document.title = `${t('auth.password_change.first_change')} | ${appName}`;
  });
  const onSubmit: SubmitHandler<LoginInputs> = () => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    auth
      .firstChangePassword(username, currentPassword, newPassword, t)
      .then((result) => {
        if (result.success) {
          alert(t('auth.password_change.success'));
          navigate({ pathname: '/users' });
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
    <LogInRoute>
      <Container className="login-container">
        <Card>
          <Card.Header as="h4">{appName}</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="text-start">{t('auth.password_change.mail')}</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter Email"
                  {...register('username', {
                    onChange: (e) => setUsername(e.target.value),
                  })}
                  isInvalid={errors.username != null}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="currentPassword">
                <Form.Label>{t('auth.password_change.current')}</Form.Label>
                <Form.Control
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
      </Container>
    </LogInRoute>
  );
};

export default FirstPasswordChange;
