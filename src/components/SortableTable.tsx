import React from 'react';
import Table from 'react-bootstrap/Table';
import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface SortableTableProps<T> {
  table: ReactTable<T>;
  data: T[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  emptyMessage?: string;
  containerClassName?: string;
  tableProps?: {
    bordered?: boolean;
    hover?: boolean;
    responsive?: boolean;
    style?: React.CSSProperties;
  };
  rowStyle?: React.CSSProperties;
  emptyMessageStyle?: React.CSSProperties;
  emptyMessageClassName?: string;
}

const SortableTable = <T,>({
  table,
  data,
  containerRef,
  emptyMessage,
  containerClassName = 'vertical-scroll-intermediate-container overflow-x-auto',
  tableProps = { bordered: true, hover: true },
  rowStyle,
  emptyMessageStyle = { fontSize: '20px' },
  emptyMessageClassName = 'mb-0 p-3 text-center',
}: SortableTableProps<T>) => {
  const { t } = useTranslation();

  const defaultEmptyMessage = emptyMessage || 'common.no_results_found';

  return (
    <div ref={containerRef} className={containerClassName}>
      {data.length > 0 ? (
        <Table {...tableProps} style={{ marginTop: '10px', ...tableProps.style }}>
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
              <tr key={row.id} style={rowStyle}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className={emptyMessageClassName} style={emptyMessageStyle}>
          {t(defaultEmptyMessage)}
        </p>
      )}
    </div>
  );
};

export default SortableTable;
