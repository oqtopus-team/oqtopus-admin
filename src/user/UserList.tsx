import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';

import BaseLayout from '../common/BaseLayout';
import { getUsers } from './UserApi';
import { User, UserSearchParams } from '../types/UserType';
import { useAuth } from '../hooks/use-auth';
import { useLoading, useSetLoading } from '../common/Loader';
import UserListItem from './UserListItem';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

const appName: string = import.meta.env.VITE_APP_NAME;
const useUsername: boolean = import.meta.env.VITE_USE_USERNAME === 'enable';
const useOrganization: boolean = import.meta.env.VITE_USE_ORGANIZATION === 'enable';
const limit = 100; // the number of users to be fetched at once in infinite scroll

const columnHelper = createColumnHelper<User>();

const UserList: React.FunctionComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const loading = useLoading();
  const setLoading = useSetLoading();

  const auth = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const urlParams = Object.fromEntries(searchParams.entries());

  async function getUsersList({
    filterFields,
    offset,
    sort,
  }: {
    offset?: number;
    sort?: ColumnSort;
    filterFields?: UserSearchParams;
  } = {}) {
    setLoading(true);
    try {
      const usersResponse = await getUsers(auth.idToken, {
        offset,
        limit,
        sort,
        filterFields,
      });

      if (offset !== undefined) {
        setUsers([...users, ...usersResponse]);
      } else {
        setUsers(usersResponse);
      }

      setHasMore(usersResponse?.length >= limit);
    } catch (e) {
      console.error('Error fetching announcements:', e);
    } finally {
      setLoading(false);
    }
  }

  const { containerRef } = useInfiniteScroll(getUsersList, hasMore, { limit, sort: sorting[0] });

  // User list filters form
  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: urlParams.name,
      group_id: urlParams.group_id,
      email: urlParams.email,
      organization: urlParams.organization,
      status: urlParams.status,
    },
  });

  const columns = useMemo<Array<ColumnDef<User, any>>>(
    () => [
      columnHelper.accessor('email', {
        header: 'users.mail',
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

      columnHelper.accessor('group_id', {
        header: 'users.group_id',
        enableSorting: true,
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.accessor('name', {
        header: 'users.name',
        enableSorting: true,
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.accessor('organization', {
        header: 'users.organization',
        enableSorting: true,
        cell: ({ getValue }) => getValue(),
      }),

      columnHelper.display({
        id: 'operations',
        header: 'users.list.operations',
        enableSorting: false,
        cell: ({ row }) => row,
      }),
    ],
    [loading]
  );

  const table = useReactTable<User>({
    columns,
    data: users,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const onSubmit = async (formValues: UserSearchParams): Promise<void> => {
    const filtered = Object.fromEntries(
      Object.entries(formValues).filter(([_, value]) => value !== '' && value != null)
    );

    setSearchParams(filtered);
  };

  const handleCustomSort = async (column: string) => {
    const currentSort = sorting.find((s) => s.id === column);
    const newDesc = currentSort ? !currentSort.desc : false;

    const newSorting = [{ id: column, desc: newDesc }];

    try {
      await getUsersList({
        sort: newSorting[0],
        filterFields: urlParams,
      });

      setSorting(newSorting);
    } catch (e) {}
  };

  const onDeleteUser = (userId: string) => {
    setUsers((prevUsersState) => prevUsersState.filter(({ id }) => userId !== id));
  };

  useEffect(() => {
    document.title = `${t('users.title')} | ${appName}`;
  }, [auth.idToken]);

  useEffect(() => {
    getUsersList({ filterFields: urlParams });
  }, [searchParams]);

  return (
    <BaseLayout>
      <Stack gap={3} className="vertical-scroll-intermediate-container">
        <Card>
          <Card.Header>{t('users.list.header')}</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>{t('users.mail')}</Form.Label>
                  <Form.Control
                    type="email"
                    autoComplete="off"
                    placeholder="Enter Email"
                    {...register('email')}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>{t('users.group_id')}</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    placeholder="Enter GroupID"
                    {...register('group_id')}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                {useUsername ? (
                  <Form.Group as={Col}>
                    <Form.Label>{t('users.name')}</Form.Label>
                    <Form.Control
                      autoComplete="off"
                      placeholder="Enter Name"
                      {...register('name')}
                    />
                  </Form.Group>
                ) : (
                  ''
                )}
                {useOrganization ? (
                  <Form.Group as={Col}>
                    <Form.Label>{t('users.organization')}</Form.Label>
                    <Form.Control
                      autoComplete="off"
                      placeholder="Enter Organization"
                      {...register('organization')}
                    />
                  </Form.Group>
                ) : (
                  ''
                )}
              </Row>
              <Row>
                <Form.Group as={Col} className="col-6 mb-3">
                  <Form.Label>{t('users.status.name')}</Form.Label>
                  <Form.Select {...register('status')}>
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

        <div ref={containerRef} className="vertical-scroll-intermediate-container overflow-x-auto">
          {users.length > 0 ? (
            <Table bordered hover style={{ marginTop: '10px' }}>
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
                {table.getRowModel().rows.map((row) => (
                  <UserListItem
                    key={row.original.id}
                    user={row.original}
                    execFunction={onDeleteUser}
                  />
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="mb-0 p-3 text-center" style={{ fontSize: '20px' }}>
              No results found
            </p>
          )}
        </div>
      </Stack>
    </BaseLayout>
  );
};

export default UserList;
