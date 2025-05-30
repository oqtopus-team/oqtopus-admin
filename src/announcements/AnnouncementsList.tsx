import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useAuth } from '../hooks/use-auth';
import BaseLayout from '../common/BaseLayout';
import { Announcement, deleteAnnouncement, getAnnouncements } from './AnnouncementApi';
import { errorToastConfig, successToastConfig } from '../config/toast-notification';
import './announcementsList.css';
import { DateTimeFormatter } from '../device/common/DateTimeFormatter';

const columnHelper = createColumnHelper<Announcement>();
const getStatusColor = (publishable: boolean): string => {
  return publishable ? '#316cf4' : '#fc6464';
};

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingState, setLoading] = useState({
    delete: false,
    get: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleCustomSort = async (columnId: string) => {
    const currentSort = sorting.find((s) => s.id === columnId);
    let newDirection: 'asc' | 'desc';

    if (!currentSort) {
      newDirection = 'asc';
    } else {
      newDirection = currentSort.desc ? 'asc' : 'desc';
    }

    const sortConfig = {
      columnId,
      direction: newDirection,
    };

    try {
      //TODO: Important! After implementing the backend (sorting for every field), we need to change the sorting logic here.
      const result = await getAnnouncements(auth.idToken, {
        order: sortConfig.direction,
      });
      setSorting([{ id: columnId, desc: sortConfig.direction === 'desc' }]);
      setAnnouncements(result);
    } catch (e) {}
  };

  const columns = useMemo<Array<ColumnDef<Announcement, any>>>(
    () => [
      columnHelper.accessor('title', {
        header: t('announcements.title'),
        enableSorting: true,
        cell: ({ getValue }) => (
          <div
            style={{
              maxWidth: '130px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getValue()}
          </div>
        ),
      }),

      columnHelper.accessor('start_time', {
        header: t('announcements.publish_start_date'),
        enableSorting: true,
        cell: ({ getValue }) => <div>{DateTimeFormatter(t, i18n, getValue())}</div>,
      }),

      columnHelper.accessor('end_time', {
        header: t('announcements.publish_end_date'),
        enableSorting: true,
        cell: ({ getValue }) => <div>{DateTimeFormatter(t, i18n, getValue())}</div>,
      }),

      columnHelper.accessor('publishable', {
        header: t('announcements.publish_setting'),
        enableSorting: true,
        cell: ({ getValue }) => {
          const value: boolean = getValue();

          return (
            <div
              style={{
                color: getStatusColor(value),
              }}
            >
              {t(value ? 'announcements.publishable' : 'announcements.unpublishable')}
            </div>
          );
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: t('announcements.actions.title'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="action_cell">
            <Button
              disabled={loadingState.delete}
              onClick={() => {
                handleEditPost(row.original.id);
              }}
              className="action_button"
            >
              {t('announcements.actions.edit')}
            </Button>
            <Button
              disabled={loadingState.delete}
              variant="danger"
              onClick={() => handleDeletePost(row.original.id)}
              className="action_button"
            >
              {t('announcements.actions.delete')}
            </Button>
          </div>
        ),
      }),

      columnHelper.accessor('updated_at', {
        header: t('announcements.save_time'),
        enableSorting: true,
        cell: ({ getValue }) => <div>{DateTimeFormatter(t, i18n, getValue())}</div>,
      }),
    ],
    [loadingState]
  );

  const handleEditPost = (postId: number) => {
    navigate(`/announcements/edit/${postId}`);
  };

  const handleDeletePost = async (announcementId: number) => {
    setLoading({ ...loadingState, delete: true });
    try {
      await deleteAnnouncement(announcementId, auth.idToken);

      setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementId));

      toast(t('announcements.deleted_success'), successToastConfig);
    } catch (e) {
      toast(t('announcements.deleted_failed'), errorToastConfig);
      console.error('Error deleting announcement:', e);
    } finally {
      setLoading({ ...loadingState, delete: false });
    }
  };

  const table = useReactTable<Announcement>({
    columns,
    data: announcements,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  useEffect(() => {
    if (announcements.length > 0) return;

    async function getAnnouncementsList() {
      setLoading({ ...loadingState, get: true });
      try {
        const announcements = await getAnnouncements(auth.idToken);
        setAnnouncements(announcements);
      } catch (e) {
        console.error('Error fetching announcements:', e);
      } finally {
        setLoading({ ...loadingState, get: false });
      }
    }

    getAnnouncementsList();
  }, []);

  return (
    <>
      <BaseLayout>
        <Link to={'/announcements/create'}>
          <Button size="sm" style={{ width: '75px' }}>
            {t('users.white_list.register.button.add')}
          </Button>
        </Link>
        {announcements.length > 0 ? (
          <Table bordered hover responsive style={{ marginTop: '10px' }}>
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-center">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          handleCustomSort(header.column.id);
                        }
                      }}
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getCanSort() && (
                        <span className="px-2">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? '↕'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {announcements.map((announcement) => {
                return (
                  <tr
                    key={announcement.id}
                    style={{ textAlign: 'center', verticalAlign: 'middle' }}
                  >
                    <td
                      style={{
                        maxWidth: '130px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {announcement.title}
                    </td>
                    <td>{DateTimeFormatter(t, i18n, announcement.start_time)}</td>
                    <td>{DateTimeFormatter(t, i18n, announcement.end_time)}</td>
                    <td
                      style={{
                        color: announcement.publishable ? '#316cf4' : '#fc6464',
                      }}
                    >
                      {t(
                        announcement.publishable
                          ? 'announcements.publishable'
                          : 'announcements.unpublishable'
                      )}
                    </td>
                    <td className="action_cell">
                      <Button
                        disabled={loadingState.delete}
                        onClick={() => {
                          handleEditPost(announcement.id);
                        }}
                        className="action_button"
                      >
                        {t('announcements.actions.edit')}
                      </Button>
                      <Button
                        disabled={loadingState.delete}
                        variant="danger"
                        onClick={() => handleDeletePost(announcement.id)}
                        className="action_button"
                      >
                        {t('announcements.actions.delete')}
                      </Button>
                    </td>
                    <td>{DateTimeFormatter(t, i18n, announcement.updated_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p className="no_announcements">{t('announcements.no_announcements')}</p>
        )}
      </BaseLayout>
    </>
  );
};

export default AnnouncementsList;
