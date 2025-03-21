import React, { useState, useRef, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import * as XLSX from 'xlsx';

import BaseLayout from '../common/BaseLayout';
import { FaPlus } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultModal from '../common/Modal';
import { useSetLoading } from '../common/Loader';
import { registerUsers } from './WhitelistUserApi';
import { useAuth } from '../hooks/use-auth';
import { ApiResponse } from '../types/CommonType';
import WhitelistUserRegisterModal from './WhitelistUserRegisterModal';
import { TestFunction } from 'yup';
import { useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;
const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';
const useOrganization: boolean = import.meta.env.VITE_USE_ORGANIZATION === 'enable';

// validation rule
const validateDuplicatedEmail: TestFunction = (email: unknown, context): boolean => {
  if (context.from === undefined) {
    return false;
  }

  const whitelist = context.from[1].value.whitelist;
  if (whitelist.length < 2) return true;

  let dupCount = 0;
  for (let i = 0; i < whitelist.length; i += 1) {
    if (whitelist[i].email === email) {
      dupCount += 1;
      if (dupCount > 1) {
        return false;
      }
    }
  }

  return true;
};

const validationRules = (t: TFunction<"translation", any>) => {
  const schema = yup.object().shape({
    whitelist: yup.array(
      yup.object().shape({
        group_id: yup
          .string()
          .required(t('users.white_list.register.warn.group_id'))
          .max(100, t('users.white_list.register.warn.group_id_length')),
        email: yup
          .string()
          .required(t('users.white_list.register.warn.email'))
          .email(t('users.white_list.register.warn.email_invalid'))
          .max(100, t('users.white_list.register.warn.email_length'))
          .test('email-dup', t('users.white_list.register.warn.email_duplicated'), validateDuplicatedEmail),
        username: yup.string().max(100, t('users.white_list.register.warn.username_length')),
        organization: yup.string().max(100, t('users.white_list.register.warn.organization_length')),
      })
    ),
  });
  return schema;
}

const WhitelistUserRegister: React.FunctionComponent = () => {
  const auth = useAuth();
  const [registerConfirmModalShow, setRegisterConfirmModalShow] = useState(false);
  const [registerImportModalShow, setRegisterImportModalShow] = useState(false);
  const processing = useRef(false);
  const setLoading = useSetLoading();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('users.white_list.register.title')} | ${appName}`;
  }, [auth.idToken]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      whitelist: [
        {
          group_id: '',
          email: '',
          username: '',
          organization: '',
        },
      ],
    },
    resolver: yupResolver(validationRules(t)),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'whitelist',
  });

  const validationErrors = errors.whitelist;

  const onSubmit = (data: any): void => {
    // API request
    if (processing.current) return; // Prevent double-click
    processing.current = true;
    setLoading(true);

    if (data.whitelist.length === 0) {
      alert(t('users.white_list.register.warn.no_data'));
      processing.current = false;
      setLoading(false);
      return;
    }

    registerUsers(data.whitelist, auth.idToken, t)
      .then((res: ApiResponse) => {
        if (res.success) {
          alert(res.message);
          navigate('/whitelist');
        } else {
          alert(t('users.white_list.register.failure') + res.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        processing.current = false;
        setLoading(false);
      });
  };

  const confirmDataClear = (): void => {
    alert(t('users.white_list.register.clear_confirm'));
    reset();
  };

  const downloadExcel = (): void => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, t('users.white_list.register.title'));
    const header = [];
    header.push(t('users.white_list.register.excel.header.group_id'));
    header.push(t('users.white_list.register.excel.header.mail'));
    if (useUsername) header.push(t('users.white_list.register.excel.header.name'));
    if (useOrganization) header.push(t('users.white_list.register.excel.header.organization'));
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 30 }];

    XLSX.writeFile(workbook, `${t('users.white_list.register.title')}.xlsx`, { compression: true });
  };

  return (
    <BaseLayout>
      <Stack gap={3}>
        <Row className="mb-5 pb-3">
          <h1>{t('users.white_list.register.header')}</h1>
          <div className="text-end">
            <Button
              variant="primary"
              onClick={() => setRegisterImportModalShow(true)}
              className="me-2"
            >
              {t('users.white_list.register.excel.button.import')}
            </Button>
            <Button variant="primary" onClick={downloadExcel} className="bg-secondary">
            {t('users.white_list.register.excel.button.template')}
            </Button>
          </div>
        </Row>
        <p className="text-danger">{t('users.white_list.register.excel.notice')}</p>
        {fields.map((field: any, index: number) => (
          <Row key={field.id} className="mb-2">
            <Form.Group as={Col}>
              <Form.Control
                autoComplete="off"
                placeholder={t('users.group_id')}
                {...register(`whitelist.${index}.group_id`)}
              />
              <p style={{ color: 'red' }} className="small">
                <span>{validationErrors?.[index]?.group_id?.message}</span>
              </p>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control
                autoComplete="off"
                placeholder={t('users.mail')}
                {...register(`whitelist.${index}.email`)}
              />
              <p style={{ color: 'red' }} className="small">
                <span>{validationErrors?.[index]?.email?.message}</span>
              </p>
            </Form.Group>
            {useUsername ? (
              <Form.Group as={Col}>
                <Form.Control
                  autoComplete="off"
                  placeholder={t('users.name')}
                  {...register(`whitelist.${index}.username`)}
                />
                <p style={{ color: 'red' }} className="small">
                  <span>{validationErrors?.[index]?.username?.message}</span>
                </p>
              </Form.Group>
            ) : (
              ''
            )}
            {useOrganization ? (
              <Form.Group as={Col}>
                <Form.Control
                  autoComplete="off"
                  placeholder={t('users.organization')}
                  {...register(`whitelist.${index}.organization`)}
                />
                <p style={{ color: 'red' }} className="small">
                  <span>{validationErrors?.[index]?.organization?.message}</span>
                </p>
              </Form.Group>
            ) : (
              ''
            )}
            <Col className="text-center col-1 pt-1">
              <GrClose onClick={() => remove(index)}></GrClose>
            </Col>
          </Row>
        ))}
        <Row>
          <div className="text-center">
            {fields.length <= 100 ? (
              <Button
                className="bg-secondary"
                onClick={() =>
                  append({
                    group_id: '',
                    email: '',
                    username: '',
                    organization: '',
                  })
                }
              >
                <FaPlus /> {t('users.white_list.register.button.add')}
              </Button>
            ) : (
              ''
            )}
          </div>
        </Row>
        <Row className="mt-5">
          <Col className="text-end">
            <Button
              className="bg-primary w-25"
              onClick={handleSubmit(() => setRegisterConfirmModalShow(true))}
              disabled={fields.length === 0}
            >
              {t('users.white_list.register.button.register')}
            </Button>
          </Col>
          <Col className="text-start">
            <Button
              className="bg-secondary w-25"
              onClick={() => confirmDataClear()}
              disabled={fields.length === 0}
            >
              {t('users.white_list.register.button.clear')}
            </Button>
          </Col>
        </Row>
        <DefaultModal
          show={registerConfirmModalShow}
          onHide={() => setRegisterConfirmModalShow(false)}
          message={t('users.white_list.register.register_confirm')}
          execFunction={handleSubmit(onSubmit)}
        />
        <WhitelistUserRegisterModal
          show={registerImportModalShow}
          onHide={() => setRegisterImportModalShow(false)}
        />
      </Stack>
    </BaseLayout>
  );
};

export default WhitelistUserRegister;
