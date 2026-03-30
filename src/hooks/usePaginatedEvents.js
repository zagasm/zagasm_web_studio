import { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api, authHeaders } from "../lib/apiClient";
import { useAuth } from "../pages/auth/AuthContext";

export default function usePaginatedEvents(endpoint) {
  const { token, user } = useAuth();
  const userKey = user?.user_id || user?.id || "anonymous";

  const query = useInfiniteQuery({
    queryKey: ["paginated-events", endpoint, userKey],
    enabled: Boolean(user && endpoint),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(endpoint, {
        ...authHeaders(token),
        params: { page: pageParam },
      });

      const data = res?.data?.data ?? [];
      const meta = res?.data?.meta ?? {
        current_page: pageParam,
        last_page: 1,
        total: data.length,
      };

      return {
        items: data,
        meta: {
          current_page: Number(meta.current_page ?? pageParam),
          last_page: Number(meta.last_page ?? 1),
          total: Number(meta.total ?? data.length),
        },
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page >= lastPage.meta.last_page) {
        return undefined;
      }

      return lastPage.meta.current_page + 1;
    },
  });

  const items = useMemo(
    () => query.data?.pages?.flatMap((page) => page.items) ?? [],
    [query.data]
  );

  const meta = useMemo(() => {
    return (
      query.data?.pages?.[query.data.pages.length - 1]?.meta ?? {
        current_page: 1,
        last_page: 1,
        total: 0,
      }
    );
  }, [query.data]);

  const refresh = useCallback(() => {
    query.refetch();
  }, [query]);

  const loadNext = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    query.fetchNextPage();
  }, [query]);

  return {
    items,
    meta,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    error: query.error,
    refresh,
    loadNext,
  };
}
