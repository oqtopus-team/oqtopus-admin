import React, { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/use-auth';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import AuthHeader from '../common/AuthHeader';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

const validationRules = (t: TFunction<'translation', any>) => {
  const schema = yup.object({
    totpCode: yup.string().required(t('auth.mfa.confirm.warn.required')),
  });
  return schema;
};

interface FormInput {
  totpCode: string;
}

export default function ConfirmMFA() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const processing = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(validationRules(t)),
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;
    auth
      .confirmSignIn(data.totpCode, t)
      .then((result) => {
        if (result.success) {
          navigate({ pathname: '/users' });
        } else {
          alert(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        alert(t('auth.mfa.confirm.alert.failure'));
      })
      .finally(() => {
        processing.current = false;
      });
  };

  return (
    <div>
      <AuthHeader />
      <Container className="auth-container">
        <Card>
          <Card.Header as="h4">{t('auth.mfa.confirm.title')}</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="totpCode">
                <Form.Control
                  required
                  type="text"
                  placeholder={t('auth.mfa.confirm.placeholder')}
                  {...register('totpCode')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue('totpCode', e.target.value);
                  }}
                  isInvalid={errors.totpCode != null}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.totpCode?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit">
                {t('auth.mfa.confirm.button')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
