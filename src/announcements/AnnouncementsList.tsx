import { useMemo, useState } from 'react';
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
import { Announcement, useAnnouncementAPI } from './AnnouncementApi';
import { errorToastConfig, successToastConfig } from '../config/toast-notification';
import './announcementsList.css';
import { DateTimeFormatter } from '../device/common/DateTimeFormatter';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

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
  const [hasMore, setHasMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getAnnouncements, deleteAnnouncement } = useAnnouncementAPI();

  const columns = useMemo<Array<ColumnDef<Announcement, any>>>(
    () => [
      columnHelper.accessor('title', {
        header: 'announcements.title',
        enableSorting: false,
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
        enableSorting: false,
        cell: ({ getValue }) => <div>{DateTimeFormatter(t, i18n, getValue())}</div>,
      }),

      columnHelper.accessor('publishable', {
        header: 'announcements.publish_setting',
        enableSorting: false,
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
        enableSorting: false,
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

  async function getAnnouncementsList({
    offset,
    filterFields,
  }: {
    offset?: number;
    filterFields?: { activeFilter: boolean };
  } = {}) {
    if (loadingState.get) return;

    setLoading((prev) => ({ ...prev, get: true }));

    try {
      const currentActiveFilter = filterFields?.activeFilter ?? activeFilter;
      const result = await getAnnouncements({
        currentTime: currentActiveFilter ? new Date().toISOString() : undefined,
        offset,
        order: sorting[0]?.desc ? 'desc' : 'asc',
      });

      if (offset !== undefined) {
        setAnnouncements([...announcements, ...result]);
      } else {
        setAnnouncements(result);
      }

      setHasMore(result.length >= PAGE_LIMIT);
    } catch (e) {
      console.error('Error fetching announcements:', e);
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }

  const { containerRef } = useInfiniteScroll(getAnnouncementsList, hasMore, {
    limit: PAGE_LIMIT,
    sort: sorting[0],
    filterFields: { activeFilter },
  });

  function onActiveInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setActiveFilter(e.target.checked);
  }

  return (
    <div ref={containerRef} className="vertical-scrollable-container">
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
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ verticalAlign: 'middle' }}
                  >
                    <span>
                      {flexRender(t(header.column.columnDef.header as string), header.getContext())}
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </Table>
      ) : (
        <p className="no_announcements">{t('announcements.no_announcements')}</p>
      )}
    </div>
  );
};

export default AnnouncementsList;
