import React, { useState } from 'react';
import { Device, DeviceStatusType, DeviceType } from '../types/DeviceType';
import Table from 'react-bootstrap/Table';
import {
  ColumnDef,
  CellContext,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  createColumnHelper,
} from '@tanstack/react-table';
import Nav from 'react-bootstrap/Nav';
import { useTranslation } from 'react-i18next';
import { dateDisplay } from './common/DateDisplay';

interface TableProps {
  devices: Device[];
}

export const SortDeviceTable: React.FC<TableProps> = ({ devices }): JSX.Element => {
  const columnHelper = createColumnHelper<Device>();
  const { t } = useTranslation();
  const columns: Array<ColumnDef<Device, any>> = [
    columnHelper.accessor('id', {
      header: t('device.id'),
      cell: (info: CellContext<Device, string>) => {
        try {
          const id: string = info.getValue();
          return (
            <Nav.Link
              href={`/device/${id}`}
              className="text-link"
              style={{ color: 'blue', fontWeight: 'bold' }}
            >
              {id}
            </Nav.Link>
          );
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('status', {
      header: t('device.status'),
      cell: (info: CellContext<Device, DeviceStatusType>) => {
        try {
          const status: DeviceStatusType = info.getValue();
          return <p> {status} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('nQubits', {
      header: t('device.qubits'),
      cell: (info: CellContext<Device, number>) => {
        try {
          const qubits: number = info.getValue();
          return <p> {qubits} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('deviceType', {
      header: t('device.device_type'),
      cell: (info: CellContext<Device, DeviceType>) => {
        try {
          const deviceType: DeviceType = info.getValue();
          return <p> {deviceType} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('nPendingJobs', {
      header: t('device.pending_jobs'),
      cell: (info: CellContext<Device, number>) => {
        try {
          const pendingJobs: number = info.getValue();
          return <p> {pendingJobs} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('basisGates', {
      header: t('device.basis_gates'),
      cell: (info: CellContext<Device, string[]>) => {
        try {
          const basisGates: string[] = info.getValue();
          return <p> {basisGates.join(', ')} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('supportedInstructions', {
      header: t('device.instructions'),
      cell: (info: CellContext<Device, string[]>) => {
        try {
          const instructions: string[] = info.getValue();
          return <p> {instructions.join(', ')} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('description', {
      header: t('device.description'),
      cell: (info: CellContext<Device, string>) => {
        try {
          const description: string = info.getValue();
          return <p> {description} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
    columnHelper.accessor('availableAt', {
      header: t('device.available_at'),
      cell: (info: CellContext<Device, string>) => {
        try {
          const availableAt: string = info.getValue();
          const local_availableAt: string = dateDisplay(availableAt);
          return <p> {local_availableAt} </p>;
        } catch (e) {
          return <p> - </p>;
        }
      },
    }),
  ];
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: devices,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table bordered hover responsive>
      <thead className="table-light">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="text-center">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{ textAlign: 'center' }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                <span>
                  {header.column.getCanSort() &&
                    (header.column.getIsSorted() === 'desc'
                      ? ' ↓'
                      : header.column.getIsSorted() === 'asc'
                      ? ' ↑'
                      : ' ⇅')}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={{ textAlign: 'center' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
