import React, { useRef, useState } from 'react';
// import {ModalProps} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import * as EmailValidator from 'email-validator';
import { useSetLoading } from '../common/Loader';
import { useWhitelistUserAPI } from './WhitelistUserApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Device } from '../types/DeviceType';

const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';
const useOrganization: boolean = import.meta.env.VITE_USE_ORGANIZATION === 'enable';

interface ExcelImportInput {
  file: FileList;
}

interface ModalProps {
  show: boolean;
  onHide: Function;
  devices: Device[];
}

const WhitelistUserRegisterModal: React.FunctionComponent<ModalProps> = (props) => {
  const [file, setFile] = useState<FileList>();
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const setLoading = useSetLoading();
  const processing = useRef(false);
  const { reset, register, handleSubmit } = useForm<ExcelImportInput>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { registerUsers } = useWhitelistUserAPI();

  const onSubmit: SubmitHandler<ExcelImportInput> = async () => {
    setDisableButton(true);
    setLoading(true);
    // Prevent double-click
    if (processing.current) return;
    processing.current = true;

    if (file === undefined) {
      processing.current = false;
      setLoading(false);
      alert(t('users.white_list.register.excel.error.load'));
      setDisableButton(false);
      reset();
      setFile(undefined);
      return;
    }

    const workbook = await handleFileAsync(file[0]);
    const validationResult = validateExcelFile(workbook);
    if (validationResult.hasError) {
      processing.current = false;
      setLoading(false);
      alert(validationResult.errorMessage);
      setDisableButton(false);
      reset();
      setFile(undefined);
      return;
    }

    try {
      const response = await registerUsers(validationResult.whitelist, t);
      if (response.success) {
        alert(response.message);
        navigate('/whitelist');
      } else {
        alert(`${t('users.white_list.register.excel.error.register')} \n` + response.message);
      }
    } catch (e) {
      alert(t('users.white_list.register.excel.error.system_error'));
    } finally {
      processing.current = false;
      setLoading(false);
      setDisableButton(false);
      reset();
      setFile(undefined);
    }
  };

  async function handleFileAsync(file: File): Promise<XLSX.WorkBook> {
    const data = await file?.arrayBuffer();
    return XLSX.read(data, { raw: false, cellText: true, cellDates: true });
  }

  function validateExcelFile(workbook: XLSX.WorkBook): any {
    let hasError = true;
    let errorMessage = '';
    const whitelist = [];
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (sheet === undefined) {
      errorMessage = t('users.white_list.register.excel.error.invalid_spreadsheet');
      return {
        hasError,
        errorMessage,
      };
    }
    const sheetJson: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const header: string[] = sheetJson[0];
    if (
      header[0] !== t('users.white_list.register.excel.header.group_id') ||
      header[1] !== t('users.white_list.register.excel.header.mail') ||
      (useUsername && header[2] !== t('users.white_list.register.excel.header.name')) ||
      (useOrganization && header[3] !== t('users.white_list.register.excel.header.organization'))
    ) {
      errorMessage = t('users.white_list.register.excel.error.invalid_header');
      return {
        hasError,
        errorMessage,
      };
    }

    const data: string[][] = sheetJson.slice(1);
    if (data.length === 0) {
      errorMessage = t('users.white_list.register.excel.error.no_data');
      return {
        hasError,
        errorMessage,
      };
    }
    if (data.length > 100) {
      errorMessage = t('users.white_list.register.excel.error.exceeded_records');
      return {
        hasError,
        errorMessage,
      };
    }
    for (const row of data) {
      const groupId = row[0];
      const email = row[1];
      const username = row[2];
      const organization = row[3];
      const availableDevices = row[4];
      if (groupId === undefined || email === undefined) {
        errorMessage = t('users.white_list.register.excel.error.required_item');
        return {
          hasError,
          errorMessage,
        };
      }
      if (groupId.length > 100) {
        errorMessage = `${t(
          'users.white_list.register.excel.error.invalid_group_id_length'
        )} \n${groupId}`;
        return {
          hasError,
          errorMessage,
        };
      }
      if (!EmailValidator.validate(email)) {
        errorMessage = `${t('users.white_list.register.excel.error.invalid_email')} \n${email}`;
        return {
          hasError,
          errorMessage,
        };
      }
      if (email.length > 100) {
        errorMessage = `${t(
          'users.white_list.register.excel.error.invalid_email_length'
        )} \n${email}`;
        return {
          hasError,
          errorMessage,
        };
      }
      if (username !== undefined && username.length > 100) {
        errorMessage = `${t(
          'users.white_list.register.excel.error.invalid_username_length'
        )} \n${username}`;
        return {
          hasError,
          errorMessage,
        };
      }
      if (organization !== undefined && organization.length > 100) {
        errorMessage = `${t(
          'users.white_list.register.excel.error.invalid_organization_length'
        )} \n${organization}`;
        return {
          hasError,
          errorMessage,
        };
      }

      const availableDevicesList = availableDevices.split(',').map((deviceId) => deviceId.trim());
      const deviceIds = props.devices.map((device) => device.id);
      const missingIds = availableDevicesList.filter((id) => !deviceIds.includes(id));

      if (missingIds.length > 0) {
        errorMessage = t('users.white_list.register.excel.error.invalid_available_device_id', {
          missingIds,
        });
        return {
          hasError,
          errorMessage,
        };
      }

      whitelist.push({
        group_id: String(groupId),
        email: String(email),
        username: String(username),
        organization: String(organization),
        available_devices: availableDevicesList,
      });
    }

    const emails: string[] = whitelist.map((user) => user.email);
    for (const target of emails) {
      if (emails.filter((email) => email === target).length > 1) {
        errorMessage = `${t('users.white_list.register.excel.error.duplicated_email')} \n${target}`;
        return {
          hasError,
          errorMessage,
        };
      }
    }

    hasError = false;
    return {
      hasError,
      whitelist,
    };
  }

  function onHide(execFunction: Function): void {
    setFile(undefined);
    execFunction();
  }

  return (
    <Modal
      show={props.show}
      onHide={() => onHide(props.onHide)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t('users.white_list.register.excel.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              type="file"
              {...register('file', {
                onChange: (e) => setFile(e.target.files),
              })}
              disabled={disableButton}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={file === undefined || file === null || disableButton}
        >
          {t('users.white_list.register.excel.button.register')}
        </Button>
        <Button variant="secondary" onClick={() => onHide(props.onHide)} disabled={disableButton}>
          {t('users.white_list.register.excel.button.cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WhitelistUserRegisterModal;
