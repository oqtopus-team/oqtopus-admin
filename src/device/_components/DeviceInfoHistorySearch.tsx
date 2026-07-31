import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DefaultModal from '../../common/Modal';
import { errorToastConfig, successToastConfig } from '../../config/toast-notification';
import { Device, DeviceInfoHistoryEntry } from '../../types/DeviceType';
import { useDeviceAPI } from '../DeviceApi';
import { DateTimeFormatter } from '../common/DateTimeFormatter';
import { useTranslation } from 'react-i18next';

type SearchParams = {
  deviceId?: string;
  from?: string;
  to?: string;
};

type PresetOption = 'today' | 'last7Days' | 'last30Days';

interface DeviceInfoHistorySearchProps {
  devices: Device[];
}

export const DeviceInfoHistorySearch: React.FC<DeviceInfoHistorySearchProps> = ({ devices }) => {
  const [params, setParams] = useState<SearchParams>({});
  const [appliedParams, setAppliedParams] = useState<SearchParams>({});
  const [histories, setHistories] = useState<DeviceInfoHistoryEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasDateRangeError, setHasDateRangeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeviceInfoHistoryEntry>();
  const [isDeleting, setIsDeleting] = useState(false);
  const { getDeviceInfoHistory, deleteDeviceHistory } = useDeviceAPI();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setParams((currentParams) => {
      if (
        currentParams.deviceId === undefined ||
        devices.some((device) => device.id === currentParams.deviceId)
      ) {
        return currentParams;
      }
      return { ...currentParams, deviceId: undefined };
    });
    setAppliedParams((currentParams) => {
      if (
        currentParams.deviceId === undefined ||
        devices.some((device) => device.id === currentParams.deviceId)
      ) {
        return currentParams;
      }
      return { ...currentParams, deviceId: undefined };
    });
  }, [devices]);

  const fetchHistories = async (searchParams: SearchParams): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await getDeviceInfoHistory(
        searchParams.deviceId,
        searchParams.from,
        searchParams.to,
        100,
        0
      );
      setHistories(result.items);
      setTotalCount(result.total);
    } catch {
      setHistories([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchHistories(appliedParams);
  }, [appliedParams]);

  const validateDateRange = (from: string | undefined, to: string | undefined): boolean => {
    if (!from || !to) {
      setHasDateRangeError(false);
      return true;
    }

    const isValidRange = new Date(from) <= new Date(to);
    setHasDateRangeError(!isValidRange);
    return isValidRange;
  };

  const updateDatesWithPreset = (preset: PresetOption): void => {
    const anchorDate = new Date();
    const from = new Date(anchorDate);
    const to = new Date(anchorDate);

    if (preset === 'today') {
      from.setHours(0, 0, 0, 0);
    } else if (preset === 'last7Days') {
      from.setDate(anchorDate.getDate() - 6);
      from.setHours(0, 0, 0, 0);
    } else {
      from.setDate(anchorDate.getDate() - 29);
      from.setHours(0, 0, 0, 0);
    }

    to.setHours(23, 59, 59, 999);
    setHasDateRangeError(false);
    setParams({ ...params, from: from.toISOString(), to: to.toISOString() });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!validateDateRange(params.from, params.to)) return;
    setAppliedParams(params);
  };

  const handleClear = (): void => {
    setHasDateRangeError(false);
    setParams({});
    setAppliedParams({});
  };

  const handleDelete = async (): Promise<void> => {
    if (deleteTarget === undefined || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteDeviceHistory(deleteTarget.historyUid);
      setHistories((current) =>
        current.filter((history) => history.historyUid !== deleteTarget.historyUid)
      );
      setTotalCount((current) => Math.max(0, current - 1));
      toast(t('device.history.delete.success'), successToastConfig);
    } catch {
      toast(t('device.history.delete.failure'), errorToastConfig);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(undefined);
    }
  };

  return (
    <div>
      <Form noValidate onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-3">
          <Form.Group style={{ minWidth: '16rem' }}>
            <Form.Label>{t('device.id')}</Form.Label>
            <Form.Select
              value={params.deviceId ?? ''}
              onChange={(event) =>
                setParams({ ...params, deviceId: event.currentTarget.value || undefined })
              }
            >
              <option value="">{t('device.history.all_devices')}</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.id}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('device.history.from')}</Form.Label>
            <DatePicker
              className={`form-control${hasDateRangeError ? ' is-invalid' : ''}`}
              placeholderText="yyyy/MM/dd HH:mm"
              showTimeSelect
              selected={params.from ? new Date(params.from) : undefined}
              isClearable
              onChange={(fromDate) => {
                validateDateRange(fromDate?.toISOString(), params.to);
                setParams({ ...params, from: fromDate?.toISOString() });
              }}
              dateFormat="yyyy/MM/dd HH:mm"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t('device.history.to')}</Form.Label>
            <DatePicker
              className={`form-control${hasDateRangeError ? ' is-invalid' : ''}`}
              placeholderText="yyyy/MM/dd HH:mm"
              showTimeSelect
              selected={params.to ? new Date(params.to) : undefined}
              isClearable
              onChange={(toDate) => {
                validateDateRange(params.from, toDate?.toISOString());
                setParams({ ...params, to: toDate?.toISOString() });
              }}
              dateFormat="yyyy/MM/dd HH:mm"
            />
          </Form.Group>
          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => updateDatesWithPreset('today')}
            >
              {t('device.history.today')}
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => updateDatesWithPreset('last7Days')}
            >
              {t('device.history.last_7_days')}
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => updateDatesWithPreset('last30Days')}
            >
              {t('device.history.last_30_days')}
            </Button>
            <Button variant="outline-secondary" type="button" onClick={handleClear}>
              {t('device.history.clear_filter')}
            </Button>
            <Button type="submit">{t('device.history.search')}</Button>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge text-bg-light">
            {t('device.history.filtered_count', { count: totalCount })}
          </span>
          {hasDateRangeError && (
            <span className="text-danger small">{t('device.history.invalid_range')}</span>
          )}
        </div>
      </Form>

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr className="text-center">
            <th>{t('device.id')}</th>
            <th>{t('device.history.calibrated_at')}</th>
            <th>{t('device.qubits')}</th>
            <th>{t('device.history.couplings')}</th>
            <th>{t('device.history.operations')}</th>
          </tr>
        </thead>
        <tbody>
          {histories.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                {isLoading ? t('device.history.loading') : t('device.history.empty')}
              </td>
            </tr>
          ) : (
            histories.map((history) => (
              <tr key={history.historyUid} className="text-center">
                <td>
                  <Link to={`/device/${history.deviceId}`} className="text-link">
                    {history.deviceId}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/device/${history.deviceId}?deviceHistoryUid=${encodeURIComponent(history.historyUid)}`}
                    className="text-link"
                  >
                    {DateTimeFormatter(t, i18n, history.calibratedAt)}
                  </Link>
                </td>
                <td>{history.nQubits}</td>
                <td>{history.nCouplings}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(history)}
                  >
                    {t('device.history.delete.button')}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <DefaultModal
        show={deleteTarget !== undefined}
        onHide={() => setDeleteTarget(undefined)}
        message={t('device.history.delete.confirm', {
          calibrated_at: DateTimeFormatter(t, i18n, deleteTarget?.calibratedAt),
        })}
        execFunction={() => {
          void handleDelete();
        }}
      />
    </div>
  );
};
