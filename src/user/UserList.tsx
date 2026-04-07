import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import SortableTable from '../components/SortableTable';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';
import { useUserAPI } from './UserApi';
import { User, UserSearchParams } from '../types/UserType';
import { useAuth } from '../hooks/use-auth';
import { useLoading, useSetLoading } from '../common/Loader';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { EmailCell } from './tableCells/EmailCell';
import { AvailableDevicesCell } from './tableCells/AvailableDevicesCell';
import { OperationsCell } from './tableCells/OperationsCell';
import { UsersUserStatus } from '../api/generated';

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

  const { getUsers } = useUserAPI();

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
    await getUsers(offset, limit, sort, filterFields)
      .then((usersResponse) => {
        if (offset !== undefined) {
          setUsers([...users, ...usersResponse]);
        } else {
          setUsers(usersResponse);
        }
        setHasMore(usersResponse?.length >= limit);
      })
      .finally(() => setLoading(false));
  }

  const { containerRef } = useInfiniteScroll(getUsersList, hasMore, {
    limit,
    sort: sorting[0],
    filterFields: urlParams as UserSearchParams,
  });

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
        cell: ({ row }) => <EmailCell user={row.original} />,
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

      columnHelper.accessor('available_devices', {
        header: 'users.available_devices',
        enableSorting: true,
        cell: ({ row }) => <AvailableDevicesCell user={row.original} />,
      }),

      columnHelper.display({
        id: 'operations',
        header: 'users.list.operations',
        enableSorting: false,
        cell: ({ row }) => (
          <OperationsCell
            user={row.original}
            execFunctions={{ delete: onDeleteUser, changeStatus: onStatusChangeUser }}
          />
        ),
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
      columnVisibility: {
        name: useUsername,
        organization: useOrganization,
      },
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    },
  });

  const onSubmit = async (formValues: UserSearchParams): Promise<void> => {
    if (containerRef.current) {
      // Scroll top after applying filter, to avoid bugs related with infinite scroll
      containerRef.current.scrollTop = 0;
    }

    const filtered = Object.fromEntries(
      Object.entries(formValues).filter(([_, value]) => value !== '' && value != null)
    );

    setSearchParams(filtered);
  };

  const onDeleteUser = (userId: string) => {
    setUsers((prevUsersState) => prevUsersState.filter(({ id }) => userId !== id));
  };

  const onStatusChangeUser = (userId: string, status: UsersUserStatus) => {
    setUsers((users) => users.map((user) => (user.id === userId ? { ...user, status } : user)));
  };

  useEffect(() => {
    document.title = `${t('users.title')} | ${appName}`;
  }, [auth.idToken]);

  return (
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
              {useUsername && (
                <Form.Group as={Col}>
                  <Form.Label>{t('users.name')}</Form.Label>
                  <Form.Control autoComplete="off" placeholder="Enter Name" {...register('name')} />
                </Form.Group>
              )}
              {useOrganization && (
                <Form.Group as={Col}>
                  <Form.Label>{t('users.organization')}</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    placeholder="Enter Organization"
                    {...register('organization')}
                  />
                </Form.Group>
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

      <SortableTable
        table={table}
        data={users}
        containerRef={containerRef}
        emptyMessage="users.list.no_users_found"
      />
    </Stack>
  );
};

export default UserList;
