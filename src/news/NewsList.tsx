import BaseLayout from '../common/BaseLayout';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { dateDisplay } from '../device/_components/DateDisplay';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Announcement, deleteAnnouncement, getAnnouncements } from './NewsApi';
import { useAuth } from '../hooks/use-auth';

const NewsList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingState, setLoading] = useState({
    delete: false,
    get: false,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleEditPost = (postId: number) => {
    navigate(`/news/edit/${postId}`);
  };

  const handleDeletePost = async (announcementId: number) => {
    setLoading({ ...loadingState, delete: true });
    try {
      await deleteAnnouncement(announcementId, auth.idToken);

      setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementId));
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
        <Link to={'/news/create'}>
          <Button size="sm" style={{ width: '75px' }}>
            {t('users.white_list.register.button.add')}
          </Button>
        </Link>
        <Table bordered hover responsive style={{ marginTop: '10px' }}>
          <thead className="table-light">
            <tr className="text-center">
              <th>{t('news.title')}</th>
              <th>{t('news.publish_start_date')}</th>
              <th>{t('news.publish_end_date')}</th>
              <th>{t('news.publish_setting')}</th>
              <th>{t('news.actions.title')}</th>
              <th>{t('news.save_time')}</th>
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
                  <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                      disabled={loadingState.delete}
                      onClick={() => {
                        handleEditPost(announcement.id);
                      }}
                      style={{ width: '45%' }}
                    >
                      {t('news.actions.edit')}
                    </Button>
                    <Button
                      disabled={loadingState.delete}
                      variant="danger"
                      onClick={() => handleDeletePost(announcement.id)}
                      style={{ width: '45%' }}
                    >
                      {t('news.actions.delete')}
                    </Button>
                  </td>
                  <td>{dateDisplay(Date.now())}</td>
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
      </BaseLayout>
    </>
  );
};

export default NewsList;
