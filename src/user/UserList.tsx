import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import { useLocation, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import BaseLayout from '../common/BaseLayout';
import UserListItem from './UserListItem';
import { searchUsers } from './UserApi';
import { User, UserSearchParams, UserStatus } from '../types/UserType';
import { useAuth } from '../hooks/use-auth';
import { useSetLoading } from '../common/Loader';
import { useTranslation } from 'react-i18next';

const appName: string = import.meta.env.VITE_APP_NAME;
const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';
const useOrganization: boolean = import.meta.env.VITE_USE_ORGANIZATION === 'enable';
const limit = 1000; // the number of users to be fetched at once in infinite scroll

const UserList: React.FunctionComponent = () => {
  // list users
  const [users, setUsers] = useState<User[]>([]);
  const [customPage, setCustomPage] = useState(0);
  const [, setResetPage] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const setLoading = useSetLoading();
  const auth = useAuth();
  const [params, setParams] = useState<UserSearchParams>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('users.title')} | ${appName}`;
  }, [auth.idToken]);

  // set parameters
  const setSearchParams = (): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach((entry: string[]) => {
      if (entry[1] !== '') {
        searchParams.set(entry[0], entry[1]);
      }
    });
    searchParams.sort();

    const search = searchParams.toString();
    navigate({
      pathname: location.pathname,
      search,
    });
    return search;
  };

  // get parameters
  const getSearchParams = useCallback((): UserSearchParams => {
    const searchParams = new URLSearchParams(location.search.slice(1));

    const userSearchParams: UserSearchParams = {};
    searchParams.forEach((value: string, key: string) => {
      userSearchParams[key as keyof UserSearchParams] = value;
    });

    setParams(userSearchParams);
    return userSearchParams;
  }, [location.search]);

  useLayoutEffect(() => {
    // The processing to be done before drawing the DOM (before firing infinite scroll) at the time of the first reading/search execution (when the query parameter changes)
    // Get URL parameters, clear the acquired user, reset the page number, and set the read flag
    getSearchParams();
    setUsers([]);
    setResetPage(true);
    setHasMore(true);
  }, [getSearchParams]);

  // search users
  const { handleSubmit, register } = useForm();

  const onSubmit = (): void => {
    // Redraw by changing the query parameter when the search button is pressed.
    const oldSearch = location.search.slice(1);
    const search = setSearchParams();

    // If there is no change, the redraw will not run, so manually redraw
    // @memo: If redraw manually when there is a change, 
    // infinite scroll will work twice in useLayoutEffect() and the page number will be corrupted
    if (oldSearch === search) getUsersAgain();
  };

  // get users again
  const getUsersAgain = (): void => {
    // work when the user status is changed, etc.
    // The search parameters are the same, and read from page 1
    setResetPage(true);
    getUsersScroll();
  };

  // get infinite-scroll
  const getUsersScroll = (): void => {
    setHasMore(false); // False to prevent continuous firing
    setLoading(true);

    setResetPage((reset) => {
      const loadingPage = reset ? 1 : customPage + 1;
      setCustomPage(loadingPage);

      setParams((p) => {
        searchUsers(p, auth.idToken, (loadingPage - 1) * limit, limit)
          .then((res: User[]) => {
            if (res !== null) {
              if (loadingPage === 1) {
                setUsers(res);
              } else {
                setUsers([...users, ...res]);
              }
              if (res.length === limit) {
                setHasMore(true); // able to read more
              }
            } else {
              setUsers([]);
            }
          })
          .catch((e) => console.error(e))
          .finally(() => {
            setLoading(false);
          });

        return p;
      });

      return false; // Turn off the page reset flag once loaded
    });
  };

  return (
    <BaseLayout>
      <Stack gap={3}>
        <Card>
          <Card.Header>{t('users.list.header')}</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>{t('users.mail')}</Form.Label>
                  <Form.Control
                    type="email"
                    value={params.email ?? ''}
                    autoComplete="off"
                    placeholder="Enter Email"
                    {...register('email')}
                    onChange={(e) => setParams({ ...params, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>{t('users.group_id')}</Form.Label>
                  <Form.Control
                    value={params.group_id ?? ''}
                    autoComplete="off"
                    placeholder="Enter GroupID"
                    {...register('group_id')}
                    onChange={(e) => setParams({ ...params, group_id: e.target.value })}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                {useUsername ? (
                  <Form.Group as={Col}>
                    <Form.Label>{t('users.name')}</Form.Label>
                    <Form.Control
                      value={params.name ?? ''}
                      autoComplete="off"
                      placeholder="Enter Name"
                      {...register('name')}
                      onChange={(e) => setParams({ ...params, name: e.target.value })}
                    />
                  </Form.Group>
                ) : (
                  ''
                )}
                {useOrganization ? (
                  <Form.Group as={Col}>
                    <Form.Label>{t('users.organization')}</Form.Label>
                    <Form.Control
                      value={params.organization ?? ''}
                      autoComplete="off"
                      placeholder="Enter Organization"
                      {...register('organization')}
                      onChange={(e) => setParams({ ...params, organization: e.target.value })}
                    />
                  </Form.Group>
                ) : (
                  ''
                )}
              </Row>
              <Row>
                <Form.Group as={Col} className="col-6 mb-3">
                  <Form.Label>{t('users.status.name')}</Form.Label>
                  <Form.Select
                    value={params.status ?? ''}
                    {...register('status')}
                    onChange={(e) => setParams({ ...params, status: e.target.value as UserStatus })}
                  >
                    <option value="">Choose Status</option>
                    <option value="approved">{t('users.status.approved')}</option>
                    <option value="unapproved">{t('users.status.unapproved')}</option>
                    <option value="suspended">{t('users.status.suspended')}</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Button variant="primary" type="submit">
                {t('users.list.search_button')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>{t('users.mail')}</th>
              <th>{t('users.group_id')}</th>
              {useUsername ? <th>{t('users.name')}</th> : ''}
              {useOrganization ? <th>{t('users.organization')}</th> : ''}
              <th>{t('users.list.operations')}</th>
            </tr>
          </thead>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            {useUsername ? <col style={{ width: '15%' }} /> : ''}
            {useOrganization ? <col style={{ width: '15%' }} /> : ''}
            <col style={{ width: '20%' }} />
          </colgroup>
          <InfiniteScroll
            pageStart={0}
            loadMore={getUsersScroll}
            hasMore={hasMore}
            element={'tbody'}
            useWindow={true}
            threshold={1000} // need to be adjusted
          >
            {users.map((user) => {
              return <UserListItem key={user.id} user={user} execFunction={getUsersAgain} />;
            })}
          </InfiniteScroll>
        </Table>
      </Stack>
    </BaseLayout>
  );
};

export default UserList;
