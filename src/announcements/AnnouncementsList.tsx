import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { dateDisplay } from '../device/_components/DateDisplay';
import { useAuth } from '../hooks/use-auth';
import BaseLayout from '../common/BaseLayout';
import { Announcement, deleteAnnouncement, getAnnouncements } from './AnnouncementApi';
import styles from './announcementsList.module.css';

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingState, setLoading] = useState({
    delete: false,
    get: false,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleEditPost = (postId: number) => {
    navigate(`/announcements/edit/${postId}`);
  };

  const handleDeletePost = async (announcementId: number) => {
    setLoading({ ...loadingState, delete: true });
    try {
      await deleteAnnouncement(announcementId, auth.idToken);

      setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementId));

      alert(t('announcements.deleted_success'))
    } catch (e) {
      console.error('Error deleting announcement:', e);
    } finally {
      setLoading({ ...loadingState, delete: false });
    }
  };

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
              <tr className="text-center">
                <th>{t('announcements.title')}</th>
                <th>{t('announcements.publish_start_date')}</th>
                <th>{t('announcements.publish_end_date')}</th>
                <th>{t('announcements.publish_setting')}</th>
                <th>{t('announcements.actions.title')}</th>
                <th>{t('announcements.save_time')}</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => {
                return (
                  <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
                    <td>{dateDisplay(announcement.start_time)}</td>
                    <td>{dateDisplay(announcement.end_time)}</td>
                    <td
                      style={{
                        color: announcement.publishable ? '#316cf4' : '#fc6464',
                      }}
                    >
                      {announcement.publishable ? 'publishable' : 'unpublishable'}
                    </td>
                    <td className={styles.action_cell}>
                      <Button
                        disabled={loadingState.delete}
                        onClick={() => {
                          handleEditPost(announcement.id);
                        }}
                        className={styles.action_button}
                      >
                        {t('announcements.actions.edit')}
                      </Button>
                      <Button
                        disabled={loadingState.delete}
                        variant="danger"
                        onClick={() => handleDeletePost(announcement.id)}
                        className={styles.action_button}
                      >
                        {t('announcements.actions.delete')}
                      </Button>
                    </td>
                    <td>{dateDisplay(announcement.updated_at)}</td>
                  </tr>
                );
              })}
            </tbody>
            {/*<InfiniteScroll*/}
            {/*  pageStart={0}*/}
            {/*  loadMore={getUsersScroll}*/}
            {/*  hasMore={hasMore}*/}
            {/*  element={'tbody'}*/}
            {/*  useWindow={true}*/}
            {/*  threshold={1000} // need to be adjusted*/}
            {/*>*/}
            {/*  {users.map((user) => {*/}
            {/*    return (*/}
            {/*      <WhitelistUserListItem key={user.id} user={user} execFunction={getUsersAgain} />*/}
            {/*    );*/}
            {/*  })}*/}
            {/*</InfiniteScroll>*/}
          </Table>
        ) : (
          <p className={styles.no_announcements}>{t('announcements.no_announcements')}</p>
        )}
      </BaseLayout>
    </>
  );
};

export default AnnouncementsList;
