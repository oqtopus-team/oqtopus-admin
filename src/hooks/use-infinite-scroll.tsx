import { useEffect, useRef, useState } from 'react';
import { ColumnSort } from '@tanstack/table-core/src/features/RowSorting';

export function useInfiniteScroll(
  callback: (props: {offset?: number, sort?: ColumnSort}) => Promise<void>,
  hasMore: boolean,
  {
    threshold = 250,
    limit = 1000,
    sort
  }: {
    threshold?: number;
    limit?: number;
    sort?: ColumnSort
  } = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const [offset, setOffset] = useState(limit);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - threshold && hasMore && !isFetching) {
        setIsFetching(true);
        callback({ offset, sort: sort }).finally(() => {
          setIsFetching(false);
          setOffset(prevOffset => prevOffset + limit);
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore, threshold, isFetching, offset]);

  return { containerRef, isFetching, offset };
}
