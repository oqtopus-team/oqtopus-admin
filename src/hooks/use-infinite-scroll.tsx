import { useEffect, useMemo, useRef, useState } from 'react';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';

export function useInfiniteScroll<T>(
  callback: (props: { offset?: number; sort?: ColumnSort; filterFields?: T }) => Promise<void>,
  hasMore: boolean,
  {
    threshold = 250,
    limit = 1000,
    sort,
    filterFields,
  }: {
    threshold?: number;
    limit?: number;
    sort?: ColumnSort;
    filterFields?: T;
  } = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const [offset, setOffset] = useState(limit);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fix for React closure stale state - ensures handleScroll always uses current offset value
  // instead of capturing old values from closure, preventing duplicate API calls
  const stateRef = useRef({
    isFetching: false,
    offset: limit,
    hasMore: true,
  });

  stateRef.current = {
    isFetching,
    offset,
    hasMore,
  };

  const stableSort = useMemo(() => sort, [sort?.id, sort?.desc]);
  const stableFilterFields = useMemo(() => filterFields, [JSON.stringify(filterFields)]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const currentState = stateRef.current;

      if (
        scrollTop + clientHeight >= scrollHeight - threshold &&
        currentState.hasMore &&
        !currentState.isFetching
      ) {
        setIsFetching(true);

        const currentOffset = currentState.offset;

        callback({
          offset: currentOffset,
          sort,
          filterFields,
        }).finally(() => {
          setIsFetching(false);
        });

        setOffset((prevOffset) => {
          const newOffset = prevOffset + limit;
          return newOffset;
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [callback, threshold, limit, sort, filterFields]);

  // Reset offset when sort or filterFields change
  useEffect(() => {
    // Skip resetting if offset already initial
    if (offset === limit) return;

    setOffset(limit);
    // Immediately update ref to prevent stale state
    stateRef.current = {
      ...stateRef.current,
      offset: 0,
    };
  }, [stableSort, stableFilterFields]);

  return { containerRef, isFetching, offset };
}
