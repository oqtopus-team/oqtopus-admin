import { useState, useLayoutEffect, useRef } from 'react';
import * as yup from 'yup';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/use-auth';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import AuthHeader from '../common/AuthHeader';
import { useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';

interface FormInput {
  totpCode: string;
}

const validationRules = (t: TFunction<'translation', any>) => {
  const schema = yup.object({
    totpCode: yup.string().required(t('auth.mfa.setup.warn.required')),
  });
  return schema;
};

export default function SetupMFA() {
  const auth = useAuth();
  const { t } = useTranslation();
  const [qrLoading, setQRLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(validationRules(t)),
  });
  const callSetUpMfa = useRef(false);
  const submitProcessing = useRef(false);

  useLayoutEffect(() => {
    if (callSetUpMfa.current) return;
    callSetUpMfa.current = true;
    auth
      .setUpMfa(t)
      .then((result) => {
        if (result.success) {
          setQRLoading(true);
        } else {
          alert(result.message);
          if (result.message === t('auth.mfa.error_alert.failed_get_setup_info')) {
            navigate({ pathname: '/login' });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // Prevent double-click
    if (submitProcessing.current) return;
    submitProcessing.current = true;

    auth
      .confirmMfa(data.totpCode, t)
      .then((result) => {
        if (result.success) {
          alert(t('auth.mfa.setup.alert.success'));
          navigate({ pathname: '/users' });
        } else {
          alert(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        alert(t('auth.mfa.setup.alert.failure'));
      })
      .finally(() => {
        submitProcessing.current = false;
      });
  };

  return (
    <div>
      <AuthHeader />
      <Container className="auth-container">
        <Card>
          <Card.Header as="h4">{t('auth.mfa.setup.title')}</Card.Header>
          <Card.Body className="mb-3">
            <div className="mb-3 ">{qrLoading && <QRCodeSVG value={auth.qrcode} />}</div>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="totpCode">
                <Form.Control
                  required
                  type="text"
                  placeholder={t('auth.mfa.setup.placeholder')}
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
                {t('auth.mfa.setup.button')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
