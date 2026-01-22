import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Announcement, useAnnouncementAPI } from './AnnouncementApi';
import { errorToastConfig, successToastConfig } from '../config/toast-notification';
import './announcementsList.css';
import { DateTimeFormatter } from '../device/common/DateTimeFormatter';

const columnHelper = createColumnHelper<Announcement>();
const getStatusColor = (publishable: boolean): string => {
  return publishable ? '#316cf4' : '#fc6464';
};

const PAGE_LIMIT = 10;

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingState, setLoading] = useState({
    delete: false,
    get: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getAnnouncements, deleteAnnouncement } = useAnnouncementAPI();

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
      const result = await getAnnouncements({
        order: sortConfig.direction.toUpperCase(),
      });
      setSorting([{ id: columnId, desc: sortConfig.direction === 'desc' }]);
      setAnnouncements(result);
      setHasMore(result.length === PAGE_LIMIT);
      setPage(0);
    } catch (e) {}
  };

  const columns = useMemo<Array<ColumnDef<Announcement, any>>>(
    () => [
      columnHelper.accessor('title', {
        header: 'announcements.title',
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
        header: 'announcements.publish_start_date',
        enableSorting: true,
        cell: ({ getValue }) => <div>{DateTimeFormatter(t, i18n, getValue())}</div>,
      }),

      columnHelper.accessor('end_time', {
        header: 'announcements.publish_end_date',
        enableSorting: true,
        cell: ({ getValue }) => <div>{DateTimeFormatter(t, i18n, getValue())}</div>,
      }),

      columnHelper.accessor('publishable', {
        header: 'announcements.publish_setting',
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
        header: 'announcements.actions.title',
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
        header: 'announcements.save_time',
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
      await deleteAnnouncement(announcementId);

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

  async function getAnnouncementsList(currentTime?: string) {
    setLoading({ ...loadingState, get: true });
    try {
      const announcements = await getAnnouncements({ currentTime, offset: PAGE_LIMIT * page });
      setPage(page + 1);
      setHasMore(announcements.length === PAGE_LIMIT);

      setAnnouncements((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const unique = announcements.filter((a) => !existingIds.has(a.id));
        return [...prev, ...unique];
      });
    } catch (e) {
      console.error('Error fetching announcements:', e);
    } finally {
      setLoading({ ...loadingState, get: false });
    }
  }

  async function onActiveInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    await getAnnouncementsList(checked ? new Date().toISOString() : undefined);
  }

  useEffect(() => {
    if (announcements.length > 0) return;

    getAnnouncementsList();
  }, []);

  return (
    <div id={'scroll-target'} className="vertical-scrollable-container">
      <InfiniteScroll
        next={getAnnouncementsList}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        dataLength={announcements.length}
        scrollableTarget={'scroll-target'}
      >
        <div className="announcements-list-header">
          <Link to={'/announcements/create'}>
            <Button size="sm" style={{ width: '75px' }}>
              {t('users.white_list.register.button.add')}
            </Button>
          </Link>
          <label className="active-items-toggle">
            <input type="checkbox" onChange={onActiveInputChange} />
            <span>Show only active</span>
          </label>
        </div>
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
                      <span>
                        {flexRender(
                          t(header.column.columnDef.header as string),
                          header.getContext()
                        )}
                      </span>
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
      </InfiniteScroll>
    </div>
  );
};

export default AnnouncementsList;
