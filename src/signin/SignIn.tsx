import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import SignInRoute from './SignInRoute';
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
      .required(t('auth.signin.warn.user_name'))
      .email(t('auth.signin.warn.mail')),
    password: yup.string().required(t('auth.signin.warn.password')),
  });
  return schema;
};

// type definition of form inputs
interface SignInInputs {
  username: string;
  password: string;
}

const SignIn: React.FunctionComponent = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const processing = useRef(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: yupResolver(validationRules(t)),
  });
  useEffect(() => {
    document.title = `${t('auth.signin.title')} | ${appName}`;
  });
  const onSubmit: SubmitHandler<SignInInputs> = () => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    auth
      .signIn(username, password, t)
      .then((result) => {
        if (result.success) {
          navigate({ pathname: '/users' });
        } else {
          if (result.message === t('auth.signin.require_password_change')) {
            navigate({ pathname: '/first-password-change' });
          }
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
    <SignInRoute>
      <Container className="signin-container">
        <Card>
          <Card.Header as="h4">{t('auth.signin.title')}</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="text-start">{t('auth.signin.mail')}</Form.Label>
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
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>{t('auth.signin.password')}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  {...register('password', {
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  isInvalid={errors.password != null}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="float-end">
                <Button variant="primary" type="submit">
                  {t('auth.signin.submit')}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </SignInRoute>
  );
};

export default SignIn;
