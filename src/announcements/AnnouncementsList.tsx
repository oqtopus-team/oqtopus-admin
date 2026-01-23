import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [activeFilter, setActiveFilter] = useState(false);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getAnnouncements, deleteAnnouncement } = useAnnouncementAPI();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  async function getAnnouncementsList(reset = false) {
    if (loadingState.get) return;

    setLoading((prev) => ({ ...prev, get: true }));

    const currentPage = reset ? 0 : page;

    try {
      const result = await getAnnouncements({
        currentTime: activeFilter ? new Date().toISOString() : undefined,
        offset: PAGE_LIMIT * currentPage,
        order: sorting[0]?.desc ? 'desc' : 'asc',
        // sortBy: sorting[0]?.id, // TODO: Implement sorting by different columns on BE first
      });

      setHasMore(result.length === PAGE_LIMIT);
      setPage(currentPage + 1);

      if (reset) {
        setAnnouncements(result);
      } else {
        setAnnouncements((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const unique = result.filter((a) => !existingIds.has(a.id));
          return [...prev, ...unique];
        });
      }
    } catch (e) {
      console.error('Error fetching announcements:', e);
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }

  function onActiveInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setActiveFilter(e.target.checked);
  }

  useEffect(() => {
    getAnnouncementsList(true);
  }, []);

  useEffect(() => {
    if (sorting.length === 0) return;
    getAnnouncementsList(true);
  }, [sorting]);

  useEffect(() => {
    getAnnouncementsList(true);
  }, [activeFilter]);

  useEffect(() => {
    if (!scrollContainerRef.current || !hasMore || loadingState.get) return;

    if (scrollContainerRef.current.scrollHeight <= scrollContainerRef.current.clientHeight) {
      getAnnouncementsList(false);
    }
  }, [announcements.length, hasMore, loadingState.get]);

  return (
    <div id={'scroll-target'} ref={scrollContainerRef} className="vertical-scrollable-container">
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
                      onClick={header.column.getToggleSortingHandler()}
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
