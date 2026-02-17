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
  const [offset, setOffset] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fix for React closure stale state - ensures handleScroll always uses current offset value
  // instead of capturing old values from closure, preventing duplicate API calls
  const stateRef = useRef({
    isFetching: false,
    offset: 0,
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

        const nextOffset = currentState.offset + limit;

        callback({
          offset: nextOffset,
          sort,
          filterFields,
        }).finally(() => {
          setIsFetching(false);
        });

        setOffset(nextOffset);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [callback, threshold, limit, sort, filterFields]);

  // Initial load and reset when sort or filterFields change
  useEffect(() => {
    const loadInitialData = async () => {
      if (isFetching) return;

      setIsFetching(true);
      setOffset(0);
      setIsInitialized(false);

      try {
        await callback({
          offset: undefined, // undefined offset means initial load
          sort,
          filterFields,
        });
        setIsInitialized(true);
      } finally {
        setIsFetching(false);
      }
    };

    loadInitialData();
  }, [stableSort, stableFilterFields]);

  // Auto-load more data if content doesn't fill the screen
  useEffect(() => {
    if (!isInitialized || !containerRef.current || isFetching || !hasMore) return;

    const container = containerRef.current;
    const { scrollHeight, clientHeight } = container;

    // If content doesn't fill the screen, load more data
    if (scrollHeight <= clientHeight) {
      setIsFetching(true);

      const nextOffset = offset + limit;

      callback({
        offset: nextOffset,
        sort,
        filterFields,
      }).finally(() => {
        setIsFetching(false);
      });

      setOffset(nextOffset);
    }
  }, [isInitialized, hasMore, isFetching, offset, limit, sort, filterFields]);

  return { containerRef, isFetching, offset };
}
