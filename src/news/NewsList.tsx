import BaseLayout from '../common/BaseLayout';
import Table from 'react-bootstrap/Table';
import InfiniteScroll from 'react-infinite-scroller';
import WhitelistUserListItem from '../whitelist_user/WhitelistUserListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { dateDisplay } from '../device/_components/DateDisplay';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

const NewsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isPublishable = true;

  const handleEditPost = (postId: string) => {
    navigate(`/news/edit/${postId}`);
  };

  const handleDeletePost = () => {
    console.log('delete post');
  };

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
            <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <td
                style={{
                  maxWidth: '130px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Some title Some title Some title
              </td>
              <td>{dateDisplay(Date.now())}</td>
              <td>{dateDisplay(Date.now())}</td>
              <td
                style={{
                  color: isPublishable ? '#316cf4' : '#fc6464',
                }}
              >
                {isPublishable ? 'publishable' : 'unpublishable'}
              </td>
              <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  onClick={() => {
                    //TODO: Map posts and put correct post ID
                    handleEditPost('123123');
                  }}
                  style={{ width: '45%' }}
                >
                  {t('news.actions.edit')}
                </Button>
                <Button variant="danger" onClick={handleDeletePost} style={{ width: '45%' }}>
                  {t('news.actions.delete')}
                </Button>
              </td>
              <td>{dateDisplay(Date.now())}</td>
            </tr>
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
